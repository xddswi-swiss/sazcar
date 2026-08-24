import type { Metadata } from 'next';
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
  title: 'Autogarage & Carrosserie | Ihr Partner in der Schweiz',
  description: 'Professionelle Karosseriearbeiten, Fahrzeuglackierung, Autoservice und MFK-Vorbereitung für alle Marken. Jetzt Termin online buchen.',
  metadataBase: new URL('https://autogarage.ch'),
  openGraph: {
    title: 'Autogarage & Carrosserie | Ihr Partner in der Schweiz',
    description: 'Professionelle Karosseriearbeiten, Fahrzeuglackierung, Autoservice und MFK-Vorbereitung für alle Marken.',
    locale: 'de_CH',
    type: 'website',
  },
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
      </body>
    </html>
  );
}
