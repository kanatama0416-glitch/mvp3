-- 不足しているシミュレーション関連テーブルを作成

-- 1. ユーザー学習履歴テーブル
CREATE TABLE IF NOT EXISTS user_learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('customer', 'staff')) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_steps INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  completion_rate NUMERIC(5,2), -- 完了率（%）
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  feedback_summary JSONB, -- AI解析による長所・改善点
  retry_count INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. フィードバック・評価データテーブル
CREATE TABLE IF NOT EXISTS simulation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_history_id UUID REFERENCES user_learning_history(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  user_message TEXT NOT NULL,
  ai_analysis JSONB NOT NULL, -- 感情認識、キーフレーズ抽出、適切さ判定
  feedback_type TEXT CHECK (feedback_type IN ('good', 'warning', 'error')) NOT NULL,
  feedback_message TEXT NOT NULL,
  score_impact INTEGER, -- スコアへの影響（+5, -2など）
  evaluation_score NUMERIC(5,2) CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  improvement_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 会話ログテーブル
CREATE TABLE IF NOT EXISTS simulation_conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_history_id UUID REFERENCES user_learning_history(id) ON DELETE CASCADE,
  message_order INTEGER NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
  message_content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emotion_detected TEXT,
  keywords_detected TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_user_learning_history_user_id ON user_learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_scenario_id ON user_learning_history(scenario_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_started_at ON user_learning_history(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_simulation_feedback_learning_history_id ON simulation_feedback(learning_history_id);

CREATE INDEX IF NOT EXISTS idx_conversation_logs_learning_history_id ON simulation_conversation_logs(learning_history_id);

-- RLS有効化
ALTER TABLE user_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_conversation_logs ENABLE ROW LEVEL SECURITY;

-- RLSポリシー作成（ユーザーは自分のデータのみ閲覧可能）
CREATE POLICY "Users can view their own learning history"
  ON user_learning_history FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own learning history"
  ON user_learning_history FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own learning history"
  ON user_learning_history FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view feedback for their learning history"
  ON simulation_feedback FOR SELECT
  USING (
    learning_history_id IN (
      SELECT id FROM user_learning_history WHERE user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view their conversation logs"
  ON simulation_conversation_logs FOR SELECT
  USING (
    learning_history_id IN (
      SELECT id FROM user_learning_history WHERE user_id::text = auth.uid()::text
    )
  );

-- トリガー作成（updated_atの自動更新）
CREATE OR REPLACE FUNCTION update_user_learning_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_learning_history_updated_at
  BEFORE UPDATE ON user_learning_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_learning_history_updated_at();

-- コメント追加
COMMENT ON TABLE user_learning_history IS 'ユーザーのシミュレーション学習履歴';
COMMENT ON TABLE simulation_feedback IS 'シミュレーションステップごとのAIフィードバック';
COMMENT ON TABLE simulation_conversation_logs IS 'シミュレーション内の会話ログ';
