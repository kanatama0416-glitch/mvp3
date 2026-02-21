-- learning_sessionsテーブルだけを作成（既にusersとscenariosが存在する前提）

-- learning_sessionsテーブル作成
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
  -- 拡張カラムも同時に追加
  total_messages INTEGER DEFAULT 0,
  ai_feedback_summary TEXT,
  user_satisfaction_rating INTEGER CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_scenario_id ON learning_sessions(scenario_id);

-- RLS有効化
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- コメント追加
COMMENT ON TABLE learning_sessions IS '学習セッション記録テーブル';
COMMENT ON COLUMN learning_sessions.total_messages IS 'セッション内の総メッセージ数';
COMMENT ON COLUMN learning_sessions.ai_feedback_summary IS 'AIによるセッション全体のフィードバック要約';
COMMENT ON COLUMN learning_sessions.user_satisfaction_rating IS 'ユーザーの満足度評価（1-5）';
