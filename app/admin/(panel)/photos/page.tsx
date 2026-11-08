import AdminBanner from '@/components/admin/AdminBanner';
import CollectionManager from '@/components/admin/CollectionManager';
import PageHeader from '@/components/admin/PageHeader';
import { requireSupabaseConfigured } from '@/lib/admin/guard';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export const metadata = { title: 'Photos' };
export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage() {
  requireSupabaseConfigured();
  const supabase = await createSupabaseServerClient();

  const [galleryResult, photosResult] = await Promise.all([
    supabase.from('menu_gallery').select('*').order('sort_order'),
    supabase.from('experience_photos').select('*').order('sort_order'),
  ]);

  const error = galleryResult.error || photosResult.error;

  return (
    <>
      <PageHeader
        title="Photos"
        description="Upload the photos used on the menu page and the Experience gallery. Use the ↑ ↓ buttons to change their order."
      />

      {error ? (
        <AdminBanner tone="error" title="Could not load the photos">
          <p>{error.message}</p>
        </AdminBanner>
      ) : null}

      <div className="admin-section-head">
        <h2>Menu carousel</h2>
        <p className="admin-help">Photos shown in the “Menu Images” tab on the menu page.</p>
      </div>

      <CollectionManager table="menu_gallery" rows={galleryResult.data ?? []} />

      <div className="admin-section-head">
        <h2>Experience gallery</h2>
        <p className="admin-help">
          Photos on the Experience page. Tick “Show on home page” to feature one on the home page.
        </p>
      </div>

      <CollectionManager table="experience_photos" rows={photosResult.data ?? []} />
    </>
  );
}
