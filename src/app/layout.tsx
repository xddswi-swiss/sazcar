import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
  openGraph: {
    title: 'SAZCAR GMBH | Autogarage & Carrosserie Schöfflisdorf • Tel: 043 422 86 76',
    description: 'Spezialist für Hagelschaden-Reparatur (Drücktechnik), Karosserie, Lackierung & Autoservice in Schöfflisdorf. 100% Direktabrechnung mit Kaskoversicherungen. Tel: 043 422 86 76',
    url: 'https://sazcar.ch',
    siteName: 'SAZCAR GMBH',
    images: [
      {
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
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
      <head>
        {/* Reload was reopening at whatever scroll position the browser last saved (its default
            "auto" restoration), landing users mid-page instead of the top. Opt out early so a
            plain reload starts at (0,0); #hash links still scroll to their target normally. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
