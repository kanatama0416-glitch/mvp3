-- case_postsテーブルのRLSを無効化（開発環境用）
-- ⚠️ 本番環境では適切なポリシーを設定してください

ALTER TABLE case_posts DISABLE ROW LEVEL SECURITY;

-- 確認：データが取得できるかテスト
SELECT
  COUNT(*) as total_count
FROM case_posts;

SELECT
  category,
  COUNT(*) as count
FROM case_posts
GROUP BY category;

-- 最新5件を表示
SELECT
  id,
  title,
  category,
  created_at
FROM case_posts
ORDER BY created_at DESC
LIMIT 5;
