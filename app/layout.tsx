import type { Metadata, Viewport } from 'next';
import '@/styles/base.css';
import '@/styles/components.css';
import '@/styles/pages.css';
import '@/styles/animations.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bite & Beans — 2D Cafe House | Guwahati',
  description:
    "Bite & Beans 2D Cafe House — Guwahati's first 2D-themed cafe. Step into a sketchbook of Korean & Japanese comfort food, boba, and specialty coffee.",
  icons: {
    icon: '/assets/Logo/Gemini_Generated_Image_pejfj1pejfj1pejf.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B2635',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{'.reveal{opacity:1 !important;transform:none !important;}'}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
