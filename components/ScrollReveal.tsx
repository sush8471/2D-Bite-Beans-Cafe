'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Adds .reveal--visible to .reveal elements as they enter the viewport.
 * Re-runs on client-side navigation so every page gets its animations.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (prefersReducedMotion) {
      elements.forEach((element) => element.classList.add('reveal--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((element) => {
      if (element.classList.contains('reveal--visible')) return;
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
