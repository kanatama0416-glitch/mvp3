-- ユーザーの参加イベントを管理するテーブル
-- ログインユーザーと参加中のイベントを紐づける
CREATE TABLE IF NOT EXISTS user_event_participation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  event_name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成してクエリパフォーマンスを向上
CREATE INDEX IF NOT EXISTS idx_user_event_participation_user_id
ON user_event_participation(user_id);

CREATE INDEX IF NOT EXISTS idx_user_event_participation_event_id
ON user_event_participation(event_id);

CREATE INDEX IF NOT EXISTS idx_user_event_participation_user_event
ON user_event_participation(user_id, event_id);

CREATE INDEX IF NOT EXISTS idx_user_event_participation_active
ON user_event_participation(user_id, is_active);

-- ユーザーごとの重複参加を防ぐ一意制約
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_event_participation
ON user_event_participation(user_id, event_id);

-- RLS (Row Level Security) を有効化
ALTER TABLE user_event_participation ENABLE ROW LEVEL SECURITY;

-- ポリシー: ユーザーは自分の参加イベントのみ閲覧可能
CREATE POLICY "Users can view their own participating events"
ON user_event_participation
FOR SELECT
USING (auth.uid() = user_id);

-- ポリシー: ユーザーは自分の参加イベントを追加可能
CREATE POLICY "Users can insert their own participating events"
ON user_event_participation
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ポリシー: ユーザーは自分の参加イベントを更新可能
CREATE POLICY "Users can update their own participating events"
ON user_event_participation
FOR UPDATE
USING (auth.uid() = user_id);

-- ポリシー: ユーザーは自分の参加イベントを削除可能
CREATE POLICY "Users can delete their own participating events"
ON user_event_participation
FOR DELETE
USING (auth.uid() = user_id);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_user_event_participation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
CREATE TRIGGER set_user_event_participation_updated_at
BEFORE UPDATE ON user_event_participation
FOR EACH ROW
EXECUTE FUNCTION update_user_event_participation_updated_at();

-- テーブル構造の説明
COMMENT ON TABLE user_event_participation IS 'ログインユーザーと参加中のイベントを紐づけるテーブル';
COMMENT ON COLUMN user_event_participation.user_id IS 'auth.usersテーブルのユーザーID';
COMMENT ON COLUMN user_event_participation.event_id IS 'イベントの一意識別子';
COMMENT ON COLUMN user_event_participation.event_name IS 'イベント名（オプション、キャッシュ用）';
COMMENT ON COLUMN user_event_participation.joined_at IS 'イベントに参加した日時';
COMMENT ON COLUMN user_event_participation.is_active IS '現在アクティブな参加状態かどうか';

-- サンプルデータを挿入するためのコメント
-- 実際のユーザーIDは auth.users テーブルから取得する必要があります
-- 例:
-- INSERT INTO user_event_participation (user_id, event_id, event_name) VALUES
-- ('user-uuid-here', '1', '呪術廻戦フェア'),
-- ('user-uuid-here', '2', 'ディズニープリンセスフェア');
