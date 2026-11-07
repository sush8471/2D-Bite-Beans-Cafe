import CollectionManager from '@/components/admin/CollectionManager';
import AdminBanner from '@/components/admin/AdminBanner';
import PageHeader from '@/components/admin/PageHeader';
import { getCollection, type TableName } from '@/lib/admin/collections';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function CollectionPage({ table }: { table: TableName }) {
  requireSupabaseConfigured();
  const config = getCollection(table);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).select('*').order('sort_order');

  return (
    <>
      <PageHeader title={config.title} description={config.description} />

      {error ? (
        <AdminBanner tone="error" title="Could not load this collection">
          <p>{error.message}</p>
        </AdminBanner>
      ) : null}

      <CollectionManager table={table} rows={data ?? []} />
    </>
  );
}
