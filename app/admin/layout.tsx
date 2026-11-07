import type { Metadata } from 'next';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: {
    default: 'Content studio',
    template: '%s | Bite & Beans admin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
