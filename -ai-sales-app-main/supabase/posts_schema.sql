-- Posts schema for event and other case studies
-- Table: case_posts

CREATE TABLE IF NOT EXISTS case_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('favorite_event', 'other')),
  title TEXT NOT NULL,
  related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  situation TEXT NOT NULL,
  approach TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  like_count INTEGER NOT NULL DEFAULT 0,
  empathy_count INTEGER NOT NULL DEFAULT 0,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  is_ai_adopted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT favorite_event_requires_event CHECK (
    (category <> 'favorite_event') OR (related_event_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_posts_author_id ON case_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_category ON case_posts(category);
CREATE INDEX IF NOT EXISTS idx_case_posts_related_event ON case_posts(related_event_id);
CREATE INDEX IF NOT EXISTS idx_case_posts_created_at ON case_posts(created_at);

-- Row Level Security
ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- Policies
-- 認証済みなら閲覧可
DROP POLICY IF EXISTS "case_posts_select_all_authed" ON case_posts;
CREATE POLICY "case_posts_select_all_authed" ON case_posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- 自分の投稿のみ作成可
DROP POLICY IF EXISTS "case_posts_insert_self" ON case_posts;
CREATE POLICY "case_posts_insert_self" ON case_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 自分の投稿のみ更新可（管理者はJWTのroleがadminで許可）
DROP POLICY IF EXISTS "case_posts_update_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_update_self_or_admin" ON case_posts
  FOR UPDATE USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');

-- 自分の投稿のみ削除可（管理者は可）
DROP POLICY IF EXISTS "case_posts_delete_self_or_admin" ON case_posts;
CREATE POLICY "case_posts_delete_self_or_admin" ON case_posts
  FOR DELETE USING (auth.uid() = author_id OR auth.jwt() ->> 'role' = 'admin');
