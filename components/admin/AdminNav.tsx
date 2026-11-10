'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/menu', label: 'Menu', exact: false },
  { href: '/admin/highlights', label: 'Highlights', exact: false },
  { href: '/admin/photos', label: 'Photos', exact: false },
  { href: '/admin/settings', label: 'Settings', exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin sections">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link key={link.href} href={link.href} className={active ? 'active' : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
