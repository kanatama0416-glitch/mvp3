-- List existing objects in public schema

-- 1) Base tables in public schema
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

-- 2) Views and materialized views (if any)
select table_name as view_name
from information_schema.views
where table_schema = 'public'
order by view_name;

select schemaname, matviewname
from pg_matviews
where schemaname = 'public'
order by matviewname;

-- 3) Approx row counts of public tables (from statistics)
select relname as table_name, n_live_tup as approx_rows
from pg_stat_all_tables
where schemaname = 'public'
order by table_name;

-- 4) RLS enabled tables
select n.nspname as schema, c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

-- 5) Policies on key tables (adjust as needed)
select polname, schemaname, tablename, cmd, qual
from pg_policies
where tablename in ('users','case_posts','events')
order by tablename, polname;

