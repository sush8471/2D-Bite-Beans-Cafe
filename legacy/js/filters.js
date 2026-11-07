// filters.js

/* =========================================================
   Bite & Beans — Menu Filters
   Show/hide entire category sections by slug
   ========================================================= */

(function () {
  'use strict';

  function filterSections(filter) {
    const sections = document.querySelectorAll('.menu-section');
    if (!sections.length) return;

    sections.forEach((section) => {
      const slug = section.getAttribute('data-category');
      const match = filter === 'all' || slug === filter;

      if (match) {
        section.style.display = '';
        section.style.opacity = '0';
        
        // Auto expand if filtering to a single category; collapse by default on All
        if (filter !== 'all') {
          section.classList.add('expanded');
        } else {
          section.classList.remove('expanded');
        }

        requestAnimationFrame(() => {
          section.style.transition = 'opacity 0.35s ease';
          section.style.opacity = '1';
        });
      } else {
        section.style.transition = 'opacity 0.25s ease';
        section.style.opacity = '0';
        section.classList.remove('expanded');
        setTimeout(() => {
          section.style.display = 'none';
        }, 250);
      }
    });
  }

  function bindEvents() {
    document.addEventListener('click', (e) => {
      // 1. Filter button click
      const btn = e.target.closest('.filter-bar__btn');
      if (btn) {
        const filter = btn.getAttribute('data-filter');
        const bar = btn.closest('.filter-bar');

        bar.querySelectorAll('.filter-bar__btn').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        filterSections(filter);
        return;
      }

      // 2. Accordion banner click
      const banner = e.target.closest('.menu-section__banner');
      if (banner) {
        const section = banner.closest('.menu-section');
        if (section) {
          section.classList.toggle('expanded');
        }
      }
    });
  }

  window.initFilters = function () {
    const activeBtn = document.querySelector('.filter-bar__btn.active');
    if (activeBtn) {
      filterSections(activeBtn.getAttribute('data-filter'));
    }
  };

  bindEvents();
})();
