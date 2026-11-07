-- =========================================================
-- Bite & Beans — Supabase schema
-- Run this once in the Supabase SQL Editor (or via CLI).
-- Safe to re-run: tables use IF NOT EXISTS, policies are dropped/recreated.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- updated_at helper ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- admin membership ----------
-- Being signed in is not enough. A user must be listed here to write content.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users read own row" on public.admin_users;
create policy "admin_users read own row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- global site settings (single row) ----------
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  brand_name text not null default 'Bite & Beans',
  logo_url text not null default '',
  hero_image_url text not null default '',
  visit_image_url text not null default '',
  snapshot_image_url text not null default '',
  address text not null default '',
  maps_url text not null default '',
  hours_days text not null default '',
  hours_time text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  instagram_handle text not null default '',
  instagram_url text not null default '',
  average_spend text not null default '',
  meta_title text not null default '',
  meta_description text not null default '',
  theme_color text not null default '#8B2635',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------- editable page copy ----------
create table if not exists public.page_copy (
  key text primary key,
  page text not null,
  label text not null,
  value text not null default '',
  multiline boolean not null default false,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists page_copy_page_sort_idx
  on public.page_copy (page, sort_order);

drop trigger if exists page_copy_updated_at on public.page_copy;
create trigger page_copy_updated_at
  before update on public.page_copy
  for each row execute function public.set_updated_at();

-- ---------- menu ----------
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  filter_label text not null default '',
  icon text not null default '',
  image_url text not null default '',
  is_compact boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_categories_sort_idx
  on public.menu_categories (sort_order);

drop trigger if exists menu_categories_updated_at on public.menu_categories;
create trigger menu_categories_updated_at
  before update on public.menu_categories
  for each row execute function public.set_updated_at();

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null,
  description text,
  is_new boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_sort_idx
  on public.menu_items (category_id, sort_order);

drop trigger if exists menu_items_updated_at on public.menu_items;
create trigger menu_items_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

create table if not exists public.menu_item_variants (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.menu_items (id) on delete cascade,
  label text not null default 'Standard',
  price integer not null check (price >= 0),
  sort_order integer not null default 0
);

create index if not exists menu_item_variants_item_sort_idx
  on public.menu_item_variants (item_id, sort_order);

create table if not exists public.add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null check (price >= 0),
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists add_ons_sort_idx on public.add_ons (sort_order);

drop trigger if exists add_ons_updated_at on public.add_ons;
create trigger add_ons_updated_at
  before update on public.add_ons
  for each row execute function public.set_updated_at();

create table if not exists public.menu_gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  label text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_gallery_sort_idx on public.menu_gallery (sort_order);

drop trigger if exists menu_gallery_updated_at on public.menu_gallery;
create trigger menu_gallery_updated_at
  before update on public.menu_gallery
  for each row execute function public.set_updated_at();

-- ---------- home highlights ----------
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  badge text not null default '',
  category text not null default '',
  title text not null,
  description text not null default '',
  price_label text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists highlights_sort_idx on public.highlights (sort_order);

drop trigger if exists highlights_updated_at on public.highlights;
create trigger highlights_updated_at
  before update on public.highlights
  for each row execute function public.set_updated_at();

-- ---------- experience gallery ----------
create table if not exists public.experience_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  description text not null default '',
  is_featured_home boolean not null default false,
  home_title text,
  home_description text,
  home_sort_order integer not null default 0,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists experience_photos_sort_idx
  on public.experience_photos (sort_order);

drop trigger if exists experience_photos_updated_at on public.experience_photos;
create trigger experience_photos_updated_at
  before update on public.experience_photos
  for each row execute function public.set_updated_at();

-- ---------- amenities ----------
create table if not exists public.amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text not null default '',
  show_on_home boolean not null default false,
  home_sort_order integer not null default 0,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists amenities_sort_idx on public.amenities (sort_order);

drop trigger if exists amenities_updated_at on public.amenities;
create trigger amenities_updated_at
  before update on public.amenities
  for each row execute function public.set_updated_at();

-- ---------- transactional menu item save ----------
-- Keeps an item and its price variants in sync in a single transaction.
create or replace function public.save_menu_item(
  p_id uuid,
  p_category_id uuid,
  p_name text,
  p_description text,
  p_is_new boolean,
  p_is_published boolean,
  p_sort_order integer,
  p_variants jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_item_id uuid;
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  if p_name is null or btrim(p_name) = '' then
    raise exception 'Item name is required';
  end if;

  if p_variants is null or jsonb_typeof(p_variants) <> 'array' or jsonb_array_length(p_variants) = 0 then
    raise exception 'At least one price is required';
  end if;

  if p_id is null then
    insert into public.menu_items (category_id, name, description, is_new, sort_order, is_published)
    values (
      p_category_id,
      btrim(p_name),
      nullif(btrim(coalesce(p_description, '')), ''),
      coalesce(p_is_new, false),
      coalesce(p_sort_order, 0),
      coalesce(p_is_published, true)
    )
    returning id into v_item_id;
  else
    update public.menu_items
    set category_id = p_category_id,
        name = btrim(p_name),
        description = nullif(btrim(coalesce(p_description, '')), ''),
        is_new = coalesce(p_is_new, false),
        sort_order = coalesce(p_sort_order, 0),
        is_published = coalesce(p_is_published, true)
    where id = p_id
    returning id into v_item_id;

    if v_item_id is null then
      raise exception 'Item not found';
    end if;

    delete from public.menu_item_variants where item_id = v_item_id;
  end if;

  insert into public.menu_item_variants (item_id, label, price, sort_order)
  select
    v_item_id,
    coalesce(nullif(btrim(v ->> 'label'), ''), 'Standard'),
    (v ->> 'price')::integer,
    coalesce((v ->> 'sort_order')::integer, (t.ordinality * 10)::integer)
  from jsonb_array_elements(p_variants) with ordinality as t(v, ordinality);

  select count(*) into v_count
  from public.menu_item_variants
  where item_id = v_item_id;

  if v_count = 0 then
    raise exception 'At least one price is required';
  end if;

  return v_item_id;
end;
$$;

revoke all on function public.save_menu_item(uuid, uuid, text, text, boolean, boolean, integer, jsonb) from public;
grant execute on function public.save_menu_item(uuid, uuid, text, text, boolean, boolean, integer, jsonb) to authenticated;

-- =========================================================
-- Row Level Security
-- Public can read published content. Only admins can write.
-- =========================================================

alter table public.site_settings enable row level security;
alter table public.page_copy enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.menu_item_variants enable row level security;
alter table public.add_ons enable row level security;
alter table public.menu_gallery enable row level security;
alter table public.highlights enable row level security;
alter table public.experience_photos enable row level security;
alter table public.amenities enable row level security;

-- Read policies
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "page_copy public read" on public.page_copy;
create policy "page_copy public read"
  on public.page_copy for select to anon, authenticated using (true);

drop policy if exists "menu_categories public read" on public.menu_categories;
create policy "menu_categories public read"
  on public.menu_categories for select to anon, authenticated using (is_published);

drop policy if exists "menu_items public read" on public.menu_items;
create policy "menu_items public read"
  on public.menu_items for select to anon, authenticated using (is_published);

drop policy if exists "menu_item_variants public read" on public.menu_item_variants;
create policy "menu_item_variants public read"
  on public.menu_item_variants for select to anon, authenticated
  using (
    exists (
      select 1 from public.menu_items mi
      where mi.id = menu_item_variants.item_id and mi.is_published
    )
  );

drop policy if exists "add_ons public read" on public.add_ons;
create policy "add_ons public read"
  on public.add_ons for select to anon, authenticated using (is_published);

drop policy if exists "menu_gallery public read" on public.menu_gallery;
create policy "menu_gallery public read"
  on public.menu_gallery for select to anon, authenticated using (is_published);

drop policy if exists "highlights public read" on public.highlights;
create policy "highlights public read"
  on public.highlights for select to anon, authenticated using (is_published);

drop policy if exists "experience_photos public read" on public.experience_photos;
create policy "experience_photos public read"
  on public.experience_photos for select to anon, authenticated using (is_published);

drop policy if exists "amenities public read" on public.amenities;
create policy "amenities public read"
  on public.amenities for select to anon, authenticated using (is_published);

-- Admin write policies
drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "page_copy admin write" on public.page_copy;
create policy "page_copy admin write"
  on public.page_copy for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_categories admin write" on public.menu_categories;
create policy "menu_categories admin write"
  on public.menu_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_items admin write" on public.menu_items;
create policy "menu_items admin write"
  on public.menu_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_item_variants admin write" on public.menu_item_variants;
create policy "menu_item_variants admin write"
  on public.menu_item_variants for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "add_ons admin write" on public.add_ons;
create policy "add_ons admin write"
  on public.add_ons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "menu_gallery admin write" on public.menu_gallery;
create policy "menu_gallery admin write"
  on public.menu_gallery for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "highlights admin write" on public.highlights;
create policy "highlights admin write"
  on public.highlights for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "experience_photos admin write" on public.experience_photos;
create policy "experience_photos admin write"
  on public.experience_photos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "amenities admin write" on public.amenities;
create policy "amenities admin write"
  on public.amenities for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Explicit grants (Supabase normally sets these by default)
grant usage on schema public to anon, authenticated;
grant select on
  public.site_settings,
  public.page_copy,
  public.menu_categories,
  public.menu_items,
  public.menu_item_variants,
  public.add_ons,
  public.menu_gallery,
  public.highlights,
  public.experience_photos,
  public.amenities
to anon, authenticated;

grant insert, update, delete on
  public.site_settings,
  public.page_copy,
  public.menu_categories,
  public.menu_items,
  public.menu_item_variants,
  public.add_ons,
  public.menu_gallery,
  public.highlights,
  public.experience_photos,
  public.amenities
to authenticated;

grant select on public.admin_users to authenticated;

-- =========================================================
-- Storage: public read, admin-only uploads
-- =========================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_media public read" on storage.objects;
create policy "site_media public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "site_media admin insert" on storage.objects;
create policy "site_media admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site_media admin update" on storage.objects;
create policy "site_media admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "site_media admin delete" on storage.objects;
create policy "site_media admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-media' and public.is_admin());
