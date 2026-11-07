import AdminBanner from '@/components/admin/AdminBanner';
import CopyManager from '@/components/admin/CopyManager';
import PageHeader from '@/components/admin/PageHeader';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import type { CopyEntry } from '@/lib/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Page copy' };
export const dynamic = 'force-dynamic';

export default async function AdminCopyPage() {
  requireSupabaseConfigured();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('page_copy')
    .select('*')
    .order('page')
    .order('sort_order');

  const entries: CopyEntry[] = (data ?? []).map((row) => ({
    key: String(row.key),
    page: String(row.page ?? ''),
    label: String(row.label ?? ''),
    value: String(row.value ?? ''),
    multiline: Boolean(row.multiline),
    sort_order: Number(row.sort_order ?? 0),
  }));

  return (
    <>
      <PageHeader
        title="Page copy"
        description="Headings, descriptions and button labels used across the site. Empty values fall back to the original text."
      />

      {error ? (
        <AdminBanner tone="error" title="Could not load page copy">
          <p>{error.message}</p>
        </AdminBanner>
      ) : null}

      {!error && entries.length === 0 ? (
        <AdminBanner tone="warning" title="No copy rows found">
          <p>
            Run <code>supabase/seed.sql</code> to load the original page copy. You can then edit
            every heading and description here.
          </p>
        </AdminBanner>
      ) : null}

      {entries.length > 0 ? <CopyManager entries={entries} /> : null}
    </>
  );
}
