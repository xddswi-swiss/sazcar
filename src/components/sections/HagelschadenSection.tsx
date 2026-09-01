'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Wrench,
  ShieldCheck,
  Sparkles,
  Car,
  CloudRain,
  PhoneCall,
  CheckCircle2,
  Layers,
  Zap,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { PROMO_CTA_EVENT } from './PromoBadge';

const HAGEL_SERVICE_NAME = 'Hagelschaden & Unwetterschaden';

const techniques = [
  {
    id: 'druecktechnik',
    icon: Wrench,
    badge: 'Standard & Werterhaltend',
    title: '1. PDR-Drücktechnik (Paintless Dent Repair)',
    description:
      'Sanftes Herausmassieren von Dellen von der Blechrückseite mit hochpräzisen Spezialhebeln.',
    details: [
      'Originallack bleibt zu 100% erhalten (Kein Nachlackieren)',
      'Kein Wertverlust Ihres Fahrzeugs',
      'Umweltfreundlich, schnell und kostengünstig',
      'Ideal für Motorhaube, Dach, Kofferraumdeckel & Türen',
    ],
    highlight: 'Höchste Präzision ohne Lackschaden',
  },
  {
    id: 'ziehtechnik',
    icon: Layers,
    badge: 'Zugänglichkeit & Präzision',
    title: '2. Klebe- & Ziehtechnik',
    description:
      'Für schwer zugängliche Blechbereiche wie Dachholme, A/B/C-Säulen und geschlossene Doppelbleche.',
    details: [
      'Spezial-Klebepads werden von aussen auf die Delle fixiert',
      'Kontrolliertes Ziehen mit Zugadaptern & Schlaghämmern',
      'Demontage von Innenverkleidungen wird auf ein Minimum reduziert',
      'Perfekte Lösung bei Hohlräumen ohne Zugang von hinten',
    ],
    highlight: 'Keine aufwendige Demontage nötig',
  },
  {
    id: 'induktion',
    icon: Zap,
    badge: 'Thermische Korrektur',
    title: '3. Induktions- & Hitzetechnik (T-Hotbox)',
    description:
      'Gezielter thermischer Spannungsausgleich bei tiefen Einschlägen mit stark gedehntem Blech.',
    details: [
      'Mikroskopische Gefügeentspannung der Blechstruktur',
      'Rückverformung überdehnter Dellenpunkte',
      'Kombinierbar mit Drück- und Ziehtechnik',
      'Verhindert "Frosch"-Effekt (labiles Blech)',
    ],
    highlight: 'Spannungsfreies Blech nach tiefen Einschlägen',
  },
  {
    id: 'autoglas',
    icon: Sparkles,
    badge: 'Sicherheit & Sicht',
    title: '4. Scheibenaustausch & ADAS-Kamerakalibrierung',
    description:
      'Austausch durch Hagelkörner zersprungener Scheiben inklusive Hersteller-Kalibrierung der Kameras.',
    details: [
      'Ersatz von Front-, Heck- und Seitenscheiben in Erstausrüsterqualität',
      'Steinschlag-Harzreparatur bei kleineren Rissen',
      'Offizielle ADAS-Sensorkalibrierung (Spurhalteassistent, Notbremse)',
      'Schweizer Qualität nach Herstellervorgaben',
    ],
    highlight: 'Volle Funktion aller Assistenzsysteme',
  },
  {
    id: 'spengler',
    icon: Car,
    badge: 'Kollisions-Instandsetzung',
    title: '5. Konventionelle Spenglerarbeit & Lackierung',
    description:
      'Bei gerissenem Lack oder schweren Strukturschäden bringen wir die Karosserie wieder in Neuzustand.',
    details: [
      'Ausbeulen auf der Richtbank & Ersetzen beschädigter Teile',
      'Digitale Farbtonmessung für 100% exakten Farbabgleich',
      'Umweltfreundliche Wasserbasislacke mit Klarlackversiegelung',
      'Vollgarantie auf alle Spengler- und Lackierarbeiten',
    ],
    highlight: 'Nahtlose Wiederherstellung wie neu',
  },
  {
    id: 'versicherung',
    icon: ShieldCheck,
    badge: '100% Sorgenfrei',
    title: '6. Direkte Schadenabwicklung mit der Kaskoversicherung',
    description:
      'Hagelschäden sind Elementarschäden – wir regeln den gesamten Papierkram direkt mit Ihrer Versicherung.',
    details: [
      'Gedeckt durch Schweizer Teilkaskoversicherung (oder Vollkasko)',
      'Kein Bonusverlust (Kein Stufenverlust im Prämiensystem)',
      'Unterstützung bei Expertenbegutachtungen & Hagel-Drive-Ins',
      'Direktverrechnung mit AXA, Mobiliar, Zurich, Allianz, Helvetia & allen weiteren',
    ],
    highlight: 'Sie zahlen nur den vereinbarten Selbstbehalt',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Schadensmeldung',
    text: 'Melden Sie Ihren Hagelschaden bequem online oder rufen Sie uns direkt an unter 043 422 86 76.',
  },
  {
    step: '02',
    title: 'Expertise & Freigabe',
    text: 'Wir prüfen das Fahrzeug, erstellen die Kostenschätzung und holen die Deckungszusage Ihrer Versicherung ein.',
  },
  {
    step: '03',
    title: 'Sanfte Reparatur',
    text: 'Zertifizierte Drücktechnik-Spezialisten entfernen jede Delle werterhaltend & schonend.',
  },
  {
    step: '04',
    title: 'Übergabe & Mobilität',
    text: 'Sie übernehmen Ihr perfekt repariertes Auto. Auf Wunsch stellen wir währenddessen einen Gratis-Ersatzwagen.',
  },
];

export default function HagelschadenSection() {
  const handleBooking = () => {
    window.dispatchEvent(
      new CustomEvent(PROMO_CTA_EVENT, { detail: { service: HAGEL_SERVICE_NAME } })
    );
    const element = document.getElementById('termin');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hagelschaden"
      className="relative w-full overflow-hidden bg-slate-50 text-slate-800"
      style={{
        padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      {/* Background Sketch Illustration (Watermark style, multiplied to blend with slate-50) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.25] sm:opacity-[0.35] md:opacity-[0.45] mix-blend-multiply"
        aria-hidden="true"
      >
        <Image
          src="/services-bg.jpg"
          alt="Services Sketch Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4.5rem)' }}>
          <span
            className="inline-block bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest rounded-full"
            style={{
              fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)',
              padding: '0.375rem 1rem',
              marginBottom: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)',
            }}
          >
            Hagelschaden-Zentrum • Region Schöfflisdorf
          </span>
          <h2
            className="font-black tracking-tight text-slate-900 leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3.25rem)',
            }}
          >
            Spezialisierte Hagelschaden-Reparatur & Verfahren
          </h2>
          <p
            className="text-slate-600 max-w-3xl mt-4 leading-relaxed font-medium"
            style={{
              fontSize: 'clamp(0.9375rem, 0.88rem + 0.3vw, 1.125rem)',
            }}
          >
            Als langjähriger Carrosserie- & Spenglerfachbetrieb beherrschen wir sämtliche sanften und konventionellen Reparaturmethoden. Wir stellen Ihr Fahrzeug spurlos und werterhaltend wieder her.
          </p>
        </div>

        {/* Grid of 6 Detailed Technique Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(1rem, 0.75rem + 0.625vw, 1.5rem)' }}
        >
          {techniques.map((tech, idx) => {
            const IconComponent = tech.icon;
            const isBigCard = idx === 0 || idx === 3 || idx === 5;
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
                className={`
                  group relative border rounded-3xl overflow-hidden
                  transition-all duration-300 shadow-sm hover:shadow-md
                  flex flex-col justify-between
                  ${isBigCard ? 'card-tint-red' : 'bg-white/45 border-slate-300 hover:border-red-400 hover:bg-white'}
                `}
                style={{
                  padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2.25rem)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl w-fit shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 border border-red-100">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className="inline-block bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest rounded-full"
                      style={{
                        fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)',
                        padding: '0.25rem 0.75rem',
                      }}
                    >
                      {tech.badge}
                    </span>
                  </div>

                  <div>
                    <h3
                      className="font-bold text-slate-900 tracking-tight group-hover:text-red-600 transition-colors"
                      style={{
                        fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.25rem)',
                      }}
                    >
                      {tech.title}
                    </h3>
                    <p
                      className="text-slate-600 mt-2"
                      style={{
                        fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)',
                        lineHeight: 1.6,
                      }}
                    >
                      {tech.description}
                    </p>
                  </div>

                  <ul
                    className="grid gap-x-4 gap-y-2.5 border-t border-slate-100 pt-5 grid-cols-1"
                    style={{
                      marginTop: 'clamp(1.25rem, 1rem + 0.5vw, 1.75rem)',
                    }}
                  >
                    {tech.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-slate-700 font-medium"
                        style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                  <span>{tech.highlight}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Step-by-Step Section */}
        <div
          className="mt-16 sm:mt-20 group relative border rounded-3xl overflow-hidden bg-white/45 border-slate-300 shadow-sm"
          style={{
            padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2.5rem)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div className="text-left mb-8">
            <span
              className="inline-block bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest rounded-full mb-2"
              style={{
                fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)',
                padding: '0.375rem 1rem',
              }}
            >
              Einfach & Transparent
            </span>
            <h3
              className="font-black text-slate-900 tracking-tight"
              style={{
                fontSize: 'clamp(1.25rem, 1.1rem + 0.5vw, 1.75rem)',
              }}
            >
              Der Ablauf bei Ihrem Hagelschaden
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200/80 p-5 rounded-2xl relative space-y-2 shadow-2xs"
              >
                <span className="text-2xl font-black text-red-600 block">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p
                  className="text-slate-600 leading-relaxed"
                  style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Hagelschaden jetzt melden & Wunschtermin sichern!
            </h3>
            <p className="text-xs sm:text-sm text-red-100 font-medium">
              Wir kümmern uns um die Versicherung, die Reparatur und Ihre Mobilität.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:+41434228676"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-900 font-black rounded-2xl text-sm sm:text-base hover:bg-slate-100 transition-all shadow-md"
            >
              <PhoneCall className="w-5 h-5 text-red-600" />
              <span>043 422 86 76</span>
            </a>

            <button
              onClick={handleBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl text-sm sm:text-base hover:bg-slate-950 transition-all shadow-md cursor-pointer group"
            >
              <span>Termin buchen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
