import Link from 'next/link';
import MenuExplorer from '@/components/MenuExplorer';
import { copyText, getSiteContent, toCopyMap } from '@/lib/content';
import { whatsappUrl } from '@/lib/utils';

export const metadata = {
  title: 'Menu',
};

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const content = await getSiteContent();
  const copy = toCopyMap(content);

  return (
    <section className="page menu-page" data-page="menu">
      <MenuExplorer
        categories={content.categories}
        menuGallery={content.menuGallery}
        addOns={content.addOns}
        copy={copy}
      />

      <section className="cta-block reveal" aria-label="Reservation call to action">
        <div className="cta-block__inner">
          <h2>{copyText(copy, 'menu.cta.title', "Hungry? Let's Make It Happen.")}</h2>
          <p>
            {copyText(copy, 'menu.cta.body', 'Reserve your table or place an order on WhatsApp')}
          </p>
          <div className="cta-block__actions">
            <a
              href={whatsappUrl(content.settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--large"
            >
              {copyText(copy, 'global.cta.reserve', 'Reserve on WhatsApp')}
            </a>
            <Link href="/visit" className="btn btn--outline btn--large">
              {copyText(copy, 'global.cta.plan_visit', 'Plan Your Visit')}
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
