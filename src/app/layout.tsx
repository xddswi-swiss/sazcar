import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ZoomBlocker } from "@/components/ZoomBlocker";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SazCar Garage | Karosserie, Malerei & Autoservice in Zürich",
  description: "Professionelle Autoreparatur, Spenglerarbeiten, Lackierung, Reifenservice und MFK-Vorbereitung bei SazCar Garage in Zürich.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth overflow-x-clip w-full max-w-full`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#0d0e12] dark:text-[#f1f5f9] transition-colors duration-300 overflow-x-clip w-full max-w-full"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ThemeProvider>
            <ZoomBlocker />
            <ScrollToTop />
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}


