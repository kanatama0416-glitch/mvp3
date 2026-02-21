-- case_postsテーブルのRLSポリシーを更新
-- 認証なしでも読み取り可能にする（投稿・更新・削除は認証が必要）

-- 既存の読み取りポリシーを削除
DROP POLICY IF EXISTS "case_posts_select_all_authed" ON case_posts;

-- 新しいポリシー: 誰でも読み取り可能
CREATE POLICY "case_posts_select_public" ON case_posts
  FOR SELECT USING (true);

-- 確認：ポリシー一覧
SELECT
  policyname,
  cmd,
  qual::text,
  with_check::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'case_posts';

-- 確認：データが取得できるかテスト
SELECT
  COUNT(*) as total_count
FROM case_posts;

SELECT
  category,
  COUNT(*) as count
FROM case_posts
GROUP BY category;
