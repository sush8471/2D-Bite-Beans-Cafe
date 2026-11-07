'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Lightbox from '@/components/Lightbox';
import type { AddOn, CopyMap, MenuCategory, MenuGalleryImage } from '@/lib/types';
import { rs, safeImageUrl } from '@/lib/utils';

type MenuExplorerProps = {
  categories: MenuCategory[];
  menuGallery: MenuGalleryImage[];
  addOns: AddOn[];
  copy: CopyMap;
};

type Tab = 'items' | 'images';

function text(copy: CopyMap, key: string, fallback: string) {
  const value = copy[key];
  return value && value.trim().length > 0 ? value : fallback;
}

export default function MenuExplorer({ categories, menuGallery, addOns, copy }: MenuExplorerProps) {
  const initialFilter = categories.some((category) => category.slug === 'appetizers')
    ? 'appetizers'
    : 'all';

  const initialExpanded: Record<string, boolean> =
    initialFilter === 'all' ? {} : { [initialFilter]: true };

  const [tab, setTab] = useState<Tab>('items');
  const [filter, setFilter] = useState(initialFilter);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStart = useRef(0);

  const gallery = menuGallery.map((image) => ({
    src: safeImageUrl(image.image_url),
    alt: image.label || 'Menu image',
    caption: image.label || 'Menu',
  }));

  const goToSlide = useCallback(
    (index: number) => {
      if (gallery.length === 0) return;
      const next = ((index % gallery.length) + gallery.length) % gallery.length;
      setCurrentSlide(next);
    },
    [gallery.length]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navigateLightbox = useCallback(
    (direction: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null || gallery.length === 0) return current;
        return (current + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length]
  );

  useEffect(() => {
    if (tab !== 'images' || lightboxIndex !== null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') goToSlide(currentSlide + 1);
      if (event.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [tab, lightboxIndex, currentSlide, goToSlide]);

  useEffect(() => {
    if (currentSlide >= gallery.length && gallery.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, gallery.length]);

  function selectFilter(value: string) {
    setFilter(value);
    setExpanded(value === 'all' ? {} : { [value]: true });
  }

  function toggleCategory(slug: string) {
    setExpanded((previous) => ({ ...previous, [slug]: !previous[slug] }));
  }

  return (
    <>
      <header className="menu-page__header container">
        <span className="script-label">{text(copy, 'menu.header.label', 'Taste the Art')}</span>
        <h1 className="heading-lg">{text(copy, 'menu.header.title', 'Our Menu')}</h1>
        <p className="body-text">
          {text(
            copy,
            'menu.header.body',
            'Korean & Japanese comfort food, boba creations, and specialty coffee'
          )}
        </p>

        <div className="menu-view-tabs" id="menu-view-tabs" role="tablist" aria-label="Menu views">
          <button
            type="button"
            className={`menu-view-tab${tab === 'items' ? ' active' : ''}`}
            data-tab="items"
            role="tab"
            aria-selected={tab === 'items'}
            onClick={() => setTab('items')}
          >
            Menu Items
          </button>
          <button
            type="button"
            className={`menu-view-tab${tab === 'images' ? ' active' : ''}`}
            data-tab="images"
            role="tab"
            aria-selected={tab === 'images'}
            onClick={() => setTab('images')}
          >
            Menu Images
          </button>
        </div>
      </header>

      <div className="menu-tab-panel" id="panel-items" style={{ display: tab === 'items' ? undefined : 'none' }}>
        <div className="container" style={{ marginBottom: '2rem' }}>
          <div className="filter-bar reveal" id="menu-filter">
            <button
              type="button"
              className={`filter-bar__btn${filter === 'all' ? ' active' : ''}`}
              data-filter="all"
              aria-pressed={filter === 'all'}
              onClick={() => selectFilter('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={`filter-bar__btn${filter === category.slug ? ' active' : ''}`}
                data-filter={category.slug}
                aria-pressed={filter === category.slug}
                onClick={() => selectFilter(category.slug)}
              >
                {category.filter_label || category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-sections" id="menu-sections">
          {categories.map((category) => {
            const visible = filter === 'all' || filter === category.slug;
            const isExpanded = Boolean(expanded[category.slug]);

            return (
              <section
                key={category.slug}
                className={`menu-section reveal-group${isExpanded ? ' expanded' : ''}`}
                data-category={category.slug}
                style={{ display: visible ? undefined : 'none' }}
              >
                <div
                  className="menu-section__banner"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleCategory(category.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleCategory(category.slug);
                    }
                  }}
                >
                  {category.image_url ? (
                    <img
                      src={safeImageUrl(category.image_url)}
                      alt={category.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="menu-section__banner-overlay">
                    <div className="menu-section__banner-content">
                      <div className="menu-section__banner-left">
                        <span className="menu-section__icon">{category.icon}</span>
                        <h2 className="menu-section__title">{category.name}</h2>
                        <span className="menu-section__count">
                          {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <span className="menu-section__arrow" aria-hidden="true">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="menu-section__content">
                  {category.is_compact ? (
                    <div className="price-list">
                      {category.items.map((item) => (
                        <div className="price-row" key={item.id ?? item.name}>
                          <span className="price-row__name">
                            {item.name}
                            {item.is_new ? <span className="dish-card__new-badge">NEW</span> : null}
                          </span>
                          <span className="price-row__price">
                            {item.variants[0] ? rs(item.variants[0].price) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="dish-grid">
                      {category.items.map((item) => (
                        <article className="dish-card reveal" key={item.id ?? item.name}>
                          <div className="dish-card__top">
                            <h3 className="dish-card__name">{item.name}</h3>
                            {item.is_new ? <span className="dish-card__new-badge">NEW</span> : null}
                          </div>
                          {item.description ? (
                            <p className="dish-card__desc">{item.description}</p>
                          ) : null}
                          {item.variants.length > 0 ? (
                            <div className="dish-card__variants">
                              {item.variants.map((variant) => (
                                <span
                                  className="variant-pill"
                                  key={variant.id ?? `${item.name}-${variant.label}`}
                                >
                                  {variant.label !== 'Standard' ? (
                                    <>
                                      <span className="variant-pill__type">{variant.label} ·</span>
                                      <span className="variant-pill__price">{rs(variant.price)}</span>
                                    </>
                                  ) : (
                                    <span className="variant-pill__price">{rs(variant.price)}</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {addOns.length > 0 ? (
          <section className="addon-section container reveal" aria-label="Add-ons">
            <div className="addon-section__header">
              <h2 className="addon-section__title">{text(copy, 'menu.addons.title', 'Add-Ons')}</h2>
              <p className="addon-section__subtitle">
                {text(copy, 'menu.addons.subtitle', 'Customise any dish to your taste')}
              </p>
            </div>
            <div className="addon-strip">
              {addOns.map((addOn) => (
                <span className="addon-chip" key={addOn.id ?? addOn.name}>
                  <span className="addon-chip__name">{addOn.name}</span>
                  <span className="addon-chip__price">+ {rs(addOn.price)}</span>
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="menu-tab-panel" id="panel-images" style={{ display: tab === 'images' ? undefined : 'none' }}>
        <div className="container">
          {gallery.length > 0 ? (
            <div className="carousel-container">
              <div className="carousel-track-wrapper">
                <div
                  className="carousel-track"
                  id="carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  onTouchStart={(event) => {
                    touchStart.current = event.touches[0].clientX;
                  }}
                  onTouchEnd={(event) => {
                    const difference = touchStart.current - event.changedTouches[0].clientX;
                    if (Math.abs(difference) > 50) goToSlide(currentSlide + (difference > 0 ? 1 : -1));
                  }}
                >
                  {gallery.map((image, index) => (
                    <div className="carousel-slide" key={menuGallery[index]?.id ?? image.src}>
                      <div
                        className="menu-card"
                        data-index={index}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${image.alt}`}
                        onClick={() => setLightboxIndex(index)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setLightboxIndex(index);
                          }
                        }}
                      >
                        <div className="menu-card__image">
                          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                        </div>
                        {image.caption ? <span className="menu-card__tag">{image.caption}</span> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="carousel-nav carousel-nav--prev"
                aria-label="Previous slide"
                onClick={() => goToSlide(currentSlide - 1)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                className="carousel-nav carousel-nav--next"
                aria-label="Next slide"
                onClick={() => goToSlide(currentSlide + 1)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <div className="carousel-indicator">
                <span id="carousel-current">{currentSlide + 1}</span> /{' '}
                <span id="carousel-total">{gallery.length}</span>
              </div>

              <div className="carousel-dots" id="carousel-dots">
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={`carousel-dot${index === currentSlide ? ' active' : ''}`}
                    data-slide={index}
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="empty-state">Menu images will appear here once they are added in the admin.</p>
          )}
        </div>
      </div>

      <Lightbox
        images={gallery}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
}
