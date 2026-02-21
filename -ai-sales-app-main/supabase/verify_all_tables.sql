-- すべての必要なテーブルが存在するか確認

WITH required_tables AS (
  SELECT unnest(ARRAY[
    -- schema.sql のテーブル
    'users', 'scenarios', 'learning_sessions', 'messages',
    'evaluations', 'achievements', 'learning_plans',
    'community_posts', 'community_comments', 'post_reactions',
    'growth_records',

    -- simulation_schema.sql のテーブル
    'simulation_scenarios', 'customer_roleplay', 'scenario_steps',
    'user_learning_history', 'simulation_feedback',
    'simulation_conversation_logs', 'learning_materials',

    -- events_schema.sql のテーブル
    'events', 'user_event_participation', 'event_best_practices',
    'event_metrics', 'event_stores',

    -- posts_schema.sql のテーブル
    'case_posts',

    -- 拡張機能テーブル
    'consultation_categories', 'consultation_history',
    'learning_contents', 'user_content_progress',
    'user_favorites', 'user_learning_goals',
    'notifications', 'password_reset_tokens',
    'tags', 'admin_action_logs', 'moderation_queue',
    'event_knowledge_base'
  ]) AS table_name
),
existing_tables AS (
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
SELECT
  r.table_name,
  CASE
    WHEN e.table_name IS NOT NULL THEN '✅ 存在'
    ELSE '❌ 不足'
  END AS status
FROM required_tables r
LEFT JOIN existing_tables e ON r.table_name = e.table_name
ORDER BY status DESC, r.table_name;
