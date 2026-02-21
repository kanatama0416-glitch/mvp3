-- ============================================================
-- 📋 Supabase 一括セットアップSQL
-- ============================================================
-- このファイルをSupabase SQL Editorにコピー＆ペーストして
-- 一度に実行するだけでデータベースが完成します。
--
-- 含まれる内容:
--   1. 基本スキーマ（schema.sql）
--   2. シミュレーション機能（simulation_schema.sql）
--   3. イベント管理（events_schema.sql）
--   4. 投稿機能（posts_schema.sql / create_knowhow_posts.sql）
--   5. イベント知識ベース（create_event_knowledge_base.sql）
--   6. マイグレーション（add_password.sql, events_area_migration.sql, learning_sessions_enhancement.sql）
--   7. RLSポリシー（開発用）
--   8. サンプルデータ（seed.sql, scenarios_seed.sql, simulation_seed.sql, events_seed.sql, posts_seed.sql）
--
-- ⚠️ すべて IF NOT EXISTS / IF NOT EXISTS 付きなので
--    既存テーブルがあっても安全に再実行できます。
-- ============================================================


-- ============================================================
-- 1. 基本スキーマ（schema.sql）
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  role TEXT CHECK (role IN ('learner', 'admin')) NOT NULL,
  avatar TEXT,
  participating_events TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'document', 'audio', 'simulation')) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  category TEXT NOT NULL,
  customer_type TEXT NOT NULL,
  objectives TEXT[] NOT NULL,
  duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('customer', 'staff')) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  emotion TEXT CHECK (emotion IN ('positive', 'neutral', 'negative')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table
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

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  progress INTEGER NOT NULL DEFAULT 0,
  max_progress INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning plans table
CREATE TABLE IF NOT EXISTS learning_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('strength', 'improvement')) NOT NULL,
  target_skill TEXT NOT NULL,
  scenarios TEXT[] NOT NULL,
  estimated_duration INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  tags TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  situation TEXT NOT NULL,
  innovation TEXT NOT NULL,
  result TEXT NOT NULL,
  learning TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  visibility TEXT CHECK (visibility IN ('public', 'department', 'theme')) NOT NULL,
  target_department TEXT,
  target_theme TEXT,
  like_count INTEGER DEFAULT 0,
  empathy_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  ai_summary TEXT,
  is_approved_for_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post reactions table (for tracking user reactions)
CREATE TABLE IF NOT EXISTS post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'empathy', 'helpful')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Growth records table
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

-- Indexes (基本スキーマ)
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_scenario_id ON learning_sessions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_session_id ON evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_visibility ON community_posts(visibility);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_user_id ON growth_records(user_id);

-- RLS (基本スキーマ)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 2. シミュレーション機能（simulation_schema.sql）
-- ============================================================

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
  step_structure JSONB,
  reference_materials JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_roleplay (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  character_attributes JSONB NOT NULL,
  initial_message TEXT NOT NULL,
  emotion_label TEXT CHECK (emotion_label IN ('angry', 'happy', 'confused', 'neutral', 'friendly', 'frustrated')) NOT NULL,
  scenario_branches JSONB,
  success_conditions JSONB,
  failure_conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_learning_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('customer', 'staff')) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_steps INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  completion_rate NUMERIC(5,2),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  feedback_summary JSONB,
  retry_count INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS simulation_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_history_id UUID REFERENCES user_learning_history(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  user_message TEXT NOT NULL,
  ai_analysis JSONB NOT NULL,
  feedback_type TEXT CHECK (feedback_type IN ('good', 'warning', 'error')) NOT NULL,
  feedback_message TEXT NOT NULL,
  score_impact INTEGER,
  evaluation_score NUMERIC(5,2) CHECK (evaluation_score >= 0 AND evaluation_score <= 100),
  improvement_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
  duration INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenario_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  ai_message TEXT NOT NULL,
  expected_keywords TEXT[],
  success_patterns TEXT[],
  feedback_criteria JSONB,
  hints TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(scenario_id, step_number)
);

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

-- Indexes (シミュレーション)
CREATE INDEX IF NOT EXISTS idx_simulation_scenarios_difficulty ON simulation_scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_simulation_scenarios_category ON simulation_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_customer_roleplay_scenario_id ON customer_roleplay(scenario_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_user_id ON user_learning_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_history_scenario_id ON user_learning_history(scenario_id);
CREATE INDEX IF NOT EXISTS idx_simulation_feedback_learning_history_id ON simulation_feedback(learning_history_id);
CREATE INDEX IF NOT EXISTS idx_learning_materials_type ON learning_materials(material_type);
CREATE INDEX IF NOT EXISTS idx_scenario_steps_scenario_id ON scenario_steps(scenario_id);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_learning_history_id ON simulation_conversation_logs(learning_history_id);

-- RLS (シミュレーション)
ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_roleplay ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_conversation_logs ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー (シミュレーション) — DROP IF EXISTS で冪等に
DO $$ BEGIN
  DROP POLICY IF EXISTS "シナリオは全員が閲覧可能" ON simulation_scenarios;
  CREATE POLICY "シナリオは全員が閲覧可能" ON simulation_scenarios FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "顧客ロールプレイは全員が閲覧可能" ON customer_roleplay;
  CREATE POLICY "顧客ロールプレイは全員が閲覧可能" ON customer_roleplay FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "教材は全員が閲覧可能" ON learning_materials;
  CREATE POLICY "教材は全員が閲覧可能" ON learning_materials FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "ステップは全員が閲覧可能" ON scenario_steps;
  CREATE POLICY "ステップは全員が閲覧可能" ON scenario_steps FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "学習履歴は自分のもののみ閲覧可能" ON user_learning_history;
  CREATE POLICY "学習履歴は自分のもののみ閲覧可能" ON user_learning_history FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "学習履歴は自分のもののみ作成可能" ON user_learning_history;
  CREATE POLICY "学習履歴は自分のもののみ作成可能" ON user_learning_history FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "学習履歴は自分のもののみ更新可能" ON user_learning_history;
  CREATE POLICY "学習履歴は自分のもののみ更新可能" ON user_learning_history FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "フィードバックは関連する学習履歴の所有者のみ閲覧可能" ON simulation_feedback;
  CREATE POLICY "フィードバックは関連する学習履歴の所有者のみ閲覧可能" ON simulation_feedback FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM user_learning_history
      WHERE user_learning_history.id = simulation_feedback.learning_history_id
      AND user_learning_history.user_id = auth.uid()
    ));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "会話ログは関連する学習履歴の所有者のみ閲覧可能" ON simulation_conversation_logs;
  CREATE POLICY "会話ログは関連する学習履歴の所有者のみ閲覧可能" ON simulation_conversation_logs FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM user_learning_history
      WHERE user_learning_history.id = simulation_conversation_logs.learning_history_id
      AND user_learning_history.user_id = auth.uid()
    ));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_simulation_scenarios_updated_at ON simulation_scenarios;
CREATE TRIGGER update_simulation_scenarios_updated_at BEFORE UPDATE ON simulation_scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_roleplay_updated_at ON customer_roleplay;
CREATE TRIGGER update_customer_roleplay_updated_at BEFORE UPDATE ON customer_roleplay
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_learning_history_updated_at ON user_learning_history;
CREATE TRIGGER update_user_learning_history_updated_at BEFORE UPDATE ON user_learning_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_learning_materials_updated_at ON learning_materials;
CREATE TRIGGER update_learning_materials_updated_at BEFORE UPDATE ON learning_materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 3. イベント管理（events_schema.sql）
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed')) NOT NULL,
  tags TEXT[] NOT NULL,
  stores TEXT[] NOT NULL,
  total_posts INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_reactions INTEGER DEFAULT 0,
  success_patterns TEXT[],
  key_phrases TEXT[],
  ai_summary TEXT,
  image_url TEXT,
  event_type TEXT CHECK (event_type IN ('anime_collab', 'seasonal', 'campaign', 'sale', 'family', 'other')) NOT NULL,
  target_audience TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_event_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS event_best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, post_id)
);

CREATE TABLE IF NOT EXISTS event_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_posts INTEGER DEFAULT 0,
  daily_views INTEGER DEFAULT 0,
  daily_reactions INTEGER DEFAULT 0,
  daily_participants INTEGER DEFAULT 0,
  card_conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, date)
);

CREATE TABLE IF NOT EXISTS event_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_type TEXT CHECK (store_type IN ('marui', 'animate', 'other')) NOT NULL,
  location TEXT NOT NULL,
  is_primary_venue BOOLEAN DEFAULT FALSE,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, store_name)
);

-- Indexes (イベント)
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_event_participation_user_id ON user_event_participation(user_id);
CREATE INDEX IF NOT EXISTS idx_user_event_participation_event_id ON user_event_participation(event_id);
CREATE INDEX IF NOT EXISTS idx_event_best_practices_event_id ON event_best_practices(event_id);
CREATE INDEX IF NOT EXISTS idx_event_best_practices_post_id ON event_best_practices(post_id);
CREATE INDEX IF NOT EXISTS idx_event_metrics_event_id ON event_metrics(event_id);
CREATE INDEX IF NOT EXISTS idx_event_metrics_date ON event_metrics(date);
CREATE INDEX IF NOT EXISTS idx_event_stores_event_id ON event_stores(event_id);

-- RLS (イベント)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_best_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stores ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー (イベント)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Events are viewable by all authenticated users" ON events;
  CREATE POLICY "Events are viewable by all authenticated users" ON events
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Events are insertable by admins only" ON events;
  CREATE POLICY "Events are insertable by admins only" ON events
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Events are updatable by admins only" ON events;
  CREATE POLICY "Events are updatable by admins only" ON events
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view their own event participation" ON user_event_participation;
  CREATE POLICY "Users can view their own event participation" ON user_event_participation
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert their own event participation" ON user_event_participation;
  CREATE POLICY "Users can insert their own event participation" ON user_event_participation
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update their own event participation" ON user_event_participation;
  CREATE POLICY "Users can update their own event participation" ON user_event_participation
    FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can delete their own event participation" ON user_event_participation;
  CREATE POLICY "Users can delete their own event participation" ON user_event_participation
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Event best practices are viewable by all authenticated users" ON event_best_practices;
  CREATE POLICY "Event best practices are viewable by all authenticated users" ON event_best_practices
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Event best practices are insertable by admins only" ON event_best_practices;
  CREATE POLICY "Event best practices are insertable by admins only" ON event_best_practices
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Event metrics are viewable by all authenticated users" ON event_metrics;
  CREATE POLICY "Event metrics are viewable by all authenticated users" ON event_metrics
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Event stores are viewable by all authenticated users" ON event_stores;
  CREATE POLICY "Event stores are viewable by all authenticated users" ON event_stores
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Event stores are insertable by admins only" ON event_stores;
  CREATE POLICY "Event stores are insertable by admins only" ON event_stores
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- イベントメトリクス自動更新関数
CREATE OR REPLACE FUNCTION update_event_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET
    total_posts = total_posts + 1,
    updated_at = NOW()
  WHERE id IN (
    SELECT unnest(string_to_array(NEW.tags::text, ','))::uuid
    WHERE NEW.tags IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_event_metrics ON community_posts;
CREATE TRIGGER trigger_update_event_metrics
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_event_metrics();


-- ============================================================
-- 4. 投稿機能（case_posts）
-- ============================================================

CREATE TABLE IF NOT EXISTS case_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('favorite_event', 'other')),
  title TEXT NOT NULL,
  related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  situation TEXT NOT NULL,
  approach TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  like_count INTEGER NOT NULL DEFAULT 0,
  empathy_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  is_ai_adopted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT favorite_event_requires_event CHECK (
    (category <> 'favorite_event') OR (related_event_id IS NOT NULL)
  )
);

-- Indexes (投稿)
CREATE INDEX IF NOT EXISTS idx_case_posts_author_id ON case_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_category ON case_posts(category);
CREATE INDEX IF NOT EXISTS idx_case_posts_related_event ON case_posts(related_event_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_created_at ON case_posts(created_at);

-- RLS (投稿)
ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- case_posts ポリシー
DROP POLICY IF EXISTS "case_posts_select_all_authed" ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_dev" ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_all" ON case_posts;
CREATE POLICY "case_posts_select_all" ON case_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "case_posts_insert_self" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_dev" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_all" ON case_posts;
CREATE POLICY "case_posts_insert_all" ON case_posts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "case_posts_update_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_update_self_or_admin" ON case_posts
  FOR UPDATE USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "case_posts_delete_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_delete_self_or_admin" ON case_posts
  FOR DELETE USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

-- users テーブルの SELECT ポリシー（投稿者情報の取得用）
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_public_read_dev" ON users;
CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);


-- ============================================================
-- 5. イベント知識ベース（create_event_knowledge_base.sql）
-- ============================================================

CREATE TABLE IF NOT EXISTS event_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  knowledge_type TEXT CHECK (knowledge_type IN ('character', 'fanbase', 'precaution', 'product')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_knowledge_event_id ON event_knowledge_base(event_id);
CREATE INDEX IF NOT EXISTS idx_event_knowledge_type ON event_knowledge_base(knowledge_type);
CREATE INDEX IF NOT EXISTS idx_event_knowledge_order ON event_knowledge_base(event_id, display_order);

ALTER TABLE event_knowledge_base ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE event_knowledge_base IS 'イベントに関連する必須知識（キャラクター情報、注意事項など）';
COMMENT ON COLUMN event_knowledge_base.knowledge_type IS '知識タイプ: character=キャラクター, fanbase=ファン層, precaution=注意事項, product=商品情報';
COMMENT ON COLUMN event_knowledge_base.display_order IS '表示順序（昇順）';


-- ============================================================
-- 6. マイグレーション
-- ============================================================

-- 6-1. パスワードカラム追加（add_password.sql）
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- 6-2. イベント area カラム追加（events_area_migration.sql）
ALTER TABLE events ADD COLUMN IF NOT EXISTS area TEXT;

ALTER TABLE events ALTER COLUMN area SET DEFAULT 'kanto';
UPDATE events SET area = 'kanto' WHERE area IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'events_area_check'
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT events_area_check
      CHECK (area IN ('national','hokkaido','tohoku','kanto','chubu','kinki','chugoku','shikoku','kyushu_okinawa'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_events_area ON events(area);

-- 6-3. learning_sessions 拡張（learning_sessions_enhancement.sql）
ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0;

ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS ai_feedback_summary TEXT;

ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS user_satisfaction_rating INTEGER
CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5);

COMMENT ON COLUMN learning_sessions.total_messages IS 'セッション内の総メッセージ数';
COMMENT ON COLUMN learning_sessions.ai_feedback_summary IS 'AIによるセッション全体のフィードバック要約';
COMMENT ON COLUMN learning_sessions.user_satisfaction_rating IS 'ユーザーの満足度評価（1-5）';


-- ============================================================
-- 7. サンプルデータ
-- ============================================================

-- 7-1. ユーザー（seed.sql）
INSERT INTO users (name, email, department, role, avatar) VALUES
  ('田中 太郎', 'tanaka@marui.co.jp', 'カード口コミ部', 'learner', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
  ('佐藤 花子', 'sato@marui.co.jp', 'アニメイト渋谷店', 'learner', 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
  ('管理者', 'admin@marui.co.jp', '本部', 'admin', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop')
ON CONFLICT (email) DO NOTHING;

-- パスワード設定（add_password.sql）
UPDATE users SET password = 'password123' WHERE email = 'tanaka@marui.co.jp';
UPDATE users SET password = 'password123' WHERE email = 'sato@marui.co.jp';
UPDATE users SET password = 'admin123' WHERE email = 'admin@marui.co.jp';

-- 7-2. シナリオ（scenarios_seed.sql）
INSERT INTO scenarios (title, type, difficulty, category, customer_type, objectives, duration) VALUES
  (
    'クレーム対応：商品不良',
    'simulation',
    'beginner',
    'クレーム対応',
    '不満を持つ顧客',
    ARRAY['顧客の不満を傾聴する', '適切な謝罪を行う', '解決策を提案する', '顧客満足を得る'],
    15
  ),
  (
    'カード入会案内',
    'simulation',
    'intermediate',
    '接客・販売',
    '購入を検討している顧客',
    ARRAY['カードのメリットを説明する', '顧客の疑問に答える', '入会を促進する'],
    20
  ),
  (
    '難しい質問への対応',
    'simulation',
    'advanced',
    'クレーム対応',
    '専門的な質問をする顧客',
    ARRAY['専門知識を活用する', '分かりやすく説明する', '信頼関係を構築する'],
    25
  ),
  (
    '電話応対：問い合わせ対応',
    'simulation',
    'beginner',
    '電話応対',
    '商品について問い合わせる顧客',
    ARRAY['明るく丁寧な応対をする', '必要な情報を正確に伝える', '次のアクションを案内する'],
    10
  ),
  (
    '返品・交換対応',
    'simulation',
    'intermediate',
    'クレーム対応',
    '返品を希望する顧客',
    ARRAY['返品理由を確認する', '規定に基づいて対応する', '顧客の理解を得る'],
    15
  ),
  (
    'セール時の混雑対応',
    'simulation',
    'intermediate',
    '接客・販売',
    '急いでいる顧客',
    ARRAY['迅速に対応する', '複数の顧客に気を配る', '効率的に業務を進める'],
    15
  ),
  (
    'アニメイト商品の専門知識',
    'document',
    'beginner',
    '商品知識',
    '学習用',
    ARRAY['アニメグッズの種類を理解する', '人気商品を把握する', '在庫管理を学ぶ'],
    20
  ),
  (
    'エポスカードの魅力説明',
    'document',
    'intermediate',
    '商品知識',
    '学習用',
    ARRAY['カードの特典を理解する', 'ポイント制度を説明できる', '提携店舗を把握する'],
    25
  )
ON CONFLICT DO NOTHING;

-- 7-3. イベント（events_seed.sql）
INSERT INTO events (name, description, start_date, end_date, status, tags, stores, total_posts, total_views, total_reactions, success_patterns, key_phrases, ai_summary, event_type, target_audience) VALUES
(
  '呪術廻戦フェア',
  '人気アニメ「呪術廻戦」とのコラボレーションイベント。限定グッズ販売とカード口コミ強化キャンペーン',
  '2024-01-15',
  '2024-02-15',
  'active',
  ARRAY['#呪術廻戦', '#アニメコラボ', '#限定グッズ', '#カード口コミ'],
  ARRAY['渋谷店', '新宿店', '池袋店', '有楽町店'],
  12, 456, 89,
  ARRAY['キャラクター愛を共感ポイントにした自然な声かけ', 'イベント限定特典を活用したカード提案', 'ファン心理を理解した丁寧な接客'],
  ARRAY['「このキャラクター、人気ですよね！」', '「イベント期間中だけの特典があるんです」', '「次回のコラボでもお得に使えます」'],
  'アニメファンの心理を理解し、共感を示すことで自然なカード口コミにつなげる成功パターンが多数報告されています。特に限定感を演出する声かけが効果的です。',
  'anime_collab',
  ARRAY['アニメファン', '若年層', '学生']
),
(
  'バレンタインフェア',
  'バレンタインシーズンの特別企画。ギフト需要を狙ったカード口コミ強化',
  '2024-02-01',
  '2024-02-14',
  'active',
  ARRAY['#バレンタイン', '#ギフト', '#季節イベント', '#カップル'],
  ARRAY['渋谷店', '新宿店', '池袋店'],
  8, 234, 45,
  ARRAY['ギフト需要を意識したペア提案', '特別感を演出するカード特典の紹介', 'カップルや家族連れへの温かい接客'],
  ARRAY['「プレゼントにぴったりの特典があります」', '「カードがあれば次回もお得にご利用いただけます」', '「バレンタイン限定のポイント還元キャンペーン中です」'],
  'ギフト需要が高まるバレンタインシーズンは、カップルやファミリー層へのアプローチが効果的です。特別感を演出する声かけとペア提案が成功のポイントです。',
  'seasonal',
  ARRAY['カップル', 'ファミリー層', '若年層']
),
(
  'チェンソーマンコラボ',
  '大人気アニメ「チェンソーマン」とのコラボイベント。限定グッズと特典満載',
  '2024-01-20',
  '2024-03-31',
  'active',
  ARRAY['#チェンソーマン', '#アニメコラボ', '#限定グッズ', '#若年層'],
  ARRAY['アニメイト渋谷店', 'アニメイト新宿店', 'アニメイト池袋店'],
  15, 567, 102,
  ARRAY['ファン心理を理解した共感的アプローチ', 'コラボ限定特典を活用した提案', '作品への愛を尊重した丁寧な接客'],
  ARRAY['「チェンソーマンファンですか？限定特典があるんです」', '「次のコラボイベントでもお得に使えますよ」', '「カード会員様だけの先行販売もあります」'],
  'アニメファンへのアプローチでは、作品への理解と共感が鍵となります。限定感と特別感を演出することで自然なカード提案につながっています。',
  'anime_collab',
  ARRAY['アニメファン', '若年層', 'コレクター']
),
(
  'スプリングセール2024',
  '春の大型セールイベント。新生活応援キャンペーン',
  '2024-03-01',
  '2024-03-31',
  'active',
  ARRAY['#スプリングセール', '#新生活', '#大型セール', '#全店舗'],
  ARRAY['全店舗'],
  22, 892, 156,
  ARRAY['新生活需要を捉えた積極的な提案', 'セール特典とカード特典の組み合わせ訴求', '購買意欲の高いお客様への効果的なアプローチ'],
  ARRAY['「新生活の準備にカードがあると便利ですよ」', '「セール価格からさらにポイント還元があります」', '「今後のお買い物でずっとお得になります」'],
  '新生活シーズンは購買意欲が高まる時期です。セール特典とカード特典を組み合わせた提案が効果的で、長期的なメリットを伝えることが成功のポイントです。',
  'sale',
  ARRAY['新社会人', '学生', 'ファミリー層']
),
(
  '推しの子コラボフェア',
  '話題沸騰中「推しの子」とのコラボレーションイベント',
  '2024-02-15',
  '2024-04-15',
  'active',
  ARRAY['#推しの子', '#アニメコラボ', '#若年層', '#SNS映え'],
  ARRAY['アニメイト渋谷店', 'アニメイト新宿店', 'アニメイト池袋店', 'アニメイト秋葉原店'],
  18, 678, 134,
  ARRAY['SNS世代を意識したデジタル特典の訴求', 'キャラクター人気を活用した声かけ', '写真撮影スポットでの自然な接客'],
  ARRAY['「推しの子ファンの方に大人気の特典です」', '「カード限定のデジタル特典もありますよ」', '「SNSでシェアすると特典があります」'],
  'SNS世代が多い若年層イベントでは、デジタル特典や限定感が重要です。写真撮影などの体験と組み合わせた自然なアプローチが効果的です。',
  'anime_collab',
  ARRAY['若年層', 'SNS利用者', 'アニメファン']
),
(
  'ファミリーフェスタ',
  '家族連れ向けの大型イベント。親子で楽しめる企画満載',
  '2024-03-10',
  '2024-03-24',
  'active',
  ARRAY['#ファミリー', '#親子', '#キッズ', '#体験型'],
  ARRAY['マルイ渋谷店', 'マルイ新宿店', 'マルイ有楽町店'],
  10, 345, 67,
  ARRAY['家族全体のメリットを訴求する提案', '子育て世代向けの特典説明', '安心感を与える丁寧な説明'],
  ARRAY['「お子様向けの特典もご用意しています」', '「家族カードもお得に作れます」', '「次回のご来店時にもポイントが使えます」'],
  'ファミリー層には、家族全体のメリットと安心感の訴求が重要です。子育て世代向けの特典を丁寧に説明することで信頼を得られます。',
  'family',
  ARRAY['ファミリー層', '子育て世代', '親子']
)
ON CONFLICT DO NOTHING;

-- 終了イベント
INSERT INTO events (name, description, start_date, end_date, status, tags, stores, total_posts, total_views, total_reactions, success_patterns, key_phrases, ai_summary, event_type, target_audience) VALUES
(
  'MGAフェス2024',
  'マルイグループ年次イベント。全店舗参加の大型キャンペーン',
  '2024-02-01',
  '2024-02-29',
  'completed',
  ARRAY['#MGAフェス', '#全店舗', '#年次イベント', '#キャンペーン'],
  ARRAY['全店舗'],
  28, 1234, 267,
  ARRAY['イベント特典を活用した積極的な声かけ', 'お客様の購買意欲が高い時期を狙った提案', 'チーム一丸となった接客体制'],
  ARRAY['「フェス期間中の特別特典です」', '「今だけのお得なキャンペーンがあります」', '「年に一度の大チャンスです」'],
  '全店舗参加の大型イベントでは、統一された声かけパターンと特典活用が成功の鍵となっています。お客様の購買意欲が高まる時期を活用した積極的なアプローチが効果的です。',
  'campaign',
  ARRAY['全顧客層', '既存顧客', '新規顧客']
)
ON CONFLICT DO NOTHING;

-- 開催予定イベント
INSERT INTO events (name, description, start_date, end_date, status, tags, stores, total_posts, total_views, total_reactions, success_patterns, key_phrases, ai_summary, event_type, target_audience) VALUES
(
  'ゴールデンウィークフェア',
  'GW期間中の大型セールイベント。家族連れとカップルをターゲット',
  '2024-04-27',
  '2024-05-06',
  'upcoming',
  ARRAY['#GW', '#ゴールデンウィーク', '#大型連休', '#家族'],
  ARRAY['全店舗'],
  0, 0, 0,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'まもなく開始予定のイベントです。過去の大型連休イベントの成功事例を参考に準備を進めましょう。',
  'seasonal',
  ARRAY['ファミリー層', 'カップル', '観光客']
),
(
  'サマーセール2024',
  '夏の大型セールイベント。ボーナスシーズンを狙った特別企画',
  '2024-07-01',
  '2024-07-31',
  'upcoming',
  ARRAY['#サマーセール', '#夏', '#ボーナス', '#全店舗'],
  ARRAY['全店舗'],
  0, 0, 0,
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'まもなく開始予定のイベントです。ボーナス需要を意識した準備を進めましょう。',
  'sale',
  ARRAY['全顧客層', 'ボーナス利用者', 'ファミリー層']
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- ✅ セットアップ完了！
-- ============================================================
-- 確認用クエリ（実行結果を見てテーブルが作成されたか確認）:
--
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
-- ============================================================
