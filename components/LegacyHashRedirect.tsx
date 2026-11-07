'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const legacyRoutes: Record<string, string> = {
  '#home': '/',
  '#menu': '/menu',
  '#experience': '/experience',
  '#visit': '/visit',
};

/**
 * The pre-Next site used hash routes (#menu, #visit, …). Keep old bookmarks
 * working by forwarding them to the real routes.
 */
export default function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = legacyRoutes[window.location.hash.toLowerCase()];
    if (target && target !== window.location.pathname) {
      router.replace(target);
    }
  }, [router]);

  return null;
}
