-- learning_sessionsテーブルが存在するか確認

SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'learning_sessions'
) AS learning_sessions_exists;

-- learning_sessionsテーブルのカラム一覧を取得（存在する場合）
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'learning_sessions'
ORDER BY ordinal_position;
