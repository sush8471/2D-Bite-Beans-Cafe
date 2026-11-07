import AdminBanner from '@/components/admin/AdminBanner';
import PageHeader from '@/components/admin/PageHeader';
import SettingsForm from '@/components/admin/SettingsForm';
import { toSettings } from '@/lib/content';
import { defaultContent } from '@/lib/default-content';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Site settings' };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  requireSupabaseConfigured();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  const settings = data ? toSettings(data) : defaultContent.settings;

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Brand details, contact information, hours, images and SEO metadata. Changes appear on both the home and visit pages."
      />

      {error ? (
        <AdminBanner tone="error" title="Could not load settings">
          <p>{error.message}</p>
        </AdminBanner>
      ) : null}

      {!data && !error ? (
        <AdminBanner tone="warning" title="Using bundled defaults">
          <p>
            No settings row was found. Saving this form will create it. To load the original
            content first, run <code>supabase/seed.sql</code>.
          </p>
        </AdminBanner>
      ) : null}

      <SettingsForm settings={settings} />
    </>
  );
}
