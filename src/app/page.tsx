import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import BeforeAfter from '@/components/sections/BeforeAfter';
import CarsShowcase from '@/components/sections/CarsShowcase';
import AppointmentForm from '@/components/sections/AppointmentForm';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    'name': 'SAZCAR GMBH',
    'image': 'https://autogarage.ch/logo.png',
    'url': 'https://autogarage.ch',
    'telephone': '+41434228676',
    'email': 'sazcargmbh@gmail.com',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Unterdorfstrasse 14',
      'addressLocality': 'Schöfflisdorf',
      'postalCode': '8165',
      'addressRegion': 'ZH',
      'addressCountry': 'CH',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 47.483,
      'longitude': 8.417,
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '07:30',
        'closes': '12:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '13:15',
        'closes': '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday'],
        'opens': '09:00',
        'closes': '14:00',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* JSON-LD Schema for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation Header */}
      <Header />

      {/* Main sections */}
      <main className="flex-1 flex flex-col">
        <Hero />
        <Services />
        <BeforeAfter />
        <CarsShowcase />
        <AppointmentForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
