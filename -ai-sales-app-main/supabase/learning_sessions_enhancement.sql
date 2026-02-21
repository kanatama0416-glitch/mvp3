-- learning_sessionsテーブルの機能拡張
-- シミュレーションセッションの詳細記録のためのカラム追加

-- 複数カラムを個別に追加
ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0;

ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS ai_feedback_summary TEXT;

ALTER TABLE learning_sessions
ADD COLUMN IF NOT EXISTS user_satisfaction_rating INTEGER
CHECK (user_satisfaction_rating >= 1 AND user_satisfaction_rating <= 5);

-- コメント追加（ドキュメント化）
COMMENT ON COLUMN learning_sessions.total_messages IS 'セッション内の総メッセージ数';
COMMENT ON COLUMN learning_sessions.ai_feedback_summary IS 'AIによるセッション全体のフィードバック要約';
COMMENT ON COLUMN learning_sessions.user_satisfaction_rating IS 'ユーザーの満足度評価（1-5）';
