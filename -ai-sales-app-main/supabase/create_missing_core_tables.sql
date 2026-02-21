-- 不足しているコアテーブルを作成
-- (users, scenariosは既に存在する前提)

-- 1. learning_sessionsテーブル（拡張カラム含む）
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('customer', 'staff')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 拡張カラム
  total_messages INTEGER DEFAULT 0,
  ai_feedback_summary TEXT,
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5)
);

-- 2. messagesテーブル
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  emotion TEXT CHECK (emotion IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. evaluationsテーブル
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  overall_score NUMERIC(4,2) NOT NULL,
  communication NUMERIC(4,2) NOT NULL,
  empathy NUMERIC(4,2) NOT NULL,
  problem_solving NUMERIC(4,2) NOT NULL,
  product_knowledge NUMERIC(4,2) NOT NULL,
  professionalism NUMERIC(4,2) NOT NULL,
  feedback TEXT NOT NULL,
  improvements TEXT[] NOT NULL,
  strengths TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. growth_recordsテーブル
CREATE TABLE IF NOT EXISTS growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  communication NUMERIC(4,2) NOT NULL,
  empathy NUMERIC(4,2) NOT NULL,
  problem_solving NUMERIC(4,2) NOT NULL,
  product_knowledge NUMERIC(4,2) NOT NULL,
  professionalism NUMERIC(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_scenario_id ON learning_sessions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_session_id ON evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_user_id ON growth_records(user_id);

-- RLS有効化
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;

-- コメント追加
COMMENT ON TABLE learning_sessions IS '学習セッション記録テーブル';
COMMENT ON TABLE messages IS 'セッション内のメッセージ履歴';
COMMENT ON TABLE evaluations IS 'セッション評価結果';
COMMENT ON TABLE growth_records IS 'ユーザーのスキル成長記録';
