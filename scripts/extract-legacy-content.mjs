// scripts/extract-legacy-content.mjs
// One-time migration: pulls the hardcoded content out of legacy/js/router.js
// and writes data/content.json, the single source of truth for defaults + seed SQL.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = readFileSync(join(root, 'legacy/js/router.js'), 'utf8');

function extractLiteral(name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`Could not find ${name}`);
  const open = source.indexOf('[', start);
  let depth = 0;
  let inString = null;
  let escaped = false;

  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === inString) inString = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      inString = char;
      continue;
    }
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(open, i + 1);
        return Function(`"use strict"; return (${literal});`)();
      }
    }
  }
  throw new Error(`Unbalanced array for ${name}`);
}

const menuData = extractLiteral('menuData');
const globalAddOns = extractLiteral('globalAddOns');
const menuImages = extractLiteral('menuImages');
const highlights = extractLiteral('highlights');
const experiencePhotos = extractLiteral('experiencePhotos');

const content = {
  settings: {
    brand_name: 'Bite & Beans',
    logo_url: '/assets/Logo/Gemini_Generated_Image_pejfj1pejfj1pejf.png',
    hero_image_url: '/assets/Infrastructure/Screenshot_20260619_144933.jpg',
    visit_image_url: '/assets/Infrastructure/Screenshot_20260619_145037.jpg',
    snapshot_image_url: '/assets/Infrastructure/Screenshot_20260619_145024.jpg',
    address: 'Rajgarh Rd, Sarania Hills, Guwahati, Assam 781003',
    maps_url:
      'https://www.google.com/maps/search/?api=1&query=Bite+%26+Beans+Sarania+Hills+Guwahati',
    hours_days: 'Monday — Sunday',
    hours_time: '12:00 PM — 10:00 PM',
    phone: '060004 87453',
    whatsapp_number: '918135972387',
    instagram_handle: '@biteandbeanss',
    instagram_url: 'https://instagram.com/biteandbeanss',
    average_spend: 'Rs. 200 — 400',
    meta_title: 'Bite & Beans — 2D Cafe House | Guwahati',
    meta_description:
      "Bite & Beans 2D Cafe House — Guwahati's first 2D-themed cafe. Step into a sketchbook of Korean & Japanese comfort food, boba, and specialty coffee.",
    theme_color: '#8B2635',
  },
  copy: [
    { key: 'home.hero.title', page: 'home', label: 'Hero title', value: "Guwahati's First & Only 2D Cafe", multiline: false, sort_order: 10 },
    { key: 'home.hero.subtitle', page: 'home', label: 'Hero subtitle', value: 'Where every corner feels like a sketchbook come to life', multiline: false, sort_order: 20 },
    { key: 'home.space.label', page: 'home', label: 'Space label', value: 'The Space', multiline: false, sort_order: 30 },
    { key: 'home.space.title', page: 'home', label: 'Space title', value: 'Step Into a Sketchbook', multiline: false, sort_order: 40 },
    { key: 'home.space.body', page: 'home', label: 'Space description', value: 'Monochrome walls, ink-style furniture, and surreal comic-book aesthetics await around every corner.', multiline: true, sort_order: 50 },
    { key: 'home.highlights.label', page: 'home', label: 'Highlights label', value: 'Fan Favourites', multiline: false, sort_order: 60 },
    { key: 'home.highlights.title', page: 'home', label: 'Highlights title', value: 'Menu Highlights', multiline: false, sort_order: 70 },
    { key: 'home.vibe.label', page: 'home', label: 'Features label', value: "Why You'll Love Us", multiline: false, sort_order: 80 },
    { key: 'home.visit.title', page: 'home', label: 'Visit card title', value: 'Visit Us', multiline: false, sort_order: 90 },
    { key: 'menu.header.label', page: 'menu', label: 'Page label', value: 'Taste the Art', multiline: false, sort_order: 10 },
    { key: 'menu.header.title', page: 'menu', label: 'Page title', value: 'Our Menu', multiline: false, sort_order: 20 },
    { key: 'menu.header.body', page: 'menu', label: 'Page description', value: 'Korean & Japanese comfort food, boba creations, and specialty coffee', multiline: true, sort_order: 30 },
    { key: 'menu.addons.title', page: 'menu', label: 'Add-ons title', value: 'Add-Ons', multiline: false, sort_order: 40 },
    { key: 'menu.addons.subtitle', page: 'menu', label: 'Add-ons subtitle', value: 'Customise any dish to your taste', multiline: false, sort_order: 50 },
    { key: 'menu.cta.title', page: 'menu', label: 'CTA title', value: "Hungry? Let's Make It Happen.", multiline: false, sort_order: 60 },
    { key: 'menu.cta.body', page: 'menu', label: 'CTA description', value: 'Reserve your table or place an order on WhatsApp', multiline: false, sort_order: 70 },
    { key: 'experience.header.label', page: 'experience', label: 'Page label', value: 'Inside the Sketchbook', multiline: false, sort_order: 10 },
    { key: 'experience.header.title', page: 'experience', label: 'Page title', value: 'The 2D Experience', multiline: false, sort_order: 20 },
    { key: 'experience.header.body', page: 'experience', label: 'Page description', value: "Every wall, chair, and detail is designed to make you feel like you've stepped inside a drawing", multiline: true, sort_order: 30 },
    { key: 'visit.header.label', page: 'visit', label: 'Page label', value: 'Find Us', multiline: false, sort_order: 10 },
    { key: 'visit.header.title', page: 'visit', label: 'Page title', value: 'Plan Your Visit', multiline: false, sort_order: 20 },
    { key: 'visit.header.body', page: 'visit', label: 'Page description', value: "We're waiting with a warm bowl and a sketchbook backdrop", multiline: true, sort_order: 30 },
    { key: 'visit.amenities.title', page: 'visit', label: 'Amenities title', value: 'Amenities', multiline: false, sort_order: 40 },
    { key: 'visit.cta.title', page: 'visit', label: 'CTA title', value: 'Ready to Step Into the Sketch?', multiline: false, sort_order: 50 },
    { key: 'visit.cta.body', page: 'visit', label: 'CTA description', value: 'Reservations recommended during peak hours', multiline: false, sort_order: 60 },
    { key: 'global.cta.explore_menu', page: 'global', label: 'Hero button', value: 'Explore Menu', multiline: false, sort_order: 10 },
    { key: 'global.cta.view_menu', page: 'global', label: 'View full menu button', value: 'View Full Menu', multiline: false, sort_order: 20 },
    { key: 'global.cta.see_gallery', page: 'global', label: 'See gallery button', value: 'See Full Gallery', multiline: false, sort_order: 30 },
    { key: 'global.cta.reserve', page: 'global', label: 'WhatsApp button', value: 'Reserve on WhatsApp', multiline: false, sort_order: 40 },
    { key: 'global.cta.plan_visit', page: 'global', label: 'Plan visit button', value: 'Plan Your Visit', multiline: false, sort_order: 50 },
    { key: 'global.cta.call', page: 'global', label: 'Call button', value: 'Call Us', multiline: false, sort_order: 60 },
  ],
  categories: menuData.map((category, categoryIndex) => ({
    slug: category.slug,
    name: category.category,
    filter_label:
      {
        appetizers: 'Appetizers',
        mains: 'Mains',
        hot: 'Hot Drinks',
        cold: 'Cold Drinks',
        boba: 'Boba',
      }[category.slug] ?? category.category,
    icon: category.icon,
    image_url: `/${category.image}`,
    is_compact: Boolean(category.compact),
    sort_order: (categoryIndex + 1) * 10,
    is_published: true,
    items: category.items.map((item, itemIndex) => ({
      name: item.name,
      description: item.description ?? null,
      is_new: Boolean(item.isNew),
      sort_order: (itemIndex + 1) * 10,
      is_published: true,
      variants: item.variants.map((variant, variantIndex) => ({
        label: variant.type,
        price: variant.price,
        sort_order: (variantIndex + 1) * 10,
      })),
    })),
  })),
  addOns: globalAddOns.map((addOn, index) => ({
    name: addOn.name,
    price: addOn.price,
    sort_order: (index + 1) * 10,
    is_published: true,
  })),
  menuGallery: menuImages.map((image, index) => ({
    image_url: `/${image.image}`,
    label: image.label,
    sort_order: (index + 1) * 10,
    is_published: true,
  })),
  highlights: highlights.map((item, index) => ({
    image_url: `/${item.image}`,
    badge: item.badge,
    category: item.category,
    title: item.title,
    description: item.desc,
    price_label: item.price,
    sort_order: (index + 1) * 10,
    is_published: true,
  })),
  experiencePhotos: [
    { image_url: '/assets/Infrastructure/Screenshot_20260619_144836.jpg', title: 'The Grand Hall', description: 'Monochrome interiors with hand-drawn wall art and reflective glass tables', is_featured_home: false, home_title: null, home_description: null, home_sort_order: 0, sort_order: 10, is_published: true },
    { image_url: '/assets/Infrastructure/Screenshot_20260619_144847.jpg', title: 'Garden Seating', description: 'Outdoor charm with 2D sketch panels, fairy lights, and floral accents', is_featured_home: true, home_title: 'Garden Seating', home_description: 'Outdoor charm under the stars', home_sort_order: 30, sort_order: 20, is_published: true },
    { image_url: '/assets/Infrastructure/Screenshot_20260619_144933.jpg', title: 'The Chandelier Room', description: 'Ornate ceiling details, soft lighting, and storybook ambiance', is_featured_home: true, home_title: 'The Chandelier Room', home_description: 'Storybook lighting and ornate ceilings', home_sort_order: 10, sort_order: 30, is_published: true },
    { image_url: '/assets/Infrastructure/Screenshot_20260619_145008.jpg', title: 'Hand-Drawn Details', description: 'Every surface is a canvas — windows, doors, and decor in ink', is_featured_home: true, home_title: 'Hand-Drawn Details', home_description: 'Windows, doors, and decor in ink', home_sort_order: 20, sort_order: 40, is_published: true },
    { image_url: '/assets/Infrastructure/Screenshot_20260619_145024.jpg', title: 'Welcome In', description: 'The bubble-letter sign that started it all — your portal to the 2D world', is_featured_home: false, home_title: null, home_description: null, home_sort_order: 0, sort_order: 50, is_published: true },
  ],
  amenities: [
    { name: 'Dog Friendly', icon_url: '/assets/Features/dog_friendly.png', show_on_home: true, home_sort_order: 20, sort_order: 10, is_published: true },
    { name: 'Instagrammable', icon_url: '/assets/Features/instagrammable.png', show_on_home: true, home_sort_order: 10, sort_order: 20, is_published: true },
    { name: 'Vegan Options', icon_url: '/assets/Features/vegan_options.png', show_on_home: true, home_sort_order: 30, sort_order: 30, is_published: true },
    { name: 'Halal Food', icon_url: '/assets/Features/halal_food.png', show_on_home: true, home_sort_order: 40, sort_order: 40, is_published: true },
    { name: 'Free Parking', icon_url: '/assets/Features/free_parking.png', show_on_home: false, home_sort_order: 0, sort_order: 50, is_published: true },
    { name: 'Paid Wi-Fi', icon_url: '/assets/Features/paid_wifi.png', show_on_home: false, home_sort_order: 0, sort_order: 60, is_published: true },
  ],
};

writeFileSync(join(root, 'data/content.json'), `${JSON.stringify(content, null, 2)}\n`);
console.log(
  `Wrote data/content.json: ${content.categories.length} categories, ` +
    `${content.categories.reduce((total, category) => total + category.items.length, 0)} items, ` +
    `${content.highlights.length} highlights, ${content.experiencePhotos.length} photos, ` +
    `${content.amenities.length} amenities.`
);
