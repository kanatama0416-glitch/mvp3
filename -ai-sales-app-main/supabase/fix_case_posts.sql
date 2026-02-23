-- ============================================================
-- case_posts マイグレーション
-- 1. event_title カラム追加
-- 2. RLS ポリシー修正（全ユーザーが投稿できるように）
-- ============================================================

-- 1. event_title カラムを追加
ALTER TABLE case_posts ADD COLUMN IF NOT EXISTS event_title TEXT;

-- 2. RLS を有効化（念のため）
ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- 3. case_posts ポリシーをすべて再設定
DROP POLICY IF EXISTS "case_posts_select_all" ON case_posts;
CREATE POLICY "case_posts_select_all" ON case_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "case_posts_insert_all" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_dev" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_self" ON case_posts;
CREATE POLICY "case_posts_insert_all" ON case_posts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "case_posts_update_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_update_self_or_admin" ON case_posts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "case_posts_delete_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_delete_self_or_admin" ON case_posts
  FOR DELETE USING (true);

-- 4. users テーブルの RLS を確認・修正（FK 制約を通すため）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_insert_all" ON users;
CREATE POLICY "users_insert_all" ON users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "users_update_all" ON users;
CREATE POLICY "users_update_all" ON users
  FOR UPDATE USING (true);

-- ============================================================
-- 確認用クエリ
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'case_posts' ORDER BY ordinal_position;
-- ============================================================
