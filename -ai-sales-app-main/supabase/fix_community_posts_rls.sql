-- ============================================================
-- community_posts / community_comments / post_reactions の
-- RLS ポリシーを追加するマイグレーション
--
-- 使い方: Supabase SQL Editor にこのファイルの内容を
-- コピー＆ペーストして実行してください。
-- ============================================================

-- 1) community_posts
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_posts_select_all" ON community_posts;
CREATE POLICY "community_posts_select_all" ON community_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "community_posts_insert_all" ON community_posts;
CREATE POLICY "community_posts_insert_all" ON community_posts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "community_posts_update_all" ON community_posts;
CREATE POLICY "community_posts_update_all" ON community_posts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "community_posts_delete_all" ON community_posts;
CREATE POLICY "community_posts_delete_all" ON community_posts
  FOR DELETE USING (true);

-- 2) community_comments
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_comments_select_all" ON community_comments;
CREATE POLICY "community_comments_select_all" ON community_comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "community_comments_insert_all" ON community_comments;
CREATE POLICY "community_comments_insert_all" ON community_comments
  FOR INSERT WITH CHECK (true);

-- 3) post_reactions
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_reactions_select_all" ON post_reactions;
CREATE POLICY "post_reactions_select_all" ON post_reactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "post_reactions_insert_all" ON post_reactions;
CREATE POLICY "post_reactions_insert_all" ON post_reactions
  FOR INSERT WITH CHECK (true);

-- 4) users テーブル（投稿者情報の取得用 — 念のため再作成）
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
-- 実行完了！community_posts の RLS ポリシーが設定されました。
-- ============================================================
