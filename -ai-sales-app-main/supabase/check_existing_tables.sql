-- 現在データベースに存在するテーブルを確認するSQL

SELECT
  table_name,
  CASE
    WHEN table_name IN (
      'users', 'scenarios', 'learning_sessions', 'messages',
      'evaluations', 'achievements', 'learning_plans',
      'community_posts', 'community_comments', 'post_reactions',
      'growth_records'
    ) THEN '✅ schema.sqlのテーブル'
    WHEN table_name IN (
      'simulation_scenarios', 'customer_roleplay', 'scenario_steps',
      'user_learning_history', 'simulation_feedback',
      'simulation_conversation_logs', 'learning_materials'
    ) THEN '✅ simulation_schema.sqlのテーブル'
    WHEN table_name IN (
      'events', 'user_event_participation', 'event_best_practices',
      'event_metrics', 'event_stores'
    ) THEN '✅ events_schema.sqlのテーブル'
    WHEN table_name IN ('case_posts') THEN '✅ posts_schema.sqlのテーブル'
    ELSE 'その他'
  END as schema_source
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
