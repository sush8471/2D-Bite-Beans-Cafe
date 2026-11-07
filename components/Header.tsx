'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type HeaderProps = {
  brandName: string;
  logoUrl: string;
};

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/experience', label: 'Experience' },
  { href: '/visit', label: 'Visit Us' },
];

export default function Header({ brandName, logoUrl }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;

    function update() {
      setScrolled(pathname !== '/' || window.scrollY > 40);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        open &&
        !navRef.current?.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [open]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header
      className={`top-nav${scrolled ? ' top-nav--scrolled' : ''}`}
      role="banner"
    >
      <div className="top-nav__inner">
        <Link href="/" className="top-nav__logo" aria-label={`${brandName} home`}>
          {logoUrl ? <img src={logoUrl} alt={`${brandName} logo`} loading="eager" /> : null}
        </Link>

        <button
          ref={toggleRef}
          className={`menu-toggle${open ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="top-nav-links"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
          <span className="menu-toggle__bar" />
        </button>

        <nav
          ref={navRef}
          className={`top-nav__links${open ? ' open' : ''}`}
          id="top-nav-links"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive(link.href) ? ' active' : ''}`}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
