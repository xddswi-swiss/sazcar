import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Impressum | Autogarage & Carrosserie',
  description: 'Impressum und rechtliche Angaben der SAZCAR GMBH.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header />

      <main className="flex-1">
        <section
          className="mx-auto"
          style={{
            maxWidth: '760px',
            padding: 'clamp(3rem, 2.5rem + 2vw, 6rem) clamp(1rem, 0.429rem + 2.857vw, 1.5rem)',
          }}
        >
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
            style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)', marginBottom: '2rem' }}
          >
            Impressum
          </h1>

          <div
            className="space-y-8 text-slate-700"
            style={{ fontSize: 'clamp(0.9375rem, 0.9rem + 0.15vw, 1rem)', lineHeight: 1.75 }}
          >
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Angaben gemäss Art. 3 UWG</h2>
              <p>
                SAZCAR GMBH<br />
                Unterdorfstrasse 14<br />
                8165 Schöfflisdorf ZH<br />
                Schweiz
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Kontakt</h2>
              <p>
                Telefon: <a href="tel:+41434228676" className="text-red-600 hover:underline">043 422 86 76</a><br />
                WhatsApp: <a href="https://wa.me/41764717981" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">+41 76 471 79 81</a><br />
                E-Mail: <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 hover:underline">sazcargmbh@gmail.com</a>
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Geschäftstätigkeit</h2>
              <p>
                Karosserie- und Spenglerarbeiten, Autolackierung, Autoservice und -reparatur, MFK-Vorbereitung
                und -vorführung, Reifenservice sowie Scheiben- und Glasschadenreparatur.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Haftungsausschluss</h2>
              <p>
                Der Inhalt dieser Website wurde mit grösstmöglicher Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der bereitgestellten Inhalte übernehmen wir jedoch keine
                Gewähr. Alle Angebote sind freibleibend und unverbindlich. Wir behalten uns ausdrücklich vor,
                Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu
                ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Haftung für Links</h2>
              <p>
                Diese Website kann Verweise auf Websites Dritter enthalten. Auf den Inhalt dieser Websites
                haben wir keinen Einfluss und übernehmen dafür keinerlei Haftung. Für den Inhalt der
                verlinkten Seiten ist ausschliesslich deren Betreiber verantwortlich.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">Urheberrecht</h2>
              <p>
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
