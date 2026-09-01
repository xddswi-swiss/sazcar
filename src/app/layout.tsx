import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ScrollToTopCar from '@/components/ui/ScrollToTopCar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SAZCAR GMBH | Autogarage & Carrosserie Schöfflisdorf • Tel: 043 422 86 76',
  description: 'Ihr Spezialist für Hagelschaden-Reparatur (Drücktechnik), Karosseriearbeiten, Autolackierung, Glasschaden & Autoservice in Schöfflisdorf. 100% Kaskoservice. Tel: 043 422 86 76',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sazcar.ch'),
  alternates: {
    canonical: 'https://sazcar.ch',
  },
  openGraph: {
    title: 'SAZCAR GMBH | Autogarage & Carrosserie Schöfflisdorf • Tel: 043 422 86 76',
    description: 'Spezialist für Hagelschaden-Reparatur (Drücktechnik), Karosserie, Lackierung & Autoservice in Schöfflisdorf. 100% Direktabrechnung mit Kaskoversicherungen. Tel: 043 422 86 76',
    url: 'https://sazcar.ch',
    siteName: 'SAZCAR GMBH',
    images: [
      {
        url: 'https://sazcar.ch/og-image.jpg',
        secureUrl: 'https://sazcar.ch/og-image.jpg',
        type: 'image/jpeg',
        width: 1200,
        height: 630,
        alt: 'SAZCAR GMBH Autogarage & Carrosserie Schöfflisdorf Tel 043 422 86 76',
      },
      {
        url: 'https://sazcar.ch/og-image.png',
        secureUrl: 'https://sazcar.ch/og-image.png',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'SAZCAR GMBH Autogarage & Carrosserie Schöfflisdorf Tel 043 422 86 76',
      },
    ],
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAZCAR GMBH | Autogarage & Carrosserie Schöfflisdorf • Tel: 043 422 86 76',
    description: 'Spezialist für Hagelschaden-Reparatur, Karosserie, Lackierung & Autoservice in Schöfflisdorf. Tel: 043 422 86 76',
    images: ['https://sazcar.ch/og-image.jpg'],
  },
};

// White status bar (time/battery/wifi area) on iOS Safari instead of the default gray.
// theme-color alone isn't enough — without viewport-fit=cover, Safari has no page
// content extending under the status bar/notch to sample the color from.
export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: browser extensions (Bitdefender, ColorZilla, Grammarly…)
    // stamp attributes onto <html>/<body> before React hydrates. Our own markup matches.
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <ScrollToTopCar />
      </body>
    </html>
  );
}
