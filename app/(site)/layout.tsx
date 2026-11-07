import type { Metadata } from 'next';
import Header from '@/components/Header';
import LegacyHashRedirect from '@/components/LegacyHashRedirect';
import ScrollReveal from '@/components/ScrollReveal';
import { getSiteContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    title: {
      default: settings.meta_title || 'Bite & Beans — 2D Cafe House | Guwahati',
      template: `%s | ${settings.brand_name || 'Bite & Beans'}`,
    },
    description: settings.meta_description,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteContent();

  return (
    <>
      <Header brandName={settings.brand_name} logoUrl={settings.logo_url} />
      <main id="app" role="main" aria-live="polite">
        {children}
      </main>
      <ScrollReveal />
      <LegacyHashRedirect />
    </>
  );
}
