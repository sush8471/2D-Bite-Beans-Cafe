'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/menu', label: 'Menu', exact: false },
  { href: '/admin/highlights', label: 'Highlights', exact: false },
  { href: '/admin/gallery', label: 'Menu images', exact: false },
  { href: '/admin/experience', label: 'Experience', exact: false },
  { href: '/admin/amenities', label: 'Amenities', exact: false },
  { href: '/admin/addons', label: 'Add-ons', exact: false },
  { href: '/admin/copy', label: 'Page copy', exact: false },
  { href: '/admin/settings', label: 'Site settings', exact: false },
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
