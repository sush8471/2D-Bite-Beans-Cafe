import CollectionPage from '@/components/admin/CollectionPage';

export const metadata = { title: 'Experience gallery' };
export const dynamic = 'force-dynamic';

export default function AdminExperiencePage() {
  return <CollectionPage table="experience_photos" />;
}
