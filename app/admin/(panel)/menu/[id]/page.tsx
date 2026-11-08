import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminBanner from '@/components/admin/AdminBanner';
import MenuItemsManager from '@/components/admin/MenuItemsManager';
import PageHeader from '@/components/admin/PageHeader';
import SingleRowEditor from '@/components/admin/SingleRowEditor';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  if (!isSupabaseConfigured) return { title: 'Menu category' };

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('menu_categories')
    .select('name')
    .eq('id', id)
    .maybeSingle();

  return { title: data?.name ? `${data.name} — Menu` : 'Menu category' };
}

export default async function AdminCategoryPage({ params }: CategoryPageProps) {
  requireSupabaseConfigured();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [categoryResult, itemsResult] = await Promise.all([
    supabase.from('menu_categories').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('menu_items')
      .select(
        'id, name, description, is_new, is_published, sort_order, variants:menu_item_variants(id, label, price, sort_order)'
      )
      .eq('category_id', id)
      .order('sort_order'),
  ]);

  if (categoryResult.error) {
    return (
      <>
        <PageHeader title="Menu category" backHref="/admin/menu" backLabel="Back to menu" />
        <AdminBanner tone="error" title="Could not load this category">
          <p>{categoryResult.error.message}</p>
        </AdminBanner>
      </>
    );
  }

  if (!categoryResult.data) notFound();

  const category = categoryResult.data;
  const items = (itemsResult.data ?? []).map((item) => ({
    id: String(item.id),
    name: String(item.name),
    description: item.description ? String(item.description) : null,
    is_new: Boolean(item.is_new),
    is_published: Boolean(item.is_published),
    sort_order: Number(item.sort_order ?? 0),
    variants: [...((item.variants as Array<Record<string, unknown>> | null) ?? [])]
      .map((variant) => ({
        id: String(variant.id),
        label: String(variant.label ?? 'Standard'),
        price: Number(variant.price ?? 0),
        sort_order: Number(variant.sort_order ?? 0),
      }))
      .sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <>
      <PageHeader
        title={category.name}
        description="Manage the dishes and prices shown in this menu section."
        backHref="/admin/menu"
        backLabel="Back to menu"
      >
        <Link href="/menu" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--outline">
          View menu ↗
        </Link>
      </PageHeader>

      {itemsResult.error ? (
        <AdminBanner tone="error" title="Could not load dishes">
          <p>{itemsResult.error.message}</p>
        </AdminBanner>
      ) : null}

      <div className="admin-category-summary">
        <div className="admin-category-summary__media">
          {category.image_url ? <img src={String(category.image_url)} alt="" /> : <span>No banner</span>}
        </div>
        <div>
          <span className={`admin-pill ${category.is_published ? 'admin-pill--live' : 'admin-pill--draft'}`}>
            {category.is_published ? 'Live' : 'Hidden'}
          </span>
        </div>
      </div>

      <details className="admin-row">
        <summary>
          <span className="admin-row__plus">✎</span>
          <span className="admin-row__summary">
            <strong>Edit category details</strong>
            <span>Name, banner image and visibility</span>
          </span>
        </summary>
        <div className="admin-row__body">
          <SingleRowEditor table="menu_categories" row={category} />
        </div>
      </details>

      <div className="admin-section-head">
        <h2>Dishes &amp; prices</h2>
        <p className="admin-help">
          Each dish can have several prices (for example Vegan / Chicken / Seafood).
        </p>
      </div>

      <MenuItemsManager categoryId={String(category.id)} items={items} />
    </>
  );
}
