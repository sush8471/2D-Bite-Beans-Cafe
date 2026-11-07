import CollectionPage from '@/components/admin/CollectionPage';

export const metadata = { title: 'Add-ons' };
export const dynamic = 'force-dynamic';

export default function AdminAddOnsPage() {
  return <CollectionPage table="add_ons" />;
}
