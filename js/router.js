// router.js

/* =========================================================
   Bite & Beans — Hash-based SPA Router
   Renders page content and manages navigation state
   ========================================================= */

(function () {
  'use strict';

  const app = document.getElementById('app');
  const validPages = ['home', 'menu', 'experience', 'visit'];

  // Page content definitions
  const pages = {
    home: renderHome,
    menu: renderMenu,
    experience: renderExperience,
    visit: renderVisit,
  };

  // Shared data
  const menuItems = [
    { image: 'assets/Menu/SnapInsta.to_656906071_18074624906634821_2674842108829996519_n.jpg', category: 'Boba', type: 'drink' },
    { image: 'assets/Menu/SnapInsta.to_657312268_18074624918634821_9102992467512337151_n.jpg', category: 'Refreshers', type: 'drink' },
    { image: 'assets/Menu/SnapInsta.to_657347414_18074624927634821_5842886881784906437_n.jpg', category: 'Hot Beverages', type: 'drink' },
    { image: 'assets/Menu/SnapInsta.to_657361529_18074624954634821_2762118125821715897_n.jpg', category: 'Chicken', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_657363241_18074624945634821_2396601562733461693_n.jpg', category: 'Tempura', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_657718400_18074624915634821_8389278748129045694_n.jpg', category: 'Ramen', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_657931010_18074624936634821_657350650141812241_n.jpg', category: 'Katsu', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_658341642_18074624891634821_3999858514850156986_n.jpg', category: 'Tteokbokki', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_658845431_18074624870634821_8119804553295390615_n.jpg', category: 'Bento', type: 'food' },
    { image: 'assets/Menu/SnapInsta.to_659036926_18074624882634821_2388904814950615653_n.jpg', category: 'Bibimbap', type: 'food' },
  ];

  const highlights = [
    {
      image: 'assets/Food/Screenshot_20260619_144900.jpg',
      category: 'Mandu',
      badge: 'Signature',
      title: 'Jumbo Pink Mandu',
      desc: 'Plump, pan-seared dumplings with a delicate pink hue and savoury filling.',
      price: 'From Rs. 240',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144911.jpg',
      category: 'Chicken',
      badge: 'Best Seller',
      title: 'Twigim Chicken',
      desc: 'Crispy Korean fried chicken bites tossed in a sweet-spicy glaze.',
      price: 'From Rs. 390',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144922.jpg',
      category: 'Ramen',
      badge: 'Comfort Bowl',
      title: 'Soo... Ramen-tic',
      desc: 'Steaming noodles in a rich, soul-warming broth with fresh toppings.',
      price: 'From Rs. 280',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144943.jpg',
      category: 'Boba',
      badge: 'Must Try',
      title: 'Brown Sugar Boba',
      desc: 'Caramelised brown sugar pearls swirled through creamy milk.',
      price: 'Rs. 230',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144951.jpg',
      category: 'Bibimbap',
      badge: 'Korean Classic',
      title: 'Dolsot Bibimbaap',
      desc: 'Sizzling stone pot rice with colourful veggies, gochujang, and egg.',
      price: 'From Rs. 390',
    },
    {
      image: 'assets/Food/Screenshot_20260619_145001.jpg',
      category: 'Tteokbokki',
      badge: 'Street Food',
      title: 'Korean Tteokbokki',
      desc: 'Chewy rice cakes simmered in a fiery, sweet gochujang sauce.',
      price: 'From Rs. 400',
    },
  ];

  const experiencePhotos = [
    {
      image: 'assets/Infrastructure/Screenshot_20260619_144836.jpg',
      title: 'The Grand Hall',
      desc: 'Monochrome interiors with hand-drawn wall art and reflective glass tables',
    },
    {
      image: 'assets/Infrastructure/Screenshot_20260619_144847.jpg',
      title: 'Garden Seating',
      desc: 'Outdoor charm with 2D sketch panels, fairy lights, and floral accents',
    },
    {
      image: 'assets/Infrastructure/Screenshot_20260619_144933.jpg',
      title: 'The Chandelier Room',
      desc: 'Ornate ceiling details, soft lighting, and storybook ambiance',
    },
    {
      image: 'assets/Infrastructure/Screenshot_20260619_145008.jpg',
      title: 'Hand-Drawn Details',
      desc: 'Every surface is a canvas — windows, doors, and decor in ink',
    },
    {
      image: 'assets/Infrastructure/Screenshot_20260619_145024.jpg',
      title: 'Welcome In',
      desc: 'The bubble-letter sign that started it all — your portal to the 2D world',
    },
  ];

  // Helpers
  function assetPath(path) {
    return path;
  }

  function imageTag(path, alt, classes = '') {
    return `<img src="${assetPath(path)}" alt="${alt}" loading="lazy" class="${classes}" />`;
  }

  // Render functions
  function renderHome() {
    const highlightsHTML = highlights
      .map(
        (item) => `
        <article class="highlight-card reveal">
          <div class="highlight-card__image">
            ${imageTag(item.image, item.title)}
            <span class="highlight-card__badge">${item.badge}</span>
          </div>
          <div class="highlight-card__content">
            <span class="highlight-card__category">${item.category}</span>
            <h3 class="highlight-card__title">${item.title}</h3>
            <p class="highlight-card__desc">${item.desc}</p>
            <p class="highlight-card__price">${item.price}</p>
          </div>
        </article>
      `
      )
      .join('');

    return `
      <section class="page home-page" data-page="home">
        <section class="hero" aria-label="Bite & Beans hero">
          <div class="hero__bg" id="hero-bg">
            ${imageTag('assets/Infrastructure/Screenshot_20260619_144933.jpg', 'Elegant chandelier room at Bite & Beans')}
          </div>
          <div class="hero__overlay"></div>
          <div class="hero__content">
            <img class="hero__logo" src="${assetPath('assets/Logo/Gemini_Generated_Image_pejfj1pejfj1pejf.png')}" alt="Bite & Beans 2D Cafe House logo" loading="eager" />
            <h1 class="heading-xl hero__title">Guwahati's First & Only 2D Cafe</h1>
            <p class="hero__subtitle">Where every corner feels like a sketchbook come to life</p>
            <a href="#menu" class="btn btn--primary btn--large hero__cta">Explore Menu</a>
          </div>
        </section>

        <section id="space" class="section container">
          <div class="section-header reveal">
            <span class="script-label">The Space</span>
            <h2 class="heading-lg">Step Into a Sketchbook</h2>
            <p class="body-text">Monochrome walls, ink-style furniture, and surreal comic-book aesthetics await around every corner.</p>
          </div>
          <div class="experience-teaser__grid reveal-group">
            <figure class="experience-teaser__item experience-teaser__item--large reveal">
              ${imageTag('assets/Infrastructure/Screenshot_20260619_144933.jpg', 'The chandelier room at Bite & Beans')}
              <figcaption class="experience-teaser__caption">
                <h3>The Chandelier Room</h3>
                <p>Storybook lighting and ornate ceilings</p>
              </figcaption>
            </figure>
            <figure class="experience-teaser__item reveal">
              ${imageTag('assets/Infrastructure/Screenshot_20260619_145008.jpg', 'Hand-drawn wall details')}
              <figcaption class="experience-teaser__caption">
                <h3>Hand-Drawn Details</h3>
                <p>Windows, doors, and decor in ink</p>
              </figcaption>
            </figure>
            <figure class="experience-teaser__item reveal">
              ${imageTag('assets/Infrastructure/Screenshot_20260619_144847.jpg', 'Garden seating with fairy lights')}
              <figcaption class="experience-teaser__caption">
                <h3>Garden Seating</h3>
                <p>Outdoor charm under the stars</p>
              </figcaption>
            </figure>
          </div>
          <div class="text-center mt-2 reveal">
            <a href="#experience" class="btn btn--secondary">See Full Gallery</a>
          </div>
        </section>

        <section class="section" style="background-color: var(--bg-secondary);">
          <div class="container">
            <div class="section-header reveal">
              <span class="script-label">Fan Favourites</span>
              <h2 class="heading-lg">Menu Highlights</h2>
            </div>
          </div>
          <div class="highlights__scroll reveal-group" id="highlights-scroll">
            ${highlightsHTML}
          </div>
          <div class="highlights__footer reveal">
            <a href="#menu" class="btn btn--primary">View Full Menu</a>
          </div>
        </section>

        <section class="vibe-strip" aria-label="Cafe highlights">
          <div class="container text-center reveal" style="margin-bottom: 1.5rem;">
            <span class="script-label">Why You'll Love Us</span>
          </div>
          <div class="vibe-strip__grid reveal-group">
            <div class="vibe-strip__item reveal">
              <span class="vibe-strip__icon"><img src="assets/Features/instagrammable.png" alt="Instagrammable" /></span>
              <span class="vibe-strip__label">Instagrammable</span>
            </div>
            <div class="vibe-strip__item reveal">
              <span class="vibe-strip__icon"><img src="assets/Features/dog_friendly.png" alt="Dog Friendly" /></span>
              <span class="vibe-strip__label">Dog Friendly</span>
            </div>
            <div class="vibe-strip__item reveal">
              <span class="vibe-strip__icon"><img src="assets/Features/vegan_options.png" alt="Vegan Options" /></span>
              <span class="vibe-strip__label">Vegan Options</span>
            </div>
            <div class="vibe-strip__item reveal">
              <span class="vibe-strip__icon"><img src="assets/Features/halal_food.png" alt="Halal Food" /></span>
              <span class="vibe-strip__label">Halal Food</span>
            </div>
          </div>
        </section>

        <section class="visit-snapshot container">
          <div class="visit-snapshot__card reveal">
            <div class="visit-snapshot__image">
              ${imageTag('assets/Infrastructure/Screenshot_20260619_145024.jpg', 'Exterior of Bite & Beans cafe')}
            </div>
            <div class="visit-snapshot__content">
              <h3>Visit Us</h3>
              <div class="visit-snapshot__detail">
                <span class="visit-snapshot__detail-icon"><img src="assets/Features/map_pin.png" alt="Address Pin" /></span>
                <div>
                  <strong>Address</strong>
                  Rajgarh Rd, Sarania Hills, Guwahati, Assam 781003
                </div>
              </div>
              <div class="visit-snapshot__detail">
                <span class="visit-snapshot__detail-icon"><img src="assets/Features/clock.png" alt="Hours Clock" /></span>
                <div>
                  <strong>Hours</strong>
                  Open Daily · 12:00 PM — 10:00 PM
                </div>
              </div>
              <div class="visit-snapshot__detail">
                <span class="visit-snapshot__detail-icon"><img src="assets/Features/money_bag.png" alt="Average Spend Bag" /></span>
                <div>
                  <strong>Average Spend</strong>
                  Rs. 200 — 400 per person
                </div>
              </div>
              <a href="https://wa.me/918135972387" target="_blank" rel="noopener noreferrer" class="btn btn--primary mt-1">Reserve on WhatsApp</a>
            </div>
          </div>
        </section>
      </section>
    `;
  }

  function renderMenu() {
    const menuCards = menuItems
      .map(
        (item, index) => `
        <article class="menu-card reveal" data-type="${item.type}" data-index="${index}" tabindex="0" role="button" aria-label="View ${item.category} menu">
          <span class="menu-card__tag">${item.category}</span>
          <div class="menu-card__image">
            ${imageTag(item.image, `${item.category} menu`)}
          </div>
        </article>
      `
      )
      .join('');

    return `
      <section class="page menu-page" data-page="menu">
        <header class="menu-page__header container">
          <span class="script-label">Taste the Art</span>
          <h1 class="heading-lg">Our Menu</h1>
          <p class="body-text">Korean & Japanese comfort food, boba creations, and specialty coffee</p>
          <p class="muted-text">Tap any menu to explore</p>
          <div class="filter-bar reveal" id="menu-filter">
            <button class="filter-bar__btn active" data-filter="all">All</button>
            <button class="filter-bar__btn" data-filter="drinks">Drinks</button>
            <button class="filter-bar__btn" data-filter="food">Food</button>
          </div>
        </header>
        <section class="menu-gallery reveal-group" id="menu-gallery" aria-label="Menu gallery">
          ${menuCards}
        </section>
      </section>
    `;
  }

  function renderExperience() {
    const galleryHTML = experiencePhotos
      .map(
        (photo) => `
        <figure class="gallery-figure reveal">
          <div class="gallery-figure__image">
            ${imageTag(photo.image, photo.title)}
          </div>
          <figcaption class="gallery-figure__caption">
            <h3>${photo.title}</h3>
            <p>${photo.desc}</p>
          </figcaption>
        </figure>
      `
      )
      .join('');

    return `
      <section class="page experience-page" data-page="experience">
        <header class="experience-page__header container">
          <span class="script-label">Inside the Sketchbook</span>
          <h1 class="heading-lg">The 2D Experience</h1>
          <p class="body-text">Every wall, chair, and detail is designed to make you feel like you've stepped inside a drawing</p>
        </header>
        <section class="experience-page__gallery reveal-group" aria-label="Cafe interior gallery">
          ${galleryHTML}
        </section>
      </section>
    `;
  }

  function renderVisit() {
    return `
      <section class="page visit-page" data-page="visit">
        <header class="visit-page__header container">
          <span class="script-label">Find Us</span>
          <h1 class="heading-lg">Plan Your Visit</h1>
          <p class="body-text">We're waiting with a warm bowl and a sketchbook backdrop</p>
        </header>

        <div class="visit-page__hero reveal">
          ${imageTag('assets/Infrastructure/Screenshot_20260619_145037.jpg', 'Bite & Beans exterior with bubble-letter sign')}
        </div>

        <section class="visit-details reveal-group" aria-label="Visit details">
          <article class="visit-card reveal">
            <div class="visit-card__header">
              <span class="visit-card__icon"><img src="assets/Features/map_pin.png" alt="Address Pin" /></span>
              <h3>Address</h3>
            </div>
            <p>Rajgarh Rd, Sarania Hills, Guwahati, Assam 781003</p>
            <p class="mt-1"><a href="https://www.google.com/maps/search/?api=1&query=Bite+%26+Beans+Sarania+Hills+Guwahati" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
          </article>

          <article class="visit-card reveal">
            <div class="visit-card__header">
              <span class="visit-card__icon"><img src="assets/Features/clock.png" alt="Hours Clock" /></span>
              <h3>Hours</h3>
            </div>
            <p>Monday — Sunday<br />12:00 PM — 10:00 PM</p>
          </article>

          <article class="visit-card reveal">
            <div class="visit-card__header">
              <span class="visit-card__icon"><img src="assets/Features/phone.png" alt="Phone Receiver" /></span>
              <h3>Contact</h3>
            </div>
            <p>Phone: <a href="tel:06000487453">060004 87453</a></p>
            <p>WhatsApp: <a href="https://wa.me/918135972387" target="_blank" rel="noopener noreferrer">+91 81359 72387</a></p>
            <p>Instagram: <a href="https://instagram.com/biteandbeanss" target="_blank" rel="noopener noreferrer">@biteandbeanss</a></p>
          </article>

          <article class="visit-card reveal">
            <div class="visit-card__header">
              <span class="visit-card__icon"><img src="assets/Features/money_bag.png" alt="Average Spend Bag" /></span>
              <h3>Pricing</h3>
            </div>
            <p>Average spend per person</p>
            <p class="visit-card__price">Rs. 200 — 400</p>
          </article>
        </section>

        <section class="amenities" aria-label="Amenities">
          <h2 class="amenities__heading reveal">Amenities</h2>
          <div class="amenities__grid reveal-group">
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/dog_friendly.png" alt="Dog Friendly" /></span><span>Dog Friendly</span></div>
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/instagrammable.png" alt="Instagrammable" /></span><span>Instagrammable</span></div>
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/vegan_options.png" alt="Vegan Options" /></span><span>Vegan Options</span></div>
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/halal_food.png" alt="Halal Food" /></span><span>Halal Food</span></div>
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/free_parking.png" alt="Free Parking" /></span><span>Free Parking</span></div>
            <div class="amenity reveal"><span class="amenity__icon"><img src="assets/Features/paid_wifi.png" alt="Paid Wi-Fi" /></span><span>Paid Wi-Fi</span></div>
          </div>
        </section>

        <section class="cta-block reveal" aria-label="Reservation call to action">
          <div class="cta-block__inner">
            <h2>Ready to Step Into the Sketch?</h2>
            <p>Reservations recommended during peak hours</p>
            <div class="cta-block__actions">
              <a href="https://wa.me/918135972387" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--large">Reserve on WhatsApp</a>
              <a href="tel:06000487453" class="btn btn--outline btn--large">Call Us</a>
            </div>
          </div>
        </section>
      </section>
    `;
  }

  // Navigation state management
  function updateActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach((el) => {
      const elPage = el.getAttribute('data-page');
      if (elPage === page) {
        el.classList.add('active');
        el.setAttribute('aria-current', 'page');
      } else {
        el.classList.remove('active');
        el.removeAttribute('aria-current');
      }
    });
  }

  function scrollTopNav(page) {
    const topNav = document.querySelector('.top-nav');
    if (page === 'home') {
      topNav.classList.remove('top-nav--scrolled');
    } else {
      topNav.classList.add('top-nav--scrolled');
    }
  }

  // Mobile Hamburger Toggle Setup
  function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('top-nav-links');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        toggleBtn.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking a link
    navLinks.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Router entry point
  function navigate() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const page = validPages.includes(hash) ? hash : 'home';

    app.innerHTML = pages[page]();
    document.title = `Bite & Beans — ${page.charAt(0).toUpperCase() + page.slice(1)}`;

    updateActiveNav(page);
    scrollTopNav(page);

    // Re-initialise page-specific JS
    if (typeof window.initLightbox === 'function') window.initLightbox();
    if (typeof window.initFilters === 'function') window.initFilters();
    if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
    if (typeof window.initParallax === 'function') window.initParallax();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Listen for hash changes and initial load
  window.addEventListener('hashchange', navigate, { passive: true });
  window.addEventListener('load', () => {
    initMobileMenu();
    navigate();
  });

  // Expose helpers for other modules
  window.Router = {
    menuItems,
    assetPath,
    navigate,
  };
})();
