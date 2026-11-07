import CollectionPage from '@/components/admin/CollectionPage';

export const metadata = { title: 'Highlights' };
export const dynamic = 'force-dynamic';

export default function AdminHighlightsPage() {
  return <CollectionPage table="highlights" />;
}
