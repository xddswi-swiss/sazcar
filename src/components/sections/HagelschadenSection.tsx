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
      className="relative w-full overflow-hidden bg-slate-900 text-white"
      style={{
        padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      {/* Background Glows & Accent Watermark */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4.5rem)' }}>
          <div className="inline-flex items-center gap-2 bg-red-950/80 border border-red-800 text-red-400 font-bold uppercase tracking-widest rounded-full px-4 py-1.5 text-xs mb-4">
            <CloudRain className="w-4 h-4 text-red-500 animate-bounce" />
            Hagelschaden-Zentrum • Region Schöfflisdorf
          </div>
          <h2
            className="font-black tracking-tight text-white leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3.25rem)',
            }}
          >
            Spezialisierte Hagelschaden-Reparatur & Verfahren
          </h2>
          <p
            className="text-slate-300 max-w-3xl mt-4 leading-relaxed font-medium"
            style={{
              fontSize: 'clamp(0.9375rem, 0.88rem + 0.3vw, 1.125rem)',
            }}
          >
            Als langjähriger Carrosserie- & Spenglerfachbetrieb beherrschen wir sämtliche sanften und konventionellen Reparaturmethoden. Wir stellen Ihr Fahrzeug spurlos und werterhaltend wieder her.
          </p>
        </div>

        {/* Grid of 6 Detailed Technique Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map((tech, idx) => {
            const IconComponent = tech.icon;
            return (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 hover:border-red-500/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-3 bg-red-600/20 text-red-400 rounded-2xl border border-red-500/30 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
                      {tech.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      {tech.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                      {tech.description}
                    </p>
                  </div>

                  <ul className="space-y-2 border-t border-slate-700/60 pt-4 text-xs sm:text-sm text-slate-300">
                    {tech.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs font-bold text-red-400">
                  <span>{tech.highlight}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Process Step-by-Step Section */}
        <div className="mt-16 sm:mt-20 bg-slate-800/50 border border-slate-700/80 rounded-3xl p-6 sm:p-10">
          <div className="text-left mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">
              Einfach & Transparent
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Der Ablauf bei Ihrem Hagelschaden
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="bg-slate-900/80 border border-slate-700/60 p-5 rounded-2xl relative space-y-2"
              >
                <span className="text-3xl font-black text-red-600/80 block">
                  {item.step}
                </span>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
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
