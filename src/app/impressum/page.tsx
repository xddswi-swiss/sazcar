import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Building2, Phone, ShieldCheck, FileText, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Impressum | Autogarage & Carrosserie',
  description: 'Impressum und rechtliche Angaben der SAZCAR GMBH.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1 pt-16 sm:pt-20 relative overflow-hidden">
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

        <section
          className="mx-auto relative z-10"
          style={{
            maxWidth: '1200px',
            padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
          }}
        >
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
              Rechtliches
            </span>
            <h1
              className="font-black tracking-tight text-slate-900"
              style={{
                fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)',
              }}
            >
              Impressum
            </h1>
            <p
              className="text-slate-600"
              style={{
                fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)',
                maxWidth: '560px',
                marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)',
                lineHeight: 1.6,
              }}
            >
              Rechtliche Informationen und Kontaktangaben der SAZCAR GMBH.
            </p>
          </div>

          {/* Main Card Container */}
          <div
            className="group relative border rounded-3xl overflow-hidden transition-all duration-300 shadow-sm bg-white/55 border-slate-300 backdrop-blur-xl p-6 sm:p-10 space-y-8"
          >
            {/* Section 1: Firmendaten */}
            <div className="space-y-2 border-b border-slate-200/80 pb-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Angaben gemäss Art. 3 UWG</span>
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
                <strong className="text-slate-900 font-bold">SAZCAR GMBH</strong><br />
                Unterdorfstrasse 14<br />
                8165 Schöfflisdorf ZH<br />
                Schweiz
              </p>
            </div>

            {/* Section 2: Kontakt */}
            <div className="space-y-2 border-b border-slate-200/80 pb-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                <span>Kontakt</span>
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base space-y-1">
                <span>Telefon: <a href="tel:+41434228676" className="text-red-600 font-bold hover:underline">043 422 86 76</a></span><br />
                <span>WhatsApp: <a href="https://wa.me/41764717981" target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:underline">+41 76 471 79 81</a></span><br />
                <span>E-Mail: <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 font-bold hover:underline">sazcargmbh@gmail.com</a></span>
              </p>
            </div>

            {/* Section 3: Geschäftstätigkeit */}
            <div className="space-y-2 border-b border-slate-200/80 pb-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Geschäftstätigkeit</span>
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
                Karosserie- und Spenglerarbeiten, Autolackierung, Autoservice und -reparatur, MFK-Vorbereitung
                und -vorführung, Reifenservice sowie Scheiben- und Glasschadenreparatur.
              </p>
            </div>

            {/* Section 4: Haftungsausschluss */}
            <div className="space-y-2 border-b border-slate-200/80 pb-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>Haftungsausschluss</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Der Inhalt dieser Website wurde mit grösstmöglicher Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der bereitgestellten Inhalte übernehmen wir jedoch keine
                Gewähr. Alle Angebote sind freibleibend und unverbindlich. Wir behalten uns ausdrücklich vor,
                Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu
                ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
              </p>
            </div>

            {/* Section 5: Haftung für Links */}
            <div className="space-y-2 border-b border-slate-200/80 pb-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <Scale className="w-5 h-5 text-red-600" />
                <span>Haftung für Links</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Diese Website kann Verweise auf Websites Dritter enthalten. Auf den Inhalt dieser Websites
                haben wir keinen Einfluss und übernehmen dafür keinerlei Haftung. Für den Inhalt der
                verlinkten Seiten ist ausschliesslich deren Betreiber verantwortlich.
              </p>
            </div>

            {/* Section 6: Urheberrecht */}
            <div className="space-y-2">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>Urheberrecht</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Die auf dieser Website veröffentlichten Inhalte, Bilder und Grafiken unterliegen dem
                Urheberrecht. Jede Vervielfältigung, Verbreitung oder öffentliche Wiedergabe ausserhalb der
                Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der SAZCAR GMBH.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
