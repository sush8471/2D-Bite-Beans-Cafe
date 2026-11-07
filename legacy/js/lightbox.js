// lightbox.js

/* =========================================================
   Bite & Beans — Lightbox
   Fullscreen image viewer for the menu gallery
   ========================================================= */

(function () {
  'use strict';

  let currentIndex = 0;
  let items = [];

  const lightbox = document.getElementById('lightbox');
  const lbImage = lightbox.querySelector('.lightbox__image');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__arrow--prev');
  const nextBtn = lightbox.querySelector('.lightbox__arrow--next');

  function getItems() {
    // Only collect cards that are currently visible (not filtered out)
    return Array.from(document.querySelectorAll('.menu-card'))
      .filter((card) => card.style.display !== 'none')
      .map((card) => {
        const img = card.querySelector('img');
        const tag = card.querySelector('.menu-card__tag');
        return {
          src: img ? img.src : '',
          alt: img ? img.alt : '',
          category: tag ? tag.textContent : '',
          dataIndex: parseInt(card.getAttribute('data-index'), 10),
        };
      });
  }

  function open(rawDataIndex) {
    items = getItems();
    if (!items.length) return;

    // Map the card's data-index to its position within the visible set
    const positionInVisible = items.findIndex((item) => item.dataIndex === rawDataIndex);
    currentIndex = positionInVisible !== -1 ? positionInVisible : 0;
    updateImage(false);

    lightbox.hidden = false;
    // Force reflow
    void lightbox.offsetWidth;
    lightbox.classList.add('lightbox--visible');
    document.body.style.overflow = 'hidden';

    // Focus management
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('lightbox--visible');
    setTimeout(() => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }, 300);
  }

  function updateImage(animate = true) {
    const item = items[currentIndex];
    if (!item) return;

    if (animate) {
      lbImage.style.opacity = '0';
      lbImage.style.transform = 'scale(0.98)';
      setTimeout(() => {
        lbImage.src = item.src;
        lbImage.alt = item.alt;
        lbCaption.textContent = `${item.category} (${currentIndex + 1}/${items.length})`;
        lbImage.style.opacity = '1';
        lbImage.style.transform = 'scale(1)';
      }, 150);
    } else {
      lbImage.src = item.src;
      lbImage.alt = item.alt;
      lbCaption.textContent = `${item.category} (${currentIndex + 1}/${items.length})`;
      lbImage.style.opacity = '1';
      lbImage.style.transform = 'scale(1)';
    }
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    updateImage();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateImage();
  }

  // Touch/swipe handling
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }

  // Event delegation for menu cards
  function bindEvents() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.menu-card');
      if (!card) return;

      const index = parseInt(card.getAttribute('data-index'), 10);
      if (!isNaN(index)) open(index);
    });

    document.addEventListener('keydown', (e) => {
      const card = e.target.closest('.menu-card');
      if (card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        const index = parseInt(card.getAttribute('data-index'), 10);
        if (!isNaN(index)) open(index);
      }
    });

    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  window.initLightbox = function () {
    // Reset state when page re-renders
    items = getItems();
  };

  bindEvents();
})();
