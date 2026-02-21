-- ========================================
-- AIシミュレーション用データベーススキーマ
-- ========================================

-- 1. シナリオ情報テーブル（拡張版）
CREATE TABLE IF NOT EXISTS simulation_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  category TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  objectives TEXT[] NOT NULL,
  duration INTEGER NOT NULL,
  icon TEXT,
  total_steps INTEGER DEFAULT 5,
  step_structure JSONB, -- ステップごとのAI発話と期待される応答
  reference_materials JSONB, -- 参考教材のリンク情報
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 顧客ロールプレイ情報テーブル
CREATE TABLE IF NOT EXISTS customer_roleplay (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  character_attributes JSONB NOT NULL, -- 年齢層、性別、態度タイプなど
  initial_message TEXT NOT NULL, -- AIの最初の発話
  emotion_label TEXT CHECK (emotion_label IN ('angry', 'happy', 'confused', 'neutral', 'friendly', 'frustrated')) NOT NULL,
  scenario_branches JSONB, -- ユーザーの返答に応じたAIのセリフパターン
  success_conditions JSONB, -- 達成すべき発話や対応のパターン
  failure_conditions JSONB, -- 避けるべき発話や対応のパターン
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ユーザー学習履歴テーブル
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

-- 4. フィードバック・評価データテーブル
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

-- 5. 教材リンク・関連情報テーブル
CREATE TABLE IF NOT EXISTS learning_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_type TEXT CHECK (material_type IN ('video', 'audio', 'article', 'case_study', 'document')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  thumbnail_url TEXT,
  related_scenario_ids UUID[],
  recommended_timing TEXT CHECK (recommended_timing IN ('before_practice', 'after_practice', 'review')) NOT NULL,
  tags TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER, -- 分単位
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. シナリオステップ詳細テーブル（ステップごとの詳細管理）
CREATE TABLE IF NOT EXISTS scenario_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  ai_message TEXT NOT NULL,
  expected_keywords TEXT[], -- 期待されるキーワード
  success_patterns TEXT[], -- 成功パターン
  feedback_criteria JSONB, -- フィードバック基準
  hints TEXT[], -- ユーザーへのヒント
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(scenario_id, step_number)
);

-- 7. ユーザー会話ログテーブル
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
CREATE INDEX idx_simulation_scenarios_difficulty ON simulation_scenarios(difficulty);
CREATE INDEX idx_simulation_scenarios_category ON simulation_scenarios(category);
CREATE INDEX idx_customer_roleplay_scenario_id ON customer_roleplay(scenario_id);
CREATE INDEX idx_user_learning_history_user_id ON user_learning_history(user_id);
CREATE INDEX idx_user_learning_history_scenario_id ON user_learning_history(scenario_id);
CREATE INDEX idx_simulation_feedback_learning_history_id ON simulation_feedback(learning_history_id);
CREATE INDEX idx_learning_materials_type ON learning_materials(material_type);
CREATE INDEX idx_scenario_steps_scenario_id ON scenario_steps(scenario_id);
CREATE INDEX idx_conversation_logs_learning_history_id ON simulation_conversation_logs(learning_history_id);

-- Row Level Security有効化
ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_roleplay ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_conversation_logs ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（読み取りは全員可能、書き込みは認証済みユーザーのみ）
CREATE POLICY "シナリオは全員が閲覧可能" ON simulation_scenarios FOR SELECT USING (true);
CREATE POLICY "顧客ロールプレイは全員が閲覧可能" ON customer_roleplay FOR SELECT USING (true);
CREATE POLICY "教材は全員が閲覧可能" ON learning_materials FOR SELECT USING (true);
CREATE POLICY "ステップは全員が閲覧可能" ON scenario_steps FOR SELECT USING (true);

CREATE POLICY "学習履歴は自分のもののみ閲覧可能" ON user_learning_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "学習履歴は自分のもののみ作成可能" ON user_learning_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "学習履歴は自分のもののみ更新可能" ON user_learning_history FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "フィードバックは関連する学習履歴の所有者のみ閲覧可能" ON simulation_feedback FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_learning_history
    WHERE user_learning_history.id = simulation_feedback.learning_history_id
    AND user_learning_history.user_id = auth.uid()
  ));

CREATE POLICY "会話ログは関連する学習履歴の所有者のみ閲覧可能" ON simulation_conversation_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_learning_history
    WHERE user_learning_history.id = simulation_conversation_logs.learning_history_id
    AND user_learning_history.user_id = auth.uid()
  ));

-- トリガー：updated_atの自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_simulation_scenarios_updated_at BEFORE UPDATE ON simulation_scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_roleplay_updated_at BEFORE UPDATE ON customer_roleplay
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_learning_history_updated_at BEFORE UPDATE ON user_learning_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_materials_updated_at BEFORE UPDATE ON learning_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
