-- case_postsテーブルのデータを確認

-- 1. テーブルの存在確認
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'case_posts'
) AS case_posts_exists;

-- 2. 全投稿数を確認
SELECT COUNT(*) as total_posts FROM case_posts;

-- 3. カテゴリ別の投稿数
SELECT
  category,
  COUNT(*) as count
FROM case_posts
GROUP BY category;

-- 4. 「その他」カテゴリの投稿一覧（最新10件）
SELECT
  id,
  title,
  author_id,
  category,
  created_at
FROM case_posts
WHERE category = 'other'
ORDER BY created_at DESC
LIMIT 10;

-- 5. 全カテゴリの投稿一覧（最新10件）
SELECT
  id,
  title,
  author_id,
  category,
  created_at
FROM case_posts
ORDER BY created_at DESC
LIMIT 10;
