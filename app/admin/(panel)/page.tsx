import Link from 'next/link';
import AdminBanner from '@/components/admin/AdminBanner';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  RestaurantDashboard,
  type RecentDish,
  type StoreSettingsData,
} from '@/components/admin/RestaurantDashboard';
import { getAdminSession } from '@/lib/admin/auth';
import { defaultContent } from '@/lib/default-content';

export const dynamic = 'force-dynamic';

const cards = [
  {
    table: 'menu_categories',
    label: 'Menu categories',
    href: '/admin/menu',
    description: 'Sections and their order',
  },
  {
    table: 'menu_items',
    label: 'Dishes',
    href: '/admin/menu',
    description: 'Names, descriptions and prices',
  },
  {
    table: 'add_ons',
    label: 'Add-ons',
    href: '/admin/menu',
    description: 'Extras and prices',
  },
  {
    table: 'highlights',
    label: 'Highlights',
    href: '/admin/highlights',
    description: 'Feature cards on the home page',
  },
  {
    table: 'menu_gallery',
    label: 'Menu photos',
    href: '/admin/photos',
    description: 'Carousel on the menu page',
  },
  {
    table: 'experience_photos',
    label: 'Cafe photos',
    href: '/admin/photos',
    description: 'Gallery and home teaser',
  },
] as const;

function formatVariantPrice(variants?: { price: number }[]): string {
  if (!variants || variants.length === 0) return 'Rs. 250';
  const prices = variants.map((v) => v.price).filter((p) => typeof p === 'number');
  if (prices.length === 0) return 'Rs. 250';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs. ${min}` : `Rs. ${min} — ${max}`;
}

export default async function AdminDashboardPage() {
  requireSupabaseConfigured();
  const [supabase, session] = await Promise.all([
    createSupabaseServerClient(),
    getAdminSession(),
  ]);

  const [counts, settingsResult, recentItemsResult, categoriesResult] = await Promise.all([
    Promise.all(
      cards.map((card) =>
        supabase.from(card.table).select('*', { count: 'exact', head: true })
      )
    ),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    supabase
      .from('menu_items')
      .select(`
        id,
        name,
        is_new,
        is_published,
        updated_at,
        menu_categories (
          name
        ),
        menu_item_variants (
          price
        )
      `)
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase.from('menu_categories').select('id, name').order('sort_order'),
  ]);

  const errors = counts.map((result) => result.error).filter(Boolean);
  const countByName = new Map(
    cards.map((card, index) => [card.table, counts[index].count ?? 0])
  );

  const countsObj = {
    menu_items: countByName.get('menu_items') ?? 0,
    menu_categories: countByName.get('menu_categories') ?? 0,
    add_ons: countByName.get('add_ons') ?? 0,
    highlights: countByName.get('highlights') ?? 0,
    menu_gallery: countByName.get('menu_gallery') ?? 0,
    experience_photos: countByName.get('experience_photos') ?? 0,
    amenities: 0,
  };

  // Compile storefront settings from DB or defaultContent fallback
  const rawSettings = settingsResult.data || defaultContent.settings;
  const storeSettings: StoreSettingsData = {
    brand_name: rawSettings.brand_name || 'Bite & Beans',
    address: rawSettings.address || 'Rajgarh Rd, Sarania Hills, Guwahati, Assam 781003',
    maps_url:
      rawSettings.maps_url ||
      'https://www.google.com/maps/search/?api=1&query=Bite+%26+Beans+Sarania+Hills+Guwahati',
    hours_days: rawSettings.hours_days || 'Monday — Sunday',
    hours_time: rawSettings.hours_time || '12:00 PM — 10:00 PM',
    phone: rawSettings.phone || '060004 87453',
    whatsapp_number: rawSettings.whatsapp_number || '918135972387',
    instagram_handle: rawSettings.instagram_handle || '@biteandbeanss',
    instagram_url: rawSettings.instagram_url || 'https://instagram.com/biteandbeanss',
    average_spend: rawSettings.average_spend || 'Rs. 200 — 400',
  };

  // Compile recently modified dishes from DB or fallback
  let recentDishes: RecentDish[] = [];
  if (recentItemsResult.data && recentItemsResult.data.length > 0) {
    recentDishes = recentItemsResult.data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      categoryName: item.menu_categories?.name || 'Menu Item',
      priceFormatted: formatVariantPrice(item.menu_item_variants),
      isPublished: Boolean(item.is_published),
      isNew: Boolean(item.is_new),
    }));
  } else {
    recentDishes = defaultContent.categories
      .flatMap((cat) =>
        cat.items.map((item) => ({
          id: item.name,
          name: item.name,
          categoryName: cat.name,
          priceFormatted: formatVariantPrice(item.variants),
          isPublished: item.is_published,
          isNew: item.is_new,
        }))
      )
      .slice(0, 5);
  }

  const categories =
    categoriesResult.data && categoriesResult.data.length > 0
      ? categoriesResult.data.map((c: any) => ({
          id: String(c.id),
          name: String(c.name),
        }))
      : defaultContent.categories.map((c) => ({
          id: c.name,
          name: c.name,
        }));

  return (
    <div className="flex flex-col gap-6">
      {errors.length > 0 ? (
        <AdminBanner tone="error" title="Database setup is incomplete">
          <p>
            One or more tables could not be read ({errors[0]?.message}). Run{' '}
            <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> in the Supabase
            SQL Editor, then reload this page.
          </p>
        </AdminBanner>
      ) : null}

      {!settingsResult.data && errors.length === 0 ? (
        <AdminBanner tone="warning" title="Seed data is missing">
          <p>
            The tables exist, but no site settings were found. Run{' '}
            <code>supabase/seed.sql</code> to load the current website content.
          </p>
        </AdminBanner>
      ) : null}

      {/* Modern, Restaurant-tailored Admin Studio Dashboard */}
      <RestaurantDashboard
        counts={countsObj}
        settings={storeSettings}
        recentDishes={recentDishes}
        categories={categories}
        userEmail={
          session.configured && session.user?.email
            ? session.user.email
            : 'admin@biteandbeans.com'
        }
      />
    </div>
  );
}
