-- Add area column to events and backfill based on store names

ALTER TABLE events ADD COLUMN IF NOT EXISTS area TEXT;

-- Backfill area using simple keyword mapping from stores
WITH e AS (
  SELECT id, stores FROM events
)
UPDATE events ev SET area =
  CASE
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s LIKE '%全店%') THEN 'national'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(北海道|札幌|旭川|函館)') THEN 'hokkaido'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(青森|岩手|宮城|仙台|秋田|山形|福島)') THEN 'tohoku'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(東京|渋谷|新宿|池袋|有楽町|秋葉原|神奈川|横浜|埼玉|大宮|千葉|茨城|栃木|群馬)') THEN 'kanto'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(新潟|富山|石川|金沢|福井|山梨|長野|岐阜|静岡|愛知|名古屋)') THEN 'chubu'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(三重|滋賀|京都|大阪|梅田|難波|兵庫|神戸|奈良|和歌山)') THEN 'kinki'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(鳥取|島根|岡山|広島|山口)') THEN 'chugoku'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(徳島|香川|高松|愛媛|高知)') THEN 'shikoku'
    WHEN EXISTS (SELECT 1 FROM unnest(ev.stores) s WHERE s ~ '(福岡|博多|天神|佐賀|長崎|熊本|大分|宮崎|鹿児島|沖縄|那覇)') THEN 'kyushu_okinawa'
    ELSE COALESCE(ev.area, 'kanto')
  END
WHERE TRUE;

-- Set NOT NULL default after backfill
ALTER TABLE events ALTER COLUMN area SET DEFAULT 'kanto';
UPDATE events SET area = 'kanto' WHERE area IS NULL;

-- Optional: constrain to known values (run only once)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'events_area_check'
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT events_area_check
      CHECK (area IN ('national','hokkaido','tohoku','kanto','chubu','kinki','chugoku','shikoku','kyushu_okinawa'));
  END IF;
END $$;

-- Index for area-based queries
CREATE INDEX IF NOT EXISTS idx_events_area ON events(area);

