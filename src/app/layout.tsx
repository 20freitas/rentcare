import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import IOSInstallPrompt from '@/components/IOSInstallPrompt';

const inter = Inter({ subsets: ['latin'] });

// Viewport configuration for PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#7aa9ca',
};

export const metadata: Metadata = {
  title: 'RentCare | Gestão de Imóveis',
  description: 'Nunca mais se esqueça de uma renda. Gestão de imóveis, inquilinos e contratos num só sítio.',
  manifest: '/manifest.json',
  // Apple PWA meta tags
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RentCare',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        {/* Additional Apple PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RentCare" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Splash screens for different iPhone sizes */}
        <link rel="apple-touch-startup-image" href="/splash/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1284x2778.png" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        {/* iOS Add to Home Screen prompt */}
        <IOSInstallPrompt />
      </body>
    </html>
  );
}

