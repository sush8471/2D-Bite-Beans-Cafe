import CollectionPage from '@/components/admin/CollectionPage';

export const metadata = { title: 'Menu images' };
export const dynamic = 'force-dynamic';

export default function AdminGalleryPage() {
  return <CollectionPage table="menu_gallery" />;
}
