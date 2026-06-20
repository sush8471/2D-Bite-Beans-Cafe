// scroll-reveal.js

/* =========================================================
   Bite & Beans — Scroll Reveal & Parallax
   Intersection Observer reveals + hero parallax
   ========================================================= */

(function () {
  'use strict';

  let revealObserver;

  function initRevealObserver() {
    if (revealObserver) revealObserver.disconnect();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('reveal--visible'));
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  }

  function initParallax() {
    // Parallax disabled to keep hero background perfectly stable
  }

  function initTopNavScroll() {
    const topNav = document.querySelector('.top-nav');
    if (!topNav) return;

    let ticking = false;

    function updateNav() {
      const page = window.location.hash.replace('#', '') || 'home';
      if (page !== 'home') {
        topNav.classList.add('top-nav--scrolled');
      } else if (window.scrollY > 40) {
        topNav.classList.add('top-nav--scrolled');
      } else {
        topNav.classList.remove('top-nav--scrolled');
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateNav);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateNav();
  }

  window.initScrollReveal = function () {
    initRevealObserver();
  };

  window.initParallax = function () {
    initParallax();
  };

  // Global initialisation on first load
  document.addEventListener('DOMContentLoaded', () => {
    initTopNavScroll();
  });
})();
