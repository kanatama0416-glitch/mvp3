-- case_postsテーブルのRow Level Security (RLS)ポリシーを確認・修正

-- 1. 現在のRLS状態を確認
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'case_posts';

-- 2. 既存のポリシーを確認
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'case_posts';

-- 3. RLSを一時的に無効化（開発用）
-- 本番環境では適切なポリシーを設定してください
ALTER TABLE case_posts DISABLE ROW LEVEL SECURITY;

-- または、誰でも読み取り可能にするポリシーを追加
-- ALTER TABLE case_posts ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Allow public read access" ON case_posts;

-- CREATE POLICY "Allow public read access"
--   ON case_posts
--   FOR SELECT
--   USING (true);

-- 4. 確認：投稿が取得できるかテスト
SELECT
  id,
  title,
  category,
  author_id,
  created_at
FROM case_posts
WHERE category = 'other'
ORDER BY created_at DESC
LIMIT 5;
-- Dev‑only RLS setup to allow posting from the current frontend
-- Notes
-- - This relaxes INSERT/SELECT for case_posts so the app (Anon key) can read/write.
-- - Keep for development only. See the rollback section at the end to harden again.

-- 0) Ensure table and RLS are present (idempotent)
create extension if not exists pgcrypto;
alter table case_posts enable row level security;
alter table users      enable row level security;

-- 1) case_posts: SELECT policy (allow anon + authenticated)
--    Replace any existing SELECT policy with a dev one that permits public reads.
drop policy if exists "case_posts_select_all_authed" on case_posts;
drop policy if exists "case_posts_select_dev" on case_posts;
create policy "case_posts_select_dev" on case_posts
  for select
  using (auth.role() in ('anon','authenticated'));

-- 2) case_posts: INSERT policy (dev: allow anon + authenticated)
--    Keep any stricter self-insert policy; OR it with this permissive dev policy.
drop policy if exists "case_posts_insert_dev" on case_posts;
create policy "case_posts_insert_dev" on case_posts
  for insert
  with check (auth.role() in ('anon','authenticated'));

-- 3) users: public read (author name/department/avatar lookup)
drop policy if exists "users_public_read_dev" on users;
create policy "users_public_read_dev" on users
  for select
  using (auth.role() in ('anon','authenticated'));

-- 4) Optional: UPDATE/DELETE remain restricted as per schema defaults.
--    Uncomment below to relax during dev (NOT recommended unless必要).
-- drop policy if exists "case_posts_update_self_or_admin" on case_posts;
-- create policy "case_posts_update_dev" on case_posts
--   for update using (auth.role() in ('anon','authenticated'));
-- drop policy if exists "case_posts_delete_self_or_admin" on case_posts;
-- create policy "case_posts_delete_dev" on case_posts
--   for delete using (auth.role() in ('anon','authenticated'));

-- 5) Quick sanity: list policies (run to confirm)
-- select polname, schemaname, tablename, cmd, qual
-- from pg_policies
-- where tablename in ('case_posts','users')
-- order by tablename, polname;

-- 6) Rollback (harden for production)
--    Run these to remove dev policies and revert to authenticated‑only reads + self inserts.
--    You may also recreate your original self/owner policies as needed.
--
-- drop policy if exists "case_posts_select_dev" on case_posts;
-- create policy "case_posts_select_all_authed" on case_posts
--   for select using (auth.role() = 'authenticated');
-- drop policy if exists "case_posts_insert_dev" on case_posts;
-- drop policy if exists "users_public_read_dev" on users;
