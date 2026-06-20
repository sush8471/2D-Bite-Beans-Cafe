// filters.js

/* =========================================================
   Bite & Beans — Menu Filters
   Animate menu cards between All / Drinks / Food
   ========================================================= */

(function () {
  'use strict';

  function filterItems(filter) {
    const cards = document.querySelectorAll('.menu-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      const type = card.getAttribute('data-type');
      const match = filter === 'all' || type === filter;

      if (match) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });
  }

  function bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-bar__btn');
      if (!btn) return;

      const filter = btn.getAttribute('data-filter');
      const bar = btn.closest('.filter-bar');

      bar.querySelectorAll('.filter-bar__btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      filterItems(filter);
    });
  }

  window.initFilters = function () {
    const activeBtn = document.querySelector('.filter-bar__btn.active');
    if (activeBtn) {
      filterItems(activeBtn.getAttribute('data-filter'));
    }
  };

  bindEvents();
})();
