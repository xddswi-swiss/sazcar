import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Datenschutz | Autogarage & Carrosserie',
  description: 'Datenschutzerklärung der SAZCAR GMBH.',
};

export default function DatenschutzPage() {
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
            Datenschutzerklärung
          </h1>

          <div
            className="space-y-8 text-slate-700"
            style={{ fontSize: 'clamp(0.9375rem, 0.9rem + 0.15vw, 1rem)', lineHeight: 1.75 }}
          >
            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">1. Verantwortliche Stelle</h2>
              <p>
                SAZCAR GMBH, Unterdorfstrasse 14, 8165 Schöfflisdorf ZH, Schweiz<br />
                E-Mail: <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 hover:underline">sazcargmbh@gmail.com</a>{' '}
                · Telefon: <a href="tel:+41434228676" className="text-red-600 hover:underline">043 422 86 76</a>
              </p>
              <p className="mt-2">
                Diese Erklärung informiert Sie darüber, welche personenbezogenen Daten wir bei der Nutzung
                dieser Website bearbeiten, zu welchem Zweck dies geschieht und welche Rechte Ihnen dabei
                zustehen. Sie orientiert sich am Schweizer Bundesgesetz über den Datenschutz (DSG) und,
                soweit Besucher aus der EU betroffen sind, an der Datenschutz-Grundverordnung (DSGVO).
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">2. Welche Daten wir erheben</h2>
              <p>Beim Ausfüllen des Terminanfrage-Formulars bearbeiten wir:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Name, Telefonnummer und E-Mail-Adresse</li>
                <li>Fahrzeugangaben und gewünschte Dienstleistungen</li>
                <li>Wunschtermin (Datum/Uhrzeit) und Ihre Nachricht zum Anliegen</li>
                <li>Optional hochgeladene Fotos zum Schaden</li>
              </ul>
              <p className="mt-2">
                Zusätzlich erhebt unser Server beim Aufruf der Website automatisch technische Angaben
                (z. B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs) in Form von Server-Logfiles.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">3. Zweck der Bearbeitung</h2>
              <p>
                Wir verwenden Ihre Angaben ausschliesslich zur Bearbeitung Ihrer Terminanfrage, zur
                Kontaktaufnahme und zur Abwicklung des angefragten Werkstattauftrags. Eine Weitergabe zu
                Werbezwecken erfolgt nicht.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">4. Eingesetzte Dienstleister</h2>
              <p>Zum Betrieb der Website setzen wir folgende Auftragsverarbeiter ein:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="font-semibold">Supabase</span> – Speicherung der Termin- und Kontaktdaten in einer Datenbank</li>
                <li><span className="font-semibold">Cloudinary</span> – Speicherung und Auslieferung hochgeladener Schadenfotos</li>
                <li><span className="font-semibold">Google Maps</span> – eingebundene Standortkarte auf dieser Seite; beim Laden der Karte kann Google Daten Ihres Browsers verarbeiten (siehe Datenschutzerklärung von Google)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">5. Cookies</h2>
              <p>
                Diese Website setzt keine Tracking- oder Marketing-Cookies ein. Technisch notwendige
                Cookies werden ausschliesslich für den passwortgeschützten Login-Bereich unserer
                Mitarbeitenden verwendet. Die eingebettete Google-Maps-Karte kann eigene Cookies von
                Google setzen, sobald sie geladen bzw. bedient wird.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">6. Aufbewahrungsdauer</h2>
              <p>
                Wir bewahren Ihre Angaben nur so lange auf, wie dies zur Bearbeitung Ihrer Anfrage bzw.
                zur Erfüllung des Werkstattauftrags erforderlich ist, oder solange gesetzliche
                Aufbewahrungspflichten bestehen.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">7. Ihre Rechte</h2>
              <p>
                Sie haben das Recht, Auskunft über die von uns bearbeiteten Daten zu Ihrer Person zu
                verlangen sowie deren Berichtigung, Löschung oder Einschränkung der Bearbeitung zu
                verlangen. Für Anfragen zu Ihren Daten wenden Sie sich an{' '}
                <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 hover:underline">sazcargmbh@gmail.com</a>.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">8. Datensicherheit</h2>
              <p>
                Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten vor
                unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">9. Änderungen dieser Erklärung</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
                Rechtslagen oder Änderungen unseres Angebots anzupassen. Es gilt jeweils die zum
                Zeitpunkt Ihres Besuchs aktuelle Fassung.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
