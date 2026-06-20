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
  const menuData = [
    {
      category: 'Appetizers & Street Food',
      slug: 'appetizers',
      icon: '🍗',
      image: 'assets/Menu/SnapInsta.to_657361529_18074624954634821_2762118125821715897_n.jpg',
      items: [
        {
          name: 'Twigim Chicken',
          description: 'Succulent golden-fried chicken coated in a tantalizing sweet and spicy garlic glaze.',
          variants: [{ type: 'Chicken', price: 390 }],
        },
        {
          name: 'Chicken Wing Tempura',
          description: 'Japanese-style chicken wings, expertly fried to a crispy exterior with a juicy interior, seasoned with our signature spice blend.',
          variants: [{ type: 'Standard', price: 400 }],
        },
        {
          name: 'Buldak Chicken Wings',
          description: 'Crispy chicken wings, bursting with fiery heat, generously coated in irresistibly spicy buldak sauce.',
          variants: [
            { type: 'Hot wings', price: 430 },
            { type: '2x Hot wings', price: 440 },
            { type: 'Hot wings + Cheese', price: 450 },
            { type: '2x Hot wings + Cheese', price: 460 },
          ],
        },
        {
          name: 'Shrimp Tempura',
          description: 'A delicate, crispy tempura with a mild savory flavor, served with fresh salad and house-made mayo.',
          variants: [{ type: 'Standard', price: 400 }],
        },
        {
          name: 'Korean Corndog',
          description: 'A hot dog coated in crispy deep-fried batter, served with your choice of toppings.',
          variants: [
            { type: 'Chicken sausage', price: 240 },
            { type: 'Classic cheese', price: 240 },
            { type: 'Sausage Cheese', price: 280 },
            { type: 'Potato Cheese', price: 280 },
          ],
        },
        {
          name: 'Jumbo Pink Mandu',
          description: 'Jumbo momos infused with vibrant beetroot and a juicy tender center. Served with in-house peanut dip and chilli oil.',
          variants: [{ type: 'Chicken', price: 240 }],
        },
        {
          name: 'Korean Tteokbokki',
          description: 'Korean rice cakes in a sweet and spicy sauce, garnished with your choice of toppings.',
          variants: [
            { type: 'Vegan', price: 400 },
            { type: 'Cheese', price: 440 },
            { type: 'Chicken', price: 460 },
          ],
        },
        {
          name: 'Korean Rakbokki',
          description: 'A delicious blend of ramen and soft Korean rice cakes in a sweet and spicy broth.',
          variants: [
            { type: 'Vegan', price: 390 },
            { type: 'Cheese', price: 400 },
            { type: 'Chicken', price: 410 },
          ],
        },
        {
          name: 'Cucumber Banchan',
          description: 'Tangy spicy Korean Cucumber Salad (Oi Muchim) — crunchy, cool, and refreshing.',
          variants: [{ type: 'Vegan', price: 240 }],
        },
      ],
    },
    {
      category: 'Mains & Bowls',
      slug: 'mains',
      icon: '🍜',
      image: 'assets/Menu/SnapInsta.to_657718400_18074624915634821_8389278748129045694_n.jpg',
      items: [
        {
          name: 'Soo.... Ramen-tic',
          description: 'A renowned noodle dish from Korea and Japan, brought to life with our signature spicy broth. Select your desired spice level.',
          variants: [
            { type: 'Vegan', price: 280 },
            { type: 'Chicken', price: 310 },
            { type: 'Seafood', price: 410 },
            { type: 'Mixed', price: 450 },
          ],
        },
        {
          name: 'Kimchi Ramyun',
          description: 'A hearty noodle soup brimming with sweet and sour umami flavors, ideal to elevate your spirits.',
          variants: [
            { type: 'Vegan', price: 300 },
            { type: 'Chicken', price: 340 },
            { type: 'Seafood', price: 440 },
            { type: 'Mixed', price: 450 },
          ],
        },
        {
          name: 'Japanese Katsu',
          description: 'Crispy golden-brown cutlet coated in fluffy Japanese panko, served with house-made mayo and cabbage coleslaw.',
          variants: [
            { type: 'Tofu', price: 290 },
            { type: 'Cottage Cheese', price: 290 },
            { type: 'Chicken', price: 300 },
            { type: 'Fish', price: 380 },
          ],
        },
        {
          name: 'Buldak Jajangmyeon',
          description: 'Korean noodle dish topped with a thick sauce made of chunjang, diced pork, and vegetables.',
          variants: [
            { type: 'Classic', price: 360 },
            { type: 'Chicken', price: 380 },
          ],
        },
        {
          name: 'Dolsot Bibimbaap',
          description: 'A hot bowl of rice with individually prepared seasoned vegetables and a choice of protein. Bibim means mixing, bap is cooked rice.',
          variants: [
            { type: 'Vegan', price: 390 },
            { type: 'Chicken', price: 400 },
          ],
        },
        {
          name: 'Kimchi Fried Rice',
          description: 'Spicy, tangy, savory, and slightly sweet. Fermented kimchi, gochujang, and soy sauce create an umami-rich combination.',
          variants: [
            { type: 'Vegan', price: 280 },
            { type: 'Chicken', price: 320 },
          ],
        },
        {
          name: 'Mini Bento',
          description: 'Steamed rice with our signature in-house furikake seasoning, paired with your choice of protein and gravy.',
          variants: [
            { type: 'Vegan/Veg', price: 260 },
            { type: 'Chicken', price: 280 },
          ],
        },
        {
          name: 'Premium Bento',
          description: 'Two furikake rice balls, crispy katsu, and your choice of protein gravy, served with refreshing salad and umami kimchi.',
          variants: [
            { type: 'Veg/Vegan', price: 450 },
            { type: 'Chicken', price: 460 },
            { type: 'Seafood', price: 510 },
            { type: 'Mixed', price: 560 },
          ],
        },
        {
          name: 'Crispy Kimbap',
          description: 'Rice, a variety of vegetables, and your choice of protein, all wrapped in crispy seaweed.',
          variants: [
            { type: 'Veg/Vegan', price: 370 },
            { type: 'Chicken', price: 390 },
            { type: 'Crispy Shrimp', price: 470 },
          ],
        },
        {
          name: 'Korean Kimbap',
          description: 'Rice, a variety of vegetables, and your choice of protein, all wrapped in seaweed.',
          variants: [
            { type: 'Veg/Vegan', price: 370 },
            { type: 'Egg', price: 360 },
            { type: 'Chicken', price: 380 },
            { type: 'Tuna', price: 470 },
          ],
        },
      ],
    },
    {
      category: 'Hot Beverages',
      slug: 'hot',
      icon: '☕️',
      compact: true,
      image: 'assets/Menu/SnapInsta.to_657347414_18074624927634821_5842886881784906437_n.jpg',
      items: [
        { name: 'Espresso', variants: [{ type: 'Standard', price: 90 }] },
        { name: 'Cappuccino', variants: [{ type: 'Standard', price: 160 }] },
        { name: 'Americano', variants: [{ type: 'Standard', price: 130 }] },
        { name: 'Mocha', variants: [{ type: 'Standard', price: 190 }] },
        { name: 'Vanilla Latte', variants: [{ type: 'Standard', price: 190 }] },
        { name: 'Cinnamon Latte', isNew: true, variants: [{ type: 'Standard', price: 210 }] },
        { name: 'Biscoff Latte', isNew: true, variants: [{ type: 'Standard', price: 310 }] },
        { name: 'Hot Chocolate', variants: [{ type: 'Standard', price: 240 }] },
        { name: 'Matcha Latte', variants: [{ type: 'Standard', price: 280 }] },
        { name: 'Lemon Tea', variants: [{ type: 'Standard', price: 160 }] },
        { name: 'Black Tea', variants: [{ type: 'Standard', price: 160 }] },
        { name: 'Hibiscus Tea', variants: [{ type: 'Standard', price: 210 }] },
      ],
    },
    {
      category: 'Cold Beverages & Refreshers',
      slug: 'cold',
      icon: '🧃',
      compact: true,
      image: 'assets/Menu/SnapInsta.to_657312268_18074624918634821_9102992467512337151_n.jpg',
      items: [
        { name: 'Virgin Elixir Mojito', variants: [{ type: 'Standard', price: 190 }] },
        { name: 'Lemon Cucumber Refresher', variants: [{ type: 'Standard', price: 170 }] },
        { name: 'Peach Iced Tea', variants: [{ type: 'Standard', price: 150 }] },
        { name: 'Lemon Iced Tea', variants: [{ type: 'Standard', price: 150 }] },
        { name: 'Mango Iced Tea', variants: [{ type: 'Standard', price: 150 }] },
        { name: 'Iced Hibiscus Tea', variants: [{ type: 'Standard', price: 180 }] },
        { name: 'Soft Drinks', variants: [{ type: 'Standard', price: 90 }] },
        { name: 'Tiramisu Latte', isNew: true, variants: [{ type: 'Standard', price: 280 }] },
        { name: 'Biscoff Latte', isNew: true, variants: [{ type: 'Standard', price: 310 }] },
        { name: 'Cafe Caramello', variants: [{ type: 'Standard', price: 210 }] },
        { name: 'Iced Vanilla Latte', variants: [{ type: 'Standard', price: 190 }] },
        { name: 'Iced Cafe Latte', variants: [{ type: 'Standard', price: 170 }] },
        { name: 'Iced Americano', variants: [{ type: 'Standard', price: 160 }] },
        { name: 'Iced Mocha', isNew: true, variants: [{ type: 'Standard', price: 190 }] },
      ],
    },
    {
      category: 'Boba Drinks',
      slug: 'boba',
      icon: '🧋',
      image: 'assets/Menu/SnapInsta.to_656906071_18074624906634821_2674842108829996519_n.jpg',
      items: [
        {
          name: 'Strawberry Matcha Latte',
          description: 'A perfect amalgamation of earthy and refreshing fruity notes.',
          variants: [
            { type: 'Without Boba', price: 250 },
            { type: 'With Boba', price: 300 },
          ],
        },
        {
          name: 'Mango Matcha Latte',
          description: 'Rich mango and earthy matcha in a refreshing cold latte.',
          variants: [
            { type: 'Without Boba', price: 250 },
            { type: 'With Boba', price: 300 },
          ],
        },
        {
          name: 'Strawberry Rush',
          description: 'Rich strawberry milk served cold, topped with creamy strawberry cool whip.',
          variants: [
            { type: 'Without Boba', price: 210 },
            { type: 'With Boba', price: 260 },
          ],
        },
        {
          name: 'By the Bay',
          description: 'Creamy latte of butterfly pea tea and espresso.',
          variants: [
            { type: 'Without Boba', price: 210 },
            { type: 'With Boba', price: 260 },
          ],
        },
        {
          name: 'Cocoa',
          description: 'Perfectly sweetened chocolate milk topped with cocoa cream.',
          variants: [
            { type: 'Without Boba', price: 210 },
            { type: 'With Boba', price: 260 },
          ],
        },
        {
          name: 'Chai Latté',
          description: 'Tea-based latte, warm and comforting.',
          variants: [
            { type: 'Without Boba', price: 180 },
            { type: 'With Boba', price: 230 },
          ],
        },
        {
          name: 'Brown Sugar',
          description: 'Decadent sweet caramel milk-based drink with chewy tapioca pearls.',
          variants: [{ type: 'With Boba', price: 230 }],
        },
        {
          name: 'Matcha Latté',
          description: 'Made using shade-grown green tea powder whisked into a creamy latte.',
          variants: [
            { type: 'Without Boba', price: 240 },
            { type: 'With Boba', price: 290 },
          ],
        },
      ],
    },
  ];

  const globalAddOns = [
    { name: 'Kimchi', price: 50 },
    { name: 'Cheese', price: 40 },
    { name: 'Chilli Oil', price: 20 },
    { name: 'Egg', price: 30 },
    { name: 'Crispy Chicken', price: 150 },
    { name: 'Onigiri Rice Ball', price: 80 },
    { name: 'Cheese Sauce', price: 60 },
  ];

  const menuImages = [
    { image: 'assets/Menu/SnapInsta.to_657361529_18074624954634821_2762118125821715897_n.jpg', label: 'Appetizers' },
    { image: 'assets/Menu/SnapInsta.to_657718400_18074624915634821_8389278748129045694_n.jpg', label: 'Mains & Bowls' },
    { image: 'assets/Menu/SnapInsta.to_657347414_18074624927634821_5842886881784906437_n.jpg', label: 'Hot Beverages' },
    { image: 'assets/Menu/SnapInsta.to_657312268_18074624918634821_9102992467512337151_n.jpg', label: 'Cold Beverages' },
    { image: 'assets/Menu/SnapInsta.to_656906071_18074624906634821_2674842108829996519_n.jpg', label: 'Boba Drinks' },
    { image: 'assets/Menu/SnapInsta.to_657363241_18074624945634821_2396601562733461693_n.jpg', label: 'Chicken Wings & Tempura' },
    { image: 'assets/Menu/SnapInsta.to_657931010_18074624936634821_657350650141812241_n.jpg', label: 'Japanese Katsu' },
    { image: 'assets/Menu/SnapInsta.to_658341642_18074624891634821_3999858514850156986_n.jpg', label: 'Korean Tteokbokki' },
    { image: 'assets/Menu/SnapInsta.to_658845431_18074624870634821_8119804553295390615_n.jpg', label: 'Bento Box' },
    { image: 'assets/Menu/SnapInsta.to_659036926_18074624882634821_2388904814950615653_n.jpg', label: 'Dolsot Bibimbap' }
  ];

  const highlights = [
    {
      image: 'assets/Food/Screenshot_20260619_144900.jpg',
      category: 'Signature',
      badge: 'Signature',
      title: 'Signature Spread',
      desc: 'Experience the best of Bite & Beans with a feast featuring our fan-favorite bentos, ramen, and crispy wings.',
      price: 'Explore the Menu',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144911.jpg',
      category: 'Bento',
      badge: 'Best Seller',
      title: 'Premium Bento',
      desc: 'A Japanese-style bento box featuring two furikake rice balls, crispy katsu, and a gravy of your choice of protein, all served alongside a refreshing salad and flavorful umami kimchi.',
      price: 'From Rs. 450',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144922.jpg',
      category: 'Dumplings',
      badge: 'Comfort Food',
      title: 'Jumbo Pink Mandu',
      desc: 'Savour our scrumptious Jumbo momos, infused with vibrant beetroot and filled with a juicy, tender center. These delightful treats come with our in-house peanut dip and chilli oil for an extra umami.',
      price: 'From Rs. 240',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144943.jpg',
      category: 'Katsu',
      badge: 'Must Try',
      title: 'Japanese Katsu',
      desc: 'Crispy golden-brown cutlet coated in fluffy Japanese panko, served with house-made mayo and cabbage coleslaw.',
      price: 'From Rs. 290',
    },
    {
      image: 'assets/Food/Screenshot_20260619_144951.jpg',
      category: 'Fried Rice',
      badge: 'Korean Classic',
      title: 'Kimchi Fried Rice',
      desc: 'The dish combines spicy, tangy, savory, and slightly sweet flavors. Fermented kimchi adds tanginess, while gochujang and soy sauce boost spiciness and umami.',
      price: 'From Rs. 280',
    },
    {
      image: 'assets/Food/Screenshot_20260619_145001.jpg',
      category: 'Beverages',
      badge: 'Cafe',
      title: 'Classic Cappuccino',
      desc: 'A rich and comforting cup of expertly brewed coffee topped with silky steamed milk and beautiful latte art.',
      price: 'From Rs. 160',
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
    const filterButtons = [
      { label: 'All', value: 'all' },
      { label: 'Appetizers', value: 'appetizers' },
      { label: 'Mains', value: 'mains' },
      { label: 'Hot Drinks', value: 'hot' },
      { label: 'Cold Drinks', value: 'cold' },
      { label: 'Boba', value: 'boba' },
    ];

    const sectionsHTML = menuData
      .map(
        (cat) => `
        <section class="menu-section reveal-group${cat.slug === 'appetizers' ? ' expanded' : ''}" data-category="${cat.slug}"${cat.slug !== 'appetizers' ? ' style="display:none"' : ''}>
          <div class="menu-section__banner">
            ${imageTag(cat.image, cat.category)}
            <div class="menu-section__banner-overlay">
              <div class="menu-section__banner-content">
                <div class="menu-section__banner-left">
                  <span class="menu-section__icon">${cat.icon}</span>
                  <h2 class="menu-section__title">${cat.category}</h2>
                  <span class="menu-section__count">${cat.items.length} items</span>
                </div>
                <span class="menu-section__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </span>
              </div>
            </div>
          </div>
          <div class="menu-section__content">
            ${cat.compact
              ? `<div class="price-list">
                ${cat.items
                  .map(
                    (item) => `
                  <div class="price-row">
                    <span class="price-row__name">
                      ${item.name}
                      ${item.isNew ? '<span class="dish-card__new-badge">NEW</span>' : ''}
                    </span>
                    <span class="price-row__price">Rs. ${item.variants[0].price}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>`
              : `<div class="dish-grid">
                ${cat.items
                  .map(
                    (item) => `
                  <article class="dish-card reveal">
                    <div class="dish-card__top">
                      <h3 class="dish-card__name">${item.name}</h3>
                      ${item.isNew ? '<span class="dish-card__new-badge">NEW</span>' : ''}
                    </div>
                    ${item.description ? `<p class="dish-card__desc">${item.description}</p>` : ''}
                    <div class="dish-card__variants">
                      ${item.variants
                        .map(
                          (v) => `
                        <span class="variant-pill">
                          ${v.type !== 'Standard' ? `<span class="variant-pill__type">${v.type} ·</span>` : ''}
                          <span class="variant-pill__price">Rs. ${v.price}</span>
                        </span>
                      `
                        )
                        .join('')}
                    </div>
                  </article>
                `
                  )
                  .join('')}
              </div>`
            }
          </div>
        </section>
      `
      )
      .join('');

    const addOnsHTML = globalAddOns
      .map(
        (addon) => `
        <span class="addon-chip">
          <span class="addon-chip__name">${addon.name}</span>
          <span class="addon-chip__price">+ Rs. ${addon.price}</span>
        </span>
      `
      )
      .join('');

    return `
      <section class="page menu-page" data-page="menu">
        <header class="menu-page__header container">
          <span class="script-label">Taste the Art</span>
          <h1 class="heading-lg">Our Menu</h1>
          <p class="body-text">Korean &amp; Japanese comfort food, boba creations, and specialty coffee</p>
          
          <div class="menu-view-tabs" id="menu-view-tabs">
            <button class="menu-view-tab active" data-tab="items">Menu Items</button>
            <button class="menu-view-tab" data-tab="images">Menu Images</button>
          </div>
        </header>

        <!-- Tab 1: Menu Items Panel -->
        <div class="menu-tab-panel" id="panel-items">
          <div class="container" style="margin-bottom: 2rem;">
            <div class="filter-bar reveal" id="menu-filter">
              ${filterButtons
                .map(
                  (btn, i) =>
                    `<button class="filter-bar__btn${btn.value === 'appetizers' ? ' active' : ''}" data-filter="${btn.value}" aria-pressed="${btn.value === 'appetizers' ? 'true' : 'false'}">${btn.label}</button>`
                )
                .join('')}
            </div>
          </div>

          <div class="menu-sections" id="menu-sections">
            ${sectionsHTML}
          </div>

          <section class="addon-section container reveal" aria-label="Add-ons">
            <div class="addon-section__header">
              <h2 class="addon-section__title">Add-Ons</h2>
              <p class="addon-section__subtitle">Customise any dish to your taste</p>
            </div>
            <div class="addon-strip">${addOnsHTML}</div>
          </section>
        </div>

        <!-- Tab 2: Menu Images Panel -->
        <div class="menu-tab-panel" id="panel-images" style="display: none;">
          <div class="container">
            <div class="carousel-container">
              <div class="carousel-track-wrapper">
                <div class="carousel-track" id="carousel-track">
                  ${menuImages
                    .map(
                      (img, index) => `
                    <div class="carousel-slide">
                      <div class="menu-card" data-index="${index}">
                        <div class="menu-card__image">
                          ${imageTag(img.image, img.label)}
                        </div>
                        <span class="menu-card__tag">${img.label}</span>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
              <button class="carousel-nav carousel-nav--prev" aria-label="Previous Slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button class="carousel-nav carousel-nav--next" aria-label="Next Slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
              <div class="carousel-indicator">
                <span id="carousel-current">1</span> / <span id="carousel-total">${menuImages.length}</span>
              </div>
              <div class="carousel-dots" id="carousel-dots">
                ${menuImages.map((_, index) => `<button class="carousel-dot${index === 0 ? ' active' : ''}" data-slide="${index}" aria-label="Go to slide ${index + 1}"></button>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <section class="cta-block reveal" aria-label="Reservation call to action">
          <div class="cta-block__inner">
            <h2>Hungry? Let's Make It Happen.</h2>
            <p>Reserve your table or place an order on WhatsApp</p>
            <div class="cta-block__actions">
              <a href="https://wa.me/918135972387" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--large">Reserve on WhatsApp</a>
              <a href="#visit" class="btn btn--outline btn--large">Plan Your Visit</a>
            </div>
          </div>
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

  function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-view-tab');
    const panelItems = document.getElementById('panel-items');
    const panelImages = document.getElementById('panel-images');
    if (!tabs.length || !panelItems || !panelImages) return;

    // Tabs switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const activeTab = tab.getAttribute('data-tab');
        if (activeTab === 'items') {
          panelItems.style.display = '';
          panelImages.style.display = 'none';
        } else {
          panelItems.style.display = 'none';
          panelImages.style.display = '';
          goToSlide(currentSlide);
        }

        // Re-initialize lightbox index set when tabs switch
        if (typeof window.initLightbox === 'function') {
          window.initLightbox();
        }
      });
    });

    // Carousel logic
    const track = document.getElementById('carousel-track');
    const prevBtn = document.querySelector('.carousel-nav--prev');
    const nextBtn = document.querySelector('.carousel-nav--next');
    const currentText = document.getElementById('carousel-current');
    const dots = document.querySelectorAll('.carousel-dot');

    if (!track) return;

    let currentSlide = 0;
    const totalSlides = menuImages.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;

      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      if (currentText) currentText.textContent = currentSlide + 1;

      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        goToSlide(slideIdx);
      });
    });

    // Touch swipe support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
    }, { passive: true });

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (panelImages.style.display === 'none') return;
      const lightbox = document.getElementById('lightbox');
      if (lightbox && !lightbox.hidden) return;

      if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Initial state
    goToSlide(0);
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
    if (page === 'menu') {
      initMenuTabs();
    }
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
    menuData,
    menuImages,
    globalAddOns,
    assetPath,
    navigate,
  };
})();
