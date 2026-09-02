'use client';

import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation, Car } from 'lucide-react';

const GOOGLE_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=SAZCAR+GMBH,+Unterdorfstrasse+14,+8165+Sch%C3%B6fflisdorf';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="kontakt"
      className="bg-red-600 text-white border-t border-red-700"
      style={{
        paddingTop: 'clamp(3rem, 2rem + 3vw, 5rem)',
        paddingBottom: 'clamp(1.5rem, 1rem + 1vw, 2.5rem)',
        paddingInline: 'clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      <div className="mx-auto space-y-10" style={{ maxWidth: '1200px' }}>
        {/* Main Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{
            gap: 'clamp(2rem, 1.5rem + 1vw, 3.5rem)',
          }}
        >
          {/* Column 1: Info & Brand */}
          <div className="space-y-2 flex flex-col justify-start items-start">
            <Logo variant="inverted" />
            <div className="pt-1 space-y-1.5 text-red-200 text-xs font-normal">
              <p>© {currentYear} SAZCAR GMBH. Alle Rechte vorbehalten.</p>
              <div className="flex gap-4">
                <Link href="/impressum" className="text-red-200 hover:text-white transition-colors underline-offset-4 hover:underline">Impressum</Link>
                <Link href="/datenschutz" className="text-red-200 hover:text-white transition-colors underline-offset-4 hover:underline">Datenschutz</Link>
              </div>
            </div>
          </div>

          {/* Column 2: Contact & Opening Hours */}
          <div className="space-y-4">
            <h3
              className="font-normal text-white tracking-tight"
              style={{
                fontSize: 'clamp(0.9375rem, 0.9rem + 0.15vw, 1.0625rem)',
              }}
            >
              Kontakt & Öffnungszeiten
            </h3>
            
            <ul
              className="space-y-3 text-red-100"
              style={{
                fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)',
              }}
            >
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>SAZCAR GMBH<br />Unterdorfstrasse 14<br />8165 Schöfflisdorf ZH</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href="tel:+41434228676" className="text-white hover:text-red-200 transition-colors font-normal">
                  043 422 86 76
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-white shrink-0" />
                <a
                  href="https://wa.me/41764717981"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-200 transition-colors font-normal"
                >
                  +41 76 471 79 81
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a href="mailto:sazcargmbh@gmail.com" className="text-white hover:text-red-200 transition-colors font-normal">
                  sazcargmbh@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 border-t border-red-500/50 pt-3 mt-3">
                <Clock className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="block font-normal text-white">Öffnungszeiten:</span>
                  <span className="block mt-0.5 text-red-100">Montag – Freitag: 07:30 – 12:00, 13:15 – 18:00 Uhr</span>
                  <span className="block mt-1 text-red-100">Samstag: 09:00 – 14:00 Uhr</span>
                  <span className="block text-red-100">Sonntag: Geschlossen</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Location / Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3
                className="font-normal text-white tracking-tight"
                style={{
                  fontSize: 'clamp(0.9375rem, 0.9rem + 0.15vw, 1.0625rem)',
                }}
              >
                Standort
              </h3>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-red-100 hover:text-white transition-colors font-normal shrink-0"
                style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
              >
                <Navigation className="w-3.5 h-3.5" />
                Route berechnen
              </a>
            </div>

            {/* Map container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-red-500/50 bg-red-700/50">
              <iframe
                src="https://www.google.com/maps?q=SAZCAR+GMBH,+Unterdorfstrasse+14,+8165+Sch%C3%B6fflisdorf&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps Standort"
              />
              {/* Decorative looping car driving across the top edge of the map */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2 z-10">
                <Car className="map-car-drive w-5 h-5 text-red-600 drop-shadow" strokeWidth={2.25} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
