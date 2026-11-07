import CollectionPage from '@/components/admin/CollectionPage';

export const metadata = { title: 'Amenities' };
export const dynamic = 'force-dynamic';

export default function AdminAmenitiesPage() {
  return <CollectionPage table="amenities" />;
}
