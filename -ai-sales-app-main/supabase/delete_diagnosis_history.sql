-- ========================================
-- 診断履歴関連テーブルの削除
-- ========================================

-- インデックスの削除
DROP INDEX IF EXISTS idx_learning_sessions_user_id;
DROP INDEX IF EXISTS idx_learning_sessions_scenario_id;
DROP INDEX IF EXISTS idx_evaluations_session_id;
DROP INDEX IF EXISTS idx_growth_records_user_id;
DROP INDEX IF EXISTS idx_user_learning_history_user_id;
DROP INDEX IF EXISTS idx_user_learning_history_scenario_id;
DROP INDEX IF EXISTS idx_simulation_feedback_learning_history_id;
DROP INDEX IF EXISTS idx_conversation_logs_learning_history_id;

-- テーブルの削除（依存関係の逆順）
DROP TABLE IF EXISTS simulation_conversation_logs;
DROP TABLE IF EXISTS simulation_feedback;
DROP TABLE IF EXISTS user_learning_history;
DROP TABLE IF EXISTS growth_records;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS learning_sessions;

-- 注意: このスクリプトを実行すると、すべての診断履歴データが永久に削除されます
