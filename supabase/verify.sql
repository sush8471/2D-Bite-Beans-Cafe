-- =========================================================
-- Bite & Beans — database verification
-- Run this in the Supabase SQL Editor for the same project as .env.local.
-- It reports whether every expected table exists and how many rows it has.
-- =========================================================

create or replace function pg_temp.bb_row_count(tbl text)
returns bigint
language plpgsql
as $$
declare
  n bigint;
begin
  if to_regclass(format('public.%I', tbl)) is null then
    return null;
  end if;
  execute format('select count(*) from public.%I', tbl) into n;
  return n;
end;
$$;

with expected(name) as (
  values
    ('admin_users'),
    ('site_settings'),
    ('page_copy'),
    ('menu_categories'),
    ('menu_items'),
    ('menu_item_variants'),
    ('add_ons'),
    ('menu_gallery'),
    ('highlights'),
    ('experience_photos'),
    ('amenities')
)
select
  expected.name as table_name,
  case
    when to_regclass(format('public.%I', expected.name)) is null then 'MISSING'
    else 'OK'
  end as status,
  pg_temp.bb_row_count(expected.name) as row_count
from expected
order by expected.name;
