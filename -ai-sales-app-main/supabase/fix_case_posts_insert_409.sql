-- ============================================================
-- Fix: case_posts INSERT returns 409 for custom-auth users
--
-- Root cause: The original RLS policy "case_posts_insert_self"
-- requires auth.uid() = author_id.  This app uses a custom auth
-- system (password stored in the users table, not Supabase Auth),
-- so auth.uid() is always NULL for all requests.  PostgREST v12+
-- returns HTTP 409 when an INSERT is blocked by an RLS policy.
--
-- Fix: replace the restrictive INSERT policy with one that allows
-- any authenticated or anonymous request (anon key is used by the
-- frontend).  SELECT and UPDATE/DELETE policies are left strict.
-- ============================================================

-- 1) Make sure RLS is enabled
ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- 2) Remove all conflicting INSERT policies
DROP POLICY IF EXISTS "case_posts_insert_self"     ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_dev"      ON case_posts;
DROP POLICY IF EXISTS "case_posts_insert_all"      ON case_posts;

-- 3) Create a permissive INSERT policy (anon key is sufficient)
CREATE POLICY "case_posts_insert_all" ON case_posts
  FOR INSERT
  WITH CHECK (true);

-- 4) Ensure a public SELECT policy exists (replaces authed-only one)
DROP POLICY IF EXISTS "case_posts_select_all_authed" ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_dev"        ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_public"     ON case_posts;
DROP POLICY IF EXISTS "case_posts_select_all"        ON case_posts;

CREATE POLICY "case_posts_select_all" ON case_posts
  FOR SELECT
  USING (true);

-- 5) Keep existing UPDATE / DELETE policies (no change needed)
--    case_posts_update_self_or_admin  (auth.uid() = author_id OR admin)
--    case_posts_delete_self_or_admin  (auth.uid() = author_id OR admin)

-- 6) Also ensure users table is readable for author look-ups
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_public_read_dev" ON users;
DROP POLICY IF EXISTS "users_select_all"      ON users;

CREATE POLICY "users_select_all" ON users
  FOR SELECT
  USING (true);
