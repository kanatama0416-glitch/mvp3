-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed')) NOT NULL,
  tags TEXT[] NOT NULL,
  stores TEXT[] NOT NULL,
  total_posts INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_reactions INTEGER DEFAULT 0,
  success_patterns TEXT[],
  key_phrases TEXT[],
  ai_summary TEXT,
  image_url TEXT,
  event_type TEXT CHECK (event_type IN ('anime_collab', 'seasonal', 'campaign', 'sale', 'family', 'other')) NOT NULL,
  target_audience TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User event participation table
CREATE TABLE user_event_participation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Event best practices table (linking community posts to events)
CREATE TABLE event_best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, post_id)
);

-- Event metrics tracking
CREATE TABLE event_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_posts INTEGER DEFAULT 0,
  daily_views INTEGER DEFAULT 0,
  daily_reactions INTEGER DEFAULT 0,
  daily_participants INTEGER DEFAULT 0,
  card_conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, date)
);

-- Event stores table (for detailed store participation)
CREATE TABLE event_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_type TEXT CHECK (store_type IN ('marui', 'animate', 'other')) NOT NULL,
  location TEXT NOT NULL,
  is_primary_venue BOOLEAN DEFAULT FALSE,
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, store_name)
);

-- Indexes for better query performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_end_date ON events(end_date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_user_event_participation_user_id ON user_event_participation(user_id);
CREATE INDEX idx_user_event_participation_event_id ON user_event_participation(event_id);
CREATE INDEX idx_event_best_practices_event_id ON event_best_practices(event_id);
CREATE INDEX idx_event_best_practices_post_id ON event_best_practices(post_id);
CREATE INDEX idx_event_metrics_event_id ON event_metrics(event_id);
CREATE INDEX idx_event_metrics_date ON event_metrics(date);
CREATE INDEX idx_event_stores_event_id ON event_stores(event_id);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_best_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_stores ENABLE ROW LEVEL SECURITY;

-- Policies for events table (readable by all authenticated users)
CREATE POLICY "Events are viewable by all authenticated users" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Events are insertable by admins only" ON events
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Events are updatable by admins only" ON events
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for user_event_participation (users can manage their own participation)
CREATE POLICY "Users can view their own event participation" ON user_event_participation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own event participation" ON user_event_participation
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event participation" ON user_event_participation
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event participation" ON user_event_participation
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for event_best_practices (viewable by all, manageable by admins)
CREATE POLICY "Event best practices are viewable by all authenticated users" ON event_best_practices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Event best practices are insertable by admins only" ON event_best_practices
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for event_metrics (viewable by all, manageable by system)
CREATE POLICY "Event metrics are viewable by all authenticated users" ON event_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for event_stores (viewable by all, manageable by admins)
CREATE POLICY "Event stores are viewable by all authenticated users" ON event_stores
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Event stores are insertable by admins only" ON event_stores
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Function to update event metrics when posts are created
CREATE OR REPLACE FUNCTION update_event_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- If the post is tagged with an event, update metrics
  UPDATE events
  SET
    total_posts = total_posts + 1,
    updated_at = NOW()
  WHERE id IN (
    SELECT unnest(string_to_array(NEW.tags::text, ','))::uuid
    WHERE NEW.tags IS NOT NULL
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update event metrics
CREATE TRIGGER trigger_update_event_metrics
AFTER INSERT ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_event_metrics();
