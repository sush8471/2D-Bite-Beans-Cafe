import Link from 'next/link';
import AdminBanner from '@/components/admin/AdminBanner';
import PageHeader from '@/components/admin/PageHeader';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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
  {
    table: 'amenities',
    label: 'Amenities',
    href: '/admin/amenities',
    description: 'Visit page features',
  },
] as const;

export default async function AdminDashboardPage() {
  requireSupabaseConfigured();
  const supabase = await createSupabaseServerClient();

  const [counts, settingsResult] = await Promise.all([
    Promise.all(
      cards.map((card) =>
        supabase.from(card.table).select('*', { count: 'exact', head: true })
      )
    ),
    supabase.from('site_settings').select('id').eq('id', 1).maybeSingle(),
  ]);

  const errors = counts.map((result) => result.error).filter(Boolean);
  const countByName = new Map(
    cards.map((card, index) => [card.table, counts[index].count ?? 0])
  );

  return (
    <>
      <PageHeader
        title="Content studio"
        description="Update the website without touching code. Changes go live as soon as you save."
      >
        <Link href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--outline">
          View website ↗
        </Link>
      </PageHeader>

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

      <div className="admin-grid-cards">
        {cards.map((card) => (
          <Link href={card.href} className="admin-stat" key={card.table}>
            <span className="admin-stat__count">{countByName.get(card.table) ?? 0}</span>
            <strong>{card.label}</strong>
            <span>{card.description}</span>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <h2>Quick actions</h2>
        <div className="admin-quick-links">
          <Link href="/admin/menu" className="admin-btn admin-btn--primary">
            Manage the menu
          </Link>
          <Link href="/admin/photos" className="admin-btn admin-btn--outline">
            Photos
          </Link>
          <Link href="/admin/highlights" className="admin-btn admin-btn--outline">
            Home highlights
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn--outline">
            Settings
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h2>Good to know</h2>
        <ul className="admin-list">
          <li>
            Use the <strong>↑ ↓</strong> buttons to change the order things appear in. New items
            are added to the end.
          </li>
          <li>
            Turn <strong>Visible on site</strong> off to hide something without deleting it.
          </li>
          <li>Changes appear on the website as soon as you save.</li>
        </ul>
      </div>
    </>
  );
}
