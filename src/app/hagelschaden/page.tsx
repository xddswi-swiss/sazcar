import Header from '@/components/layout/Header';
import HagelschadenSection from '@/components/sections/HagelschadenSection';
import AppointmentForm from '@/components/sections/AppointmentForm';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hagelschaden-Zentrum & Drücktechnik | SAZCAR GMBH Schöfflisdorf',
  description: 'Spezialisierte Hagelschaden-Reparatur in der Region Schöfflisdorf. Sanfte PDR-Drücktechnik ohne Lackieren, Scheibenaustausch mit ADAS-Kalibrierung & 100% Kaskoservice.',
  openGraph: {
    title: 'Hagelschaden-Zentrum & Drücktechnik | SAZCAR GMBH',
    description: 'Sanfte Dellenbehebung (Drücktechnik), Ziehtechnik, Scheibenaustausch & 100% Direktabrechnung mit allen Kaskoversicherungen in Schöfflisdorf.',
    url: 'https://sazcar.ch/hagelschaden',
    images: ['/og-image.jpg'],
  },
};

export default function HagelschadenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 sm:pt-20">
        <HagelschadenSection />
        <AppointmentForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
