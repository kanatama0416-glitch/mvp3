-- ============================================================
-- ノウハウ投稿用テーブル作成SQL（コピペ実行用）
-- Supabase SQL Editorにそのまま貼り付けて実行してください
-- ============================================================

-- 1) case_posts テーブル作成
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

-- 2) インデックス作成
CREATE INDEX IF NOT EXISTS idx_case_posts_author_id ON case_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_category ON case_posts(category);
CREATE INDEX IF NOT EXISTS idx_case_posts_related_event ON case_posts(related_event_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_created_at ON case_posts(created_at);

-- 3) RLS有効化
ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- 4) 既存ポリシー削除（冪等性のため）
DROP POLICY IF EXISTS "case_posts_select_all" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_all" ON case_posts;
DROP POLICY IF EXISTS "case_posts_update_self_or_admin" ON case_posts;
DROP POLICY IF EXISTS "case_posts_delete_self_or_admin" ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_dev" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_dev" ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_all_authed" ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_self" ON case_posts;

-- 5) RLSポリシー作成
-- SELECT: 誰でも閲覧可能（anon + authenticated）
CREATE POLICY "case_posts_select_all" ON case_posts
  FOR SELECT
  USING (true);

-- INSERT: 誰でも投稿可能（anon + authenticated）
CREATE POLICY "case_posts_insert_all" ON case_posts
  FOR INSERT
  WITH CHECK (true);

-- UPDATE: 投稿者本人のみ更新可
CREATE POLICY "case_posts_update_self_or_admin" ON case_posts
  FOR UPDATE
  USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

-- DELETE: 投稿者本人または管理者のみ削除可
CREATE POLICY "case_posts_delete_self_or_admin" ON case_posts
  FOR DELETE
  USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

-- 6) usersテーブルのRLSポリシー（投稿者情報の取得用）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_all" ON users;
CREATE POLICY "users_select_all" ON users
  FOR SELECT
  USING (true);

-- ============================================================
-- 実行完了！case_postsテーブルが作成され、RLSポリシーが設定されました。
-- ============================================================
