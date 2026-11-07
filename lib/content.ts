import { cache } from 'react';
import { defaultContent } from './default-content';
import { createPublicClient } from './supabase/public';
import type {
  AddOn,
  Amenity,
  CopyEntry,
  CopyMap,
  ExperiencePhoto,
  Highlight,
  MenuCategory,
  MenuGalleryImage,
  MenuItem,
  SiteContent,
  SiteSettings,
} from './types';

function bySort<T extends { sort_order?: number | string | null }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
  );
}

export function toSettings(row: Record<string, unknown>): SiteSettings {
  return {
    brand_name: String(row.brand_name ?? ''),
    logo_url: String(row.logo_url ?? ''),
    hero_image_url: String(row.hero_image_url ?? ''),
    visit_image_url: String(row.visit_image_url ?? ''),
    snapshot_image_url: String(row.snapshot_image_url ?? ''),
    address: String(row.address ?? ''),
    maps_url: String(row.maps_url ?? ''),
    hours_days: String(row.hours_days ?? ''),
    hours_time: String(row.hours_time ?? ''),
    phone: String(row.phone ?? ''),
    whatsapp_number: String(row.whatsapp_number ?? ''),
    instagram_handle: String(row.instagram_handle ?? ''),
    instagram_url: String(row.instagram_url ?? ''),
    average_spend: String(row.average_spend ?? ''),
    meta_title: String(row.meta_title ?? ''),
    meta_description: String(row.meta_description ?? ''),
    theme_color: String(row.theme_color ?? '#8B2635'),
  };
}

/**
 * Public content loader.
 *
 * - Uses the anon key, so RLS returns published rows only.
 * - Falls back to the bundled defaults when Supabase is not configured yet,
 *   or when the database cannot be reached.
 * - Cached per request with React cache() so the layout and page share one fetch.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const supabase = createPublicClient();
  if (!supabase) return defaultContent;

  try {
    const [settingsRes, copyRes, categoriesRes, addOnsRes, galleryRes, highlightsRes, photosRes, amenitiesRes] =
      await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('page_copy').select('*'),
        supabase
          .from('menu_categories')
          .select(
            'id,slug,name,filter_label,icon,image_url,is_compact,sort_order,is_published,items:menu_items(id,name,description,is_new,sort_order,is_published,variants:menu_item_variants(id,label,price,sort_order))'
          )
          .eq('is_published', true),
        supabase.from('add_ons').select('*').eq('is_published', true),
        supabase.from('menu_gallery').select('*').eq('is_published', true),
        supabase.from('highlights').select('*').eq('is_published', true),
        supabase.from('experience_photos').select('*').eq('is_published', true),
        supabase.from('amenities').select('*').eq('is_published', true),
      ]);

    const firstError =
      settingsRes.error ||
      copyRes.error ||
      categoriesRes.error ||
      addOnsRes.error ||
      galleryRes.error ||
      highlightsRes.error ||
      photosRes.error ||
      amenitiesRes.error;

    if (firstError) throw firstError;

    // No settings row means the schema exists but the seed has not run.
    if (!settingsRes.data) return defaultContent;

    const categories: MenuCategory[] = bySort(
      (categoriesRes.data ?? []) as Array<Record<string, unknown>>
    ).map((category) => ({
      id: String(category.id),
      slug: String(category.slug),
      name: String(category.name),
      filter_label: String(category.filter_label ?? category.name),
      icon: String(category.icon ?? ''),
      image_url: String(category.image_url ?? ''),
      is_compact: Boolean(category.is_compact),
      sort_order: Number(category.sort_order ?? 0),
      is_published: Boolean(category.is_published),
      items: bySort(
        ((category.items as Array<Record<string, unknown>> | null) ?? []).filter(
          (item) => item.is_published
        )
      ).map((item) => {
        const variants = bySort(
          ((item.variants as Array<Record<string, unknown>> | null) ?? []).map((variant) => ({
            id: String(variant.id),
            label: String(variant.label ?? 'Standard'),
            price: Number(variant.price ?? 0),
            sort_order: Number(variant.sort_order ?? 0),
          }))
        );

        return {
          id: String(item.id),
          name: String(item.name),
          description: item.description ? String(item.description) : null,
          is_new: Boolean(item.is_new),
          sort_order: Number(item.sort_order ?? 0),
          is_published: Boolean(item.is_published),
          variants,
        } satisfies MenuItem;
      }),
    }));

    const copy: CopyEntry[] = ((copyRes.data ?? []) as Array<Record<string, unknown>>).map(
      (entry) => ({
        key: String(entry.key),
        page: String(entry.page ?? ''),
        label: String(entry.label ?? ''),
        value: String(entry.value ?? ''),
        multiline: Boolean(entry.multiline),
        sort_order: Number(entry.sort_order ?? 0),
      })
    );

    const addOns: AddOn[] = bySort(
      (addOnsRes.data ?? []) as Array<Record<string, unknown>>
    ).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      price: Number(row.price ?? 0),
      sort_order: Number(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
    }));

    const menuGallery: MenuGalleryImage[] = bySort(
      (galleryRes.data ?? []) as Array<Record<string, unknown>>
    ).map((row) => ({
      id: String(row.id),
      image_url: String(row.image_url ?? ''),
      label: String(row.label ?? ''),
      sort_order: Number(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
    }));

    const highlights: Highlight[] = bySort(
      (highlightsRes.data ?? []) as Array<Record<string, unknown>>
    ).map((row) => ({
      id: String(row.id),
      image_url: String(row.image_url ?? ''),
      badge: String(row.badge ?? ''),
      category: String(row.category ?? ''),
      title: String(row.title ?? ''),
      description: String(row.description ?? ''),
      price_label: String(row.price_label ?? ''),
      sort_order: Number(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
    }));

    const experiencePhotos: ExperiencePhoto[] = bySort(
      (photosRes.data ?? []) as Array<Record<string, unknown>>
    ).map((row) => ({
      id: String(row.id),
      image_url: String(row.image_url ?? ''),
      title: String(row.title ?? ''),
      description: String(row.description ?? ''),
      is_featured_home: Boolean(row.is_featured_home),
      home_title: row.home_title ? String(row.home_title) : null,
      home_description: row.home_description ? String(row.home_description) : null,
      home_sort_order: Number(row.home_sort_order ?? 0),
      sort_order: Number(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
    }));

    const amenities: Amenity[] = bySort(
      (amenitiesRes.data ?? []) as Array<Record<string, unknown>>
    ).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      icon_url: String(row.icon_url ?? ''),
      show_on_home: Boolean(row.show_on_home),
      home_sort_order: Number(row.home_sort_order ?? 0),
      sort_order: Number(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
    }));

    return {
      settings: toSettings(settingsRes.data as Record<string, unknown>),
      copy,
      categories,
      addOns,
      menuGallery,
      highlights,
      experiencePhotos,
      amenities,
    };
  } catch (error) {
    console.error('[content] Supabase read failed, using bundled defaults.', error);
    return defaultContent;
  }
});

export function toCopyMap(content: SiteContent): CopyMap {
  return Object.fromEntries(content.copy.map((entry) => [entry.key, entry.value]));
}

export function copyText(copy: CopyMap, key: string, fallback = ''): string {
  const value = copy[key];
  return value && value.trim().length > 0 ? value : fallback;
}
