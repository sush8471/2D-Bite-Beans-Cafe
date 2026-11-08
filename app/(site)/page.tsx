import Link from 'next/link';
import SiteImage from '@/components/SiteImage';
import { copyText, getSiteContent, toCopyMap } from '@/lib/content';
import { safeImageUrl, whatsappUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const content = await getSiteContent();
  const copy = toCopyMap(content);
  const { settings, highlights, experiencePhotos, amenities } = content;

  const homePhotos = experiencePhotos
    .filter((photo) => photo.is_featured_home)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3);

  const homeAmenities = amenities
    .filter((amenity) => amenity.show_on_home)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="page home-page" data-page="home">
      <section className="hero" aria-label={`${settings.brand_name} hero`}>
        <div className="hero__bg" id="hero-bg">
          <SiteImage
            src={safeImageUrl(settings.hero_image_url)}
            alt={`Interior of ${settings.brand_name}`}
            eager
          />
        </div>
        <div className="hero__overlay" />
        <div className="hero__content">
          {settings.logo_url ? (
            <img
              className="hero__logo"
              src={safeImageUrl(settings.logo_url)}
              alt={`${settings.brand_name} 2D Cafe House logo`}
              loading="eager"
            />
          ) : null}
          <h1 className="heading-xl hero__title">
            {copyText(copy, 'home.hero.title', "Guwahati's First & Only 2D Cafe")}
          </h1>
          <p className="hero__subtitle">
            {copyText(copy, 'home.hero.subtitle', 'Where every corner feels like a sketchbook come to life')}
          </p>
          <Link href="/menu" className="btn btn--primary btn--large hero__cta">
            {copyText(copy, 'global.cta.explore_menu', 'Explore Menu')}
          </Link>
        </div>
      </section>

      <section id="space" className="section container">
        <div className="section-header reveal">
          <span className="script-label">{copyText(copy, 'home.space.label', 'The Space')}</span>
          <h2 className="heading-lg">{copyText(copy, 'home.space.title', 'Step Into a Sketchbook')}</h2>
          <p className="body-text">
            {copyText(
              copy,
              'home.space.body',
              'Monochrome walls, ink-style furniture, and surreal comic-book aesthetics await around every corner.'
            )}
          </p>
        </div>

        {homePhotos.length > 0 ? (
          <div className="experience-teaser__grid reveal-group">
            {homePhotos.map((photo, index) => (
              <figure
                key={photo.id ?? photo.image_url}
                className={`experience-teaser__item reveal${index === 0 ? ' experience-teaser__item--large' : ''}`}
              >
                <SiteImage
                  src={safeImageUrl(photo.image_url)}
                  alt={photo.title}
                />
                <figcaption className="experience-teaser__caption">
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

        <div className="text-center mt-2 reveal">
          <Link href="/experience" className="btn btn--secondary">
            {copyText(copy, 'global.cta.see_gallery', 'See Full Gallery')}
          </Link>
        </div>
      </section>

      {highlights.length > 0 ? (
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-header reveal">
              <span className="script-label">
                {copyText(copy, 'home.highlights.label', 'Fan Favourites')}
              </span>
              <h2 className="heading-lg">
                {copyText(copy, 'home.highlights.title', 'Menu Highlights')}
              </h2>
            </div>
          </div>
          <div className="highlights__scroll reveal-group" id="highlights-scroll">
            {highlights.map((item) => (
              <article key={item.id ?? item.title} className="highlight-card reveal">
                <div className="highlight-card__image">
                  <SiteImage src={safeImageUrl(item.image_url)} alt={item.title} />
                  {item.badge ? (
                    <span className="highlight-card__badge">{item.badge}</span>
                  ) : null}
                </div>
                <div className="highlight-card__content">
                  {item.category ? (
                    <span className="highlight-card__category">{item.category}</span>
                  ) : null}
                  <h3 className="highlight-card__title">{item.title}</h3>
                  {item.description ? (
                    <p className="highlight-card__desc">{item.description}</p>
                  ) : null}
                  {item.price_label ? (
                    <p className="highlight-card__price">{item.price_label}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <div className="highlights__footer reveal">
            <Link href="/menu" className="btn btn--primary">
              {copyText(copy, 'global.cta.view_menu', 'View Full Menu')}
            </Link>
          </div>
        </section>
      ) : null}

      {homeAmenities.length > 0 ? (
        <section className="vibe-strip" aria-label="Cafe highlights">
          <div className="container text-center reveal" style={{ marginBottom: '1.5rem' }}>
            <span className="script-label">
              {copyText(copy, 'home.vibe.label', "Why You'll Love Us")}
            </span>
          </div>
          <div className="vibe-strip__grid reveal-group">
            {homeAmenities.map((amenity) => (
              <div key={amenity.id ?? amenity.name} className="vibe-strip__item reveal">
                <span className="vibe-strip__icon">
                  <SiteImage src={safeImageUrl(amenity.icon_url)} alt={amenity.name} />
                </span>
                <span className="vibe-strip__label">{amenity.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="visit-snapshot container">
        <div className="visit-snapshot__card reveal">
          <div className="visit-snapshot__image">
            <SiteImage
              src={safeImageUrl(settings.snapshot_image_url)}
              alt={`Exterior of ${settings.brand_name}`}
            />
          </div>
          <div className="visit-snapshot__content">
            <h3>{copyText(copy, 'home.visit.title', 'Visit Us')}</h3>

            <div className="visit-snapshot__detail">
              <span className="visit-snapshot__detail-icon">
                <img src="/assets/Features/map_pin.png" alt="" />
              </span>
              <div>
                <strong>Address</strong>
                {settings.address}
              </div>
            </div>

            <div className="visit-snapshot__detail">
              <span className="visit-snapshot__detail-icon">
                <img src="/assets/Features/clock.png" alt="" />
              </span>
              <div>
                <strong>Hours</strong>
                Open Daily · {settings.hours_time}
              </div>
            </div>

            <div className="visit-snapshot__detail">
              <span className="visit-snapshot__detail-icon">
                <img src="/assets/Features/money_bag.png" alt="" />
              </span>
              <div>
                <strong>Average Spend</strong>
                {settings.average_spend} per person
              </div>
            </div>

            <a
              href={whatsappUrl(settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary mt-1"
            >
              {copyText(copy, 'global.cta.reserve', 'Reserve on WhatsApp')}
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}
