'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionState } from '@/lib/admin/action-state';
import { COLLECTIONS, isTableName, type AdminField, type TableName } from '@/lib/admin/collections';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function fail(message: string): ActionState {
  return { error: message };
}

function revalidateSite() {
  revalidatePath('/', 'layout');
}

type AdminAuth =
  | { ok: false; error: string }
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
      user: { id: string; email?: string | null };
    };

async function requireAdmin(): Promise<AdminAuth> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      error: 'Supabase is not configured. Add your project URL and anon key to .env.local.',
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: 'Your session has expired. Please sign in again.' };
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error || !isAdmin) {
    return { ok: false, error: 'This account is not an admin.' };
  }

  return { ok: true, supabase, user };
}

function readFields(
  formData: FormData,
  fields: AdminField[]
): { payload: Record<string, unknown> } | { error: string } {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = formData.get(field.name);

    if (field.type === 'checkbox') {
      payload[field.name] = raw === 'on' || raw === 'true';
      continue;
    }

    if (field.type === 'number') {
      const number = Number(raw ?? 0);
      if (!Number.isFinite(number)) {
        return { error: `${field.label} must be a number.` };
      }
      if (field.min !== undefined && number < field.min) {
        return { error: `${field.label} must be at least ${field.min}.` };
      }
      payload[field.name] = Math.trunc(number);
      continue;
    }

    const value = typeof raw === 'string' ? raw.trim() : '';
    if (field.required && value.length === 0) {
      return { error: `${field.label} is required.` };
    }
    payload[field.name] = value;
  }

  if (typeof payload.slug === 'string' && !/^[a-z0-9-]+$/.test(payload.slug)) {
    return { error: 'Slug can only contain lowercase letters, numbers and hyphens.' };
  }

  return { payload };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function slugify(value: string): string {
  const base = value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'category';
}

/**
 * New categories get a URL-safe slug automatically. The slug is still used by
 * the filter bar and section anchors, but the owner never edits it directly.
 */
async function uniqueCategorySlug(
  supabase: SupabaseServerClient,
  name: string
): Promise<string> {
  const base = slugify(name);
  const { data } = await supabase
    .from('menu_categories')
    .select('slug')
    .like('slug', `${base}%`);

  const taken = new Set((data ?? []).map((row) => String(row.slug)));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

/** New rows are appended to the end of the list. */
async function nextSortOrder(
  supabase: SupabaseServerClient,
  table: TableName | 'menu_items',
  scope?: { column: 'category_id'; value: string }
): Promise<number> {
  let query = supabase
    .from(table)
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (scope) query = query.eq(scope.column, scope.value);

  const { data } = await query.maybeSingle();
  return Number(data?.sort_order ?? 0) + 10;
}

/**
 * Moves a row one place up or down by swapping its position with its neighbour,
 * then renumbers the list in steps of ten. No raw numbers reach the owner.
 */
async function reorderRows(
  supabase: SupabaseServerClient,
  table: TableName | 'menu_items',
  id: string,
  direction: 'up' | 'down',
  scope?: { column: 'category_id'; value: string }
): Promise<ActionState> {
  let query = supabase
    .from(table)
    .select('id, sort_order')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (scope) query = query.eq(scope.column, scope.value);

  const { data, error } = await query;
  if (error) return fail(error.message);

  const rows = (data ?? []).map((row) => ({
    id: String(row.id),
    sort_order: Number(row.sort_order ?? 0),
  }));

  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return fail('That item could not be found.');

  const neighbour = direction === 'up' ? index - 1 : index + 1;
  if (neighbour < 0 || neighbour >= rows.length) {
    return { ok: true, message: 'Already at the edge of the list.' };
  }

  const before = new Map(rows.map((row) => [row.id, row.sort_order]));
  const next = [...rows];
  [next[index], next[neighbour]] = [next[neighbour], next[index]];

  const updates = next
    .map((row, position) => ({ id: row.id, sort_order: (position + 1) * 10 }))
    .filter((row) => before.get(row.id) !== row.sort_order);

  const results = await Promise.all(
    updates.map((row) =>
      supabase.from(table).update({ sort_order: row.sort_order }).eq('id', row.id)
    )
  );

  const updateError = results.find((result) => result.error)?.error;
  if (updateError) return fail(updateError.message);

  revalidateSite();
  return { ok: true, message: 'Order updated.' };
}

// ---------------------------------------------------------
// Auth
// ---------------------------------------------------------

export async function signIn(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured) {
    return fail('Supabase is not configured. Follow the setup guide first.');
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return fail('Email and password are required.');
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return fail(error.message);
  }

  revalidatePath('/admin', 'layout');
  redirect('/admin');
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}

// ---------------------------------------------------------
// Generic collections
// ---------------------------------------------------------

export async function saveCollectionRow(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const table = String(formData.get('table') ?? '');
  if (!isTableName(table)) return fail('Unknown collection.');

  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  const config = COLLECTIONS[table];
  const parsed = readFields(formData, config.fields);
  if ('error' in parsed) return fail(parsed.error);

  const id = String(formData.get('id') ?? '').trim();

  let payload = parsed.payload;

  if (!id) {
    payload = {
      ...payload,
      sort_order: await nextSortOrder(auth.supabase, table),
    };
  }

  // The category filter label follows the name so it can never go stale.
  if (table === 'menu_categories') {
    const name = String(payload.name ?? '');
    payload = { ...payload, filter_label: name };

    if (!id) {
      payload.slug = await uniqueCategorySlug(auth.supabase, name);
    }
  }

  const query = id
    ? auth.supabase.from(table).update(payload).eq('id', id)
    : auth.supabase.from(table).insert(payload);

  const { error } = await query;
  if (error) return fail(error.message);

  revalidateSite();
  return { ok: true, message: id ? 'Changes saved.' : `${config.singular} created.` };
}

export async function moveCollectionRow(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const table = String(formData.get('table') ?? '');
  if (!isTableName(table)) return fail('Unknown collection.');

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return fail('Missing record id.');

  const direction = formData.get('direction') === 'up' ? 'up' : 'down';

  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  return reorderRows(auth.supabase, table, id, direction);
}

export async function deleteCollectionRow(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const table = String(formData.get('table') ?? '');
  if (!isTableName(table)) return fail('Unknown collection.');

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return fail('Missing record id.');

  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  const { error } = await auth.supabase.from(table).delete().eq('id', id);
  if (error) return fail(error.message);

  revalidateSite();
  return { ok: true, message: 'Deleted.' };
}

// ---------------------------------------------------------
// Menu items (with variants, saved transactionally via RPC)
// ---------------------------------------------------------

export async function saveMenuItem(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  const id = String(formData.get('id') ?? '').trim();
  const categoryId = String(formData.get('category_id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const isNew = formData.get('is_new') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  if (!categoryId) return fail('Missing category.');
  if (!name) return fail('Item name is required.');

  // New dishes are appended to their category. Existing ones keep their place.
  let sortOrder: number;
  const sortRaw = formData.get('sort_order');

  if (sortRaw === null || String(sortRaw).trim() === '') {
    if (id) {
      const { data: current, error: readError } = await auth.supabase
        .from('menu_items')
        .select('sort_order')
        .eq('id', id)
        .maybeSingle();

      if (readError) return fail(readError.message);
      sortOrder = Number(current?.sort_order ?? 0);
    } else {
      sortOrder = await nextSortOrder(auth.supabase, 'menu_items', {
        column: 'category_id',
        value: categoryId,
      });
    }
  } else {
    sortOrder = Number(sortRaw);
    if (!Number.isFinite(sortOrder)) return fail('Sort order must be a number.');
  }

  let variants: Array<{ label: string; price: number; sort_order: number }> = [];
  try {
    const parsed = JSON.parse(String(formData.get('variants') ?? '[]'));
    if (!Array.isArray(parsed)) throw new Error('Variants must be an array.');
    variants = parsed.map((variant, index) => ({
      label: String(variant?.label ?? 'Standard').trim() || 'Standard',
      price: Number(variant?.price),
      sort_order: (index + 1) * 10,
    }));
  } catch {
    return fail('Prices could not be read. Please try again.');
  }

  if (variants.length === 0) return fail('Add at least one price.');
  if (variants.some((variant) => !Number.isFinite(variant.price) || variant.price < 0)) {
    return fail('Every price must be a positive number.');
  }

  const { error } = await auth.supabase.rpc('save_menu_item', {
    p_id: id || null,
    p_category_id: categoryId,
    p_name: name,
    p_description: description,
    p_is_new: isNew,
    p_is_published: isPublished,
    p_sort_order: Math.trunc(sortOrder),
    p_variants: variants,
  });

  if (error) return fail(error.message);

  revalidateSite();
  return { ok: true, message: id ? 'Dish saved.' : 'Dish added.' };
}

export async function deleteMenuItem(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  const id = String(formData.get('id') ?? '').trim();
  if (!id) return fail('Missing dish id.');

  const { error } = await auth.supabase.from('menu_items').delete().eq('id', id);
  if (error) return fail(error.message);

  revalidateSite();
  return { ok: true, message: 'Dish deleted.' };
}

export async function moveMenuItem(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get('id') ?? '').trim();
  const categoryId = String(formData.get('category_id') ?? '').trim();
  if (!id) return fail('Missing dish id.');
  if (!categoryId) return fail('Missing category.');

  const direction = formData.get('direction') === 'up' ? 'up' : 'down';

  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  return reorderRows(auth.supabase, 'menu_items', id, direction, {
    column: 'category_id',
    value: categoryId,
  });
}

// ---------------------------------------------------------
// Site settings
// ---------------------------------------------------------

const SETTINGS_FIELDS: AdminField[] = [
  { name: 'brand_name', label: 'Brand name', type: 'text', required: true },
  { name: 'hero_image_url', label: 'Home hero image', type: 'image', folder: 'site' },
  { name: 'snapshot_image_url', label: 'Home visit card image', type: 'image', folder: 'site' },
  { name: 'visit_image_url', label: 'Visit page image', type: 'image', folder: 'site' },
  { name: 'address', label: 'Address', type: 'textarea', required: true },
  { name: 'hours_days', label: 'Opening days', type: 'text' },
  { name: 'hours_time', label: 'Opening hours', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'whatsapp_number', label: 'WhatsApp number', type: 'text', help: 'Digits only, including country code.' },
  { name: 'instagram_url', label: 'Instagram URL', type: 'text' },
  { name: 'average_spend', label: 'Average spend', type: 'text' },
];

export async function saveSettings(
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return fail(auth.error);

  const parsed = readFields(formData, SETTINGS_FIELDS);
  if ('error' in parsed) return fail(parsed.error);

  const { error } = await auth.supabase
    .from('site_settings')
    .upsert({ id: 1, ...parsed.payload }, { onConflict: 'id' });

  if (error) return fail(error.message);

  revalidateSite();
  return { ok: true, message: 'Site settings saved.' };
}

// ---------------------------------------------------------
// Image uploads
// ---------------------------------------------------------

export async function uploadImage(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { ok: false, error: auth.error };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Choose an image file first.' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Images must be 10 MB or smaller.' };
  }
  if (!IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: 'Use a JPG, PNG, WebP, GIF or AVIF image.' };
  }

  const folderRaw = String(formData.get('folder') ?? 'uploads');
  const folder = /^[a-z0-9/-]+$/i.test(folderRaw) ? folderRaw : 'uploads';
  const extensionByType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/avif': 'avif',
  };
  const extension = extensionByType[file.type] ?? 'jpg';
  const path = `${folder}/${Date.now()}-${globalThis.crypto.randomUUID()}.${extension}`;

  const { error } = await auth.supabase.storage.from('site-media').upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const { data } = auth.supabase.storage.from('site-media').getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
