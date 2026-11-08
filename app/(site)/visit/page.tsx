import Link from 'next/link';
import SiteImage from '@/components/SiteImage';
import { copyText, getSiteContent, toCopyMap } from '@/lib/content';
import { instagramHandleFromUrl, mapsSearchUrl, safeImageUrl, telHref, whatsappUrl } from '@/lib/utils';

export const metadata = {
  title: 'Plan Your Visit',
};

export const dynamic = 'force-dynamic';

export default async function VisitPage() {
  const content = await getSiteContent();
  const copy = toCopyMap(content);
  const { settings, amenities } = content;

  const mapsHref = mapsSearchUrl(settings.address);
  const instagramHandle = instagramHandleFromUrl(settings.instagram_url) || settings.instagram_handle;

  return (
    <section className="page visit-page" data-page="visit">
      <header className="visit-page__header container">
        <span className="script-label">{copyText(copy, 'visit.header.label', 'Find Us')}</span>
        <h1 className="heading-lg">
          {copyText(copy, 'visit.header.title', 'Plan Your Visit')}
        </h1>
        <p className="body-text">
          {copyText(
            copy,
            'visit.header.body',
            "We're waiting with a warm bowl and a sketchbook backdrop"
          )}
        </p>
      </header>

      {settings.visit_image_url ? (
        <div className="visit-page__hero reveal">
          <SiteImage
            src={safeImageUrl(settings.visit_image_url)}
            alt={`${settings.brand_name} exterior`}
          />
        </div>
      ) : null}

      <section className="visit-details reveal-group" aria-label="Visit details">
        <article className="visit-card reveal">
          <div className="visit-card__header">
            <span className="visit-card__icon">
              <img src="/assets/Features/map_pin.png" alt="" />
            </span>
            <h3>Address</h3>
          </div>
          <p>{settings.address}</p>
          {mapsHref ? (
            <p className="mt-1">
              <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </p>
          ) : null}
        </article>

        <article className="visit-card reveal">
          <div className="visit-card__header">
            <span className="visit-card__icon">
              <img src="/assets/Features/clock.png" alt="" />
            </span>
            <h3>Hours</h3>
          </div>
          <p>
            {settings.hours_days}
            <br />
            {settings.hours_time}
          </p>
        </article>

        <article className="visit-card reveal">
          <div className="visit-card__header">
            <span className="visit-card__icon">
              <img src="/assets/Features/phone.png" alt="" />
            </span>
            <h3>Contact</h3>
          </div>
          <p>
            Phone: <a href={telHref(settings.phone)}>{settings.phone}</a>
          </p>
          <p>
            WhatsApp:{' '}
            <a
              href={whatsappUrl(settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {settings.whatsapp_number ? `+${settings.whatsapp_number}` : ''}
            </a>
          </p>
          <p>
            Instagram:{' '}
            {settings.instagram_url ? (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer">
                {instagramHandle}
              </a>
            ) : (
              instagramHandle
            )}
          </p>
        </article>

        <article className="visit-card reveal">
          <div className="visit-card__header">
            <span className="visit-card__icon">
              <img src="/assets/Features/money_bag.png" alt="" />
            </span>
            <h3>Pricing</h3>
          </div>
          <p>Average spend per person</p>
          <p className="visit-card__price">{settings.average_spend}</p>
        </article>
      </section>

      {amenities.length > 0 ? (
        <section className="amenities" aria-label="Amenities">
          <h2 className="amenities__heading reveal">
            {copyText(copy, 'visit.amenities.title', 'Amenities')}
          </h2>
          <div className="amenities__grid reveal-group">
            {amenities.map((amenity) => (
              <div className="amenity reveal" key={amenity.id ?? amenity.name}>
                <span className="amenity__icon">
                  <SiteImage src={safeImageUrl(amenity.icon_url)} alt={amenity.name} />
                </span>
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="cta-block reveal" aria-label="Reservation call to action">
        <div className="cta-block__inner">
          <h2>
            {copyText(copy, 'visit.cta.title', 'Ready to Step Into the Sketch?')}
          </h2>
          <p>
            {copyText(
              copy,
              'visit.cta.body',
              'Reservations recommended during peak hours'
            )}
          </p>
          <div className="cta-block__actions">
            <a
              href={whatsappUrl(settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--large"
            >
              {copyText(copy, 'global.cta.reserve', 'Reserve on WhatsApp')}
            </a>
            <a href={telHref(settings.phone)} className="btn btn--outline btn--large">
              {copyText(copy, 'global.cta.call', 'Call Us')}
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
