-- イベント必須知識データベーステーブルの作成

CREATE TABLE IF NOT EXISTS event_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  knowledge_type TEXT CHECK (knowledge_type IN ('character', 'fanbase', 'precaution', 'product')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_event_knowledge_event_id ON event_knowledge_base(event_id);
CREATE INDEX IF NOT EXISTS idx_event_knowledge_type ON event_knowledge_base(knowledge_type);
CREATE INDEX IF NOT EXISTS idx_event_knowledge_order ON event_knowledge_base(event_id, display_order);

-- RLS有効化
ALTER TABLE event_knowledge_base ENABLE ROW LEVEL SECURITY;

-- コメント追加
COMMENT ON TABLE event_knowledge_base IS 'イベントに関連する必須知識（キャラクター情報、注意事項など）';
COMMENT ON COLUMN event_knowledge_base.knowledge_type IS '知識タイプ: character=キャラクター, fanbase=ファン層, precaution=注意事項, product=商品情報';
COMMENT ON COLUMN event_knowledge_base.display_order IS '表示順序（昇順）';
