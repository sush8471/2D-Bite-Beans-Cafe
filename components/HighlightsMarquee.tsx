'use client';

import Link from 'next/link';
import SiteImage from '@/components/SiteImage';
import { safeImageUrl } from '@/lib/utils';
import type { Highlight } from '@/lib/types';

type HighlightsMarqueeProps = {
  highlights: Highlight[];
};

export default function HighlightsMarquee({ highlights }: HighlightsMarqueeProps) {
  if (!highlights || highlights.length === 0) return null;

  // Duplicate items twice to create a seamless, continuous infinite loop
  const duplicatedHighlights = [...highlights, ...highlights];

  return (
    <div className="highlights-vignette-wrapper" aria-label="Menu Highlights Marquee">
      <div className="highlights-marquee">
        <div className="highlights-marquee__track">
          {duplicatedHighlights.map((item, index) => {
            const isDuplicate = index >= highlights.length;
            return (
              <article
                key={`${item.id ?? item.title}-${index}`}
                className="highlight-card"
                aria-hidden={isDuplicate ? 'true' : undefined}
              >
                <Link href="/menu" className="highlight-card__link" tabIndex={isDuplicate ? -1 : 0}>
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
                    <div className="highlight-card__footer">
                      {item.price_label ? (
                        <p className="highlight-card__price">{item.price_label}</p>
                      ) : null}
                      <span className="highlight-card__cta">Explore Menu &rarr;</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

