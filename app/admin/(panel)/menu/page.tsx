import AdminBanner from '@/components/admin/AdminBanner';
import CollectionManager from '@/components/admin/CollectionManager';
import PageHeader from '@/components/admin/PageHeader';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Menu' };
export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  requireSupabaseConfigured();
  const supabase = await createSupabaseServerClient();

  const [categoriesResult, itemsResult] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_items').select('id, category_id'),
  ]);

  const error = categoriesResult.error || itemsResult.error;
  const itemCounts = new Map<string, number>();

  for (const item of itemsResult.data ?? []) {
    const key = String(item.category_id);
    itemCounts.set(key, (itemCounts.get(key) ?? 0) + 1);
  }

  const rows = (categoriesResult.data ?? []).map((category) => {
    const count = itemCounts.get(String(category.id)) ?? 0;
    return {
      ...category,
      _meta: `${count} ${count === 1 ? 'dish' : 'dishes'}`,
    };
  });

  return (
    <>
      <PageHeader
        title="Menu"
        description="Create categories, then open one to manage its dishes and prices. The filter bar uses the short filter label."
      />

      {error ? (
        <AdminBanner tone="error" title="Could not load the menu">
          <p>{error.message}</p>
        </AdminBanner>
      ) : null}

      <CollectionManager table="menu_categories" rows={rows} />
    </>
  );
}
