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
    description: 'Sections, banners and ordering',
  },
  {
    table: 'menu_items',
    label: 'Dishes',
    href: '/admin/menu',
    description: 'Names, descriptions and prices',
  },
  {
    table: 'highlights',
    label: 'Highlights',
    href: '/admin/highlights',
    description: 'Home page feature cards',
  },
  {
    table: 'menu_gallery',
    label: 'Menu images',
    href: '/admin/gallery',
    description: 'Menu photo carousel',
  },
  {
    table: 'experience_photos',
    label: 'Experience photos',
    href: '/admin/experience',
    description: 'Interior gallery and home teaser',
  },
  {
    table: 'amenities',
    label: 'Amenities',
    href: '/admin/amenities',
    description: 'Visit page features',
  },
  {
    table: 'add_ons',
    label: 'Add-ons',
    href: '/admin/addons',
    description: 'Menu extras and prices',
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
          <Link href="/admin/settings" className="admin-btn admin-btn--outline">
            Site settings
          </Link>
          <Link href="/admin/copy" className="admin-btn admin-btn--outline">
            Page copy
          </Link>
          <Link href="/admin/gallery" className="admin-btn admin-btn--outline">
            Menu images
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h2>How publishing works</h2>
        <ul className="admin-list">
          <li>
            Every row has a <strong>Published</strong> toggle. Hidden rows are removed from the
            public website immediately.
          </li>
          <li>
            <strong>Sort order</strong> controls the position on the site. Lower numbers appear
            first.
          </li>
          <li>
            Images upload to Supabase Storage. The original files in <code>public/assets</code>{' '}
            keep working until you replace them.
          </li>
          <li>
            Only members of <code>public.admin_users</code> can write. Row Level Security enforces
            this in the database as well as in this UI.
          </li>
        </ul>
      </div>
    </>
  );
}
