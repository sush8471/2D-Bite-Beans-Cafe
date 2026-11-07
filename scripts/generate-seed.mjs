// scripts/generate-seed.mjs
// Generates supabase/seed.sql from data/content.json.
// Run with: bun run seed:generate

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const content = JSON.parse(readFileSync(join(root, 'data/content.json'), 'utf8'));

function uuid(key) {
  const bytes = Buffer.from(createHash('sha256').update(key).digest().subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function value(input) {
  if (input === null || input === undefined) return 'null';
  if (typeof input === 'number') return String(Math.trunc(input));
  if (typeof input === 'boolean') return input ? 'true' : 'false';
  return `'${String(input).replace(/'/g, "''")}'`;
}

function upsert(table, columns, rows, conflict) {
  const values = rows
    .map((row) => `  (${columns.map((column) => value(row[column])).join(', ')})`)
    .join(',\n');
  const updates = columns
    .filter((column) => column !== conflict)
    .map((column) => `${column} = excluded.${column}`)
    .join(',\n    ');
  return `insert into public.${table} (${columns.join(', ')})
values
${values}
on conflict (${conflict}) do update set
    ${updates};
`;
}

const statements = [];

statements.push(
  upsert(
    'site_settings',
    [
      'id',
      'brand_name',
      'logo_url',
      'hero_image_url',
      'visit_image_url',
      'snapshot_image_url',
      'address',
      'maps_url',
      'hours_days',
      'hours_time',
      'phone',
      'whatsapp_number',
      'instagram_handle',
      'instagram_url',
      'average_spend',
      'meta_title',
      'meta_description',
      'theme_color',
    ],
    [{ id: 1, ...content.settings }],
    'id'
  )
);

statements.push(
  upsert(
    'page_copy',
    ['key', 'page', 'label', 'value', 'multiline', 'sort_order'],
    content.copy,
    'key'
  )
);

const categories = [];
const items = [];
const variants = [];

for (const category of content.categories) {
  const categoryId = uuid(`category:${category.slug}`);
  categories.push({
    id: categoryId,
    slug: category.slug,
    name: category.name,
    filter_label: category.filter_label,
    icon: category.icon,
    image_url: category.image_url,
    is_compact: category.is_compact,
    sort_order: category.sort_order,
    is_published: category.is_published,
  });

  for (const item of category.items) {
    const itemId = uuid(`item:${category.slug}:${item.name}`);
    items.push({
      id: itemId,
      category_id: categoryId,
      name: item.name,
      description: item.description,
      is_new: item.is_new,
      sort_order: item.sort_order,
      is_published: item.is_published,
    });

    item.variants.forEach((variant, index) => {
      variants.push({
        id: uuid(`variant:${category.slug}:${item.name}:${index}`),
        item_id: itemId,
        label: variant.label,
        price: variant.price,
        sort_order: variant.sort_order,
      });
    });
  }
}

statements.push(
  upsert(
    'menu_categories',
    ['id', 'slug', 'name', 'filter_label', 'icon', 'image_url', 'is_compact', 'sort_order', 'is_published'],
    categories,
    'id'
  )
);

statements.push(
  upsert(
    'menu_items',
    ['id', 'category_id', 'name', 'description', 'is_new', 'sort_order', 'is_published'],
    items,
    'id'
  )
);

statements.push(
  upsert(
    'menu_item_variants',
    ['id', 'item_id', 'label', 'price', 'sort_order'],
    variants,
    'id'
  )
);

statements.push(
  upsert(
    'add_ons',
    ['id', 'name', 'price', 'sort_order', 'is_published'],
    content.addOns.map((row) => ({ id: uuid(`addon:${row.name}`), ...row })),
    'id'
  )
);

statements.push(
  upsert(
    'menu_gallery',
    ['id', 'image_url', 'label', 'sort_order', 'is_published'],
    content.menuGallery.map((row) => ({ id: uuid(`gallery:${row.image_url}`), ...row })),
    'id'
  )
);

statements.push(
  upsert(
    'highlights',
    [
      'id',
      'image_url',
      'badge',
      'category',
      'title',
      'description',
      'price_label',
      'sort_order',
      'is_published',
    ],
    content.highlights.map((row) => ({ id: uuid(`highlight:${row.title}`), ...row })),
    'id'
  )
);

statements.push(
  upsert(
    'experience_photos',
    [
      'id',
      'image_url',
      'title',
      'description',
      'is_featured_home',
      'home_title',
      'home_description',
      'home_sort_order',
      'sort_order',
      'is_published',
    ],
    content.experiencePhotos.map((row) => ({ id: uuid(`photo:${row.image_url}`), ...row })),
    'id'
  )
);

statements.push(
  upsert(
    'amenities',
    [
      'id',
      'name',
      'icon_url',
      'show_on_home',
      'home_sort_order',
      'sort_order',
      'is_published',
    ],
    content.amenities.map((row) => ({ id: uuid(`amenity:${row.name}`), ...row })),
    'id'
  )
);

const preflight = `do $$
begin
  if to_regclass('public.admin_users') is null
     or to_regclass('public.site_settings') is null
     or to_regclass('public.page_copy') is null
     or to_regclass('public.menu_categories') is null
     or to_regclass('public.menu_items') is null
     or to_regclass('public.menu_item_variants') is null
     or to_regclass('public.add_ons') is null
     or to_regclass('public.menu_gallery') is null
     or to_regclass('public.highlights') is null
     or to_regclass('public.experience_photos') is null
     or to_regclass('public.amenities') is null
  then
    raise exception 'Schema incomplete. Run supabase/schema.sql (or supabase/setup.sql) in this same project first.';
  end if;
end;
$$;
`;

const sql = `-- =========================================================
-- Bite & Beans — seed data
-- Generated from data/content.json by scripts/generate-seed.mjs.
-- Run AFTER supabase/schema.sql. Safe to re-run (upserts by id/key).
-- =========================================================

${preflight}
${statements.join('\n')}`;

writeFileSync(join(root, 'supabase/seed.sql'), sql);
console.log(
  `Wrote supabase/seed.sql (${categories.length} categories, ${items.length} items, ` +
    `${variants.length} variants, ${content.addOns.length} add-ons).`
);
