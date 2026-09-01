import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, Database, Cookie, Lock, FileText, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Datenschutz | Autogarage & Carrosserie',
  description: 'Datenschutzerklärung der SAZCAR GMBH.',
};

export default function DatenschutzPage() {
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
              Datenschutzerklärung
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
              Informationen zur Bearbeitung personenbezogener Daten der SAZCAR GMBH.
            </p>
          </div>

          {/* Main Card Container */}
          <div
            className="group relative border rounded-3xl overflow-hidden transition-all duration-300 shadow-sm bg-white/55 border-slate-300 backdrop-blur-xl p-6 sm:p-10 space-y-8"
          >
            <div>
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>1. Verantwortliche Stelle</span>
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">
                SAZCAR GMBH, Unterdorfstrasse 14, 8165 Schöfflisdorf ZH, Schweiz<br />
                E-Mail: <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 font-bold hover:underline">sazcargmbh@gmail.com</a>{' '}
                · Telefon: <a href="tel:+41434228676" className="text-red-600 font-bold hover:underline">043 422 86 76</a>
              </p>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
                Diese Erklärung informiert Sie darüber, welche personenbezogenen Daten wir bei der Nutzung
                dieser Website bearbeiten, zu welchem Zweck dies geschieht und welche Rechte Ihnen dabei
                zustehen. Sie orientiert sich am Schweizer Bundesgesetz über den Datenschutz (DSG) und,
                soweit Besucher aus der EU betroffen sind, an der Datenschutz-Grundverordnung (DSGVO).
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                <span>2. Welche Daten wir erheben</span>
              </h2>
              <p className="text-slate-700 font-medium text-sm sm:text-base">Beim Ausfüllen des Terminanfrage-Formulars bearbeiten wir:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 text-sm sm:text-base">
                <li>Name, Telefonnummer und E-Mail-Adresse</li>
                <li>Fahrzeugangaben und gewünschte Dienstleistungen</li>
                <li>Wunschtermin (Datum/Uhrzeit) und Ihre Nachricht zum Anliegen</li>
                <li>Optional hochgeladene Fotos zum Schaden</li>
              </ul>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm sm:text-base">
                Zusätzlich erhebt unser Server beim Aufruf der Website automatisch technische Angaben
                (z. B. IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs) in Form von Server-Logfiles.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                <span>3. Zweck der Bearbeitung</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Wir verwenden Ihre Angaben ausschliesslich zur Bearbeitung Ihrer Terminanfrage, zur
                Kontaktaufnahme und zur Abwicklung des angefragten Werkstattauftrags. Eine Weitergabe zu
                Werbezwecken erfolgt nicht.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>4. Eingesetzte Dienstleister</span>
              </h2>
              <p className="text-slate-700 font-medium text-sm sm:text-base">Zum Betrieb der Website setzen wir folgende Auftragsverarbeiter ein:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 text-sm sm:text-base">
                <li><span className="font-semibold text-slate-900">Supabase</span> – Speicherung der Termin- und Kontaktdaten in einer Datenbank</li>
                <li><span className="font-semibold text-slate-900">Cloudinary</span> – Speicherung und Auslieferung hochgeladener Schadenfotos</li>
                <li><span className="font-semibold text-slate-900">Google Maps</span> – eingebundene Standortkarte auf dieser Seite; beim Laden der Karte kann Google Daten Ihres Browsers verarbeiten</li>
              </ul>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <Cookie className="w-5 h-5 text-red-600" />
                <span>5. Cookies</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Diese Website setzt keine Tracking- oder Marketing-Cookies ein. Technisch notwendige
                Cookies werden ausschliesslich für den passwortgeschützten Login-Bereich unserer
                Mitarbeitenden verwendet. Die eingebettete Google-Maps-Karte kann eigene Cookies von
                Google setzen, sobald sie geladen bzw. bedient wird.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                <span>6. Aufbewahrungsdauer</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Wir bewahren Ihre Angaben nur so lange auf, wie dies zur Bearbeitung Ihrer Anfrage bzw.
                zur Erfüllung des Werkstattauftrags erforderlich ist, oder solange gesetzliche
                Aufbewahrungspflichten bestehen.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                <span>7. Ihre Rechte</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Sie haben das Recht, Auskunft über die von uns bearbeiteten Daten zu Ihrer Person zu
                verlangen sowie deren Berichtigung, Löschung oder Einschränkung der Bearbeitung zu
                verlangen. Für Anfragen zu Ihren Daten wenden Sie sich an{' '}
                <a href="mailto:sazcargmbh@gmail.com" className="text-red-600 font-bold hover:underline">sazcargmbh@gmail.com</a>.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span>8. Datensicherheit</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten vor
                unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
              </p>
            </div>

            <div className="border-t border-slate-200/80 pt-6">
              <h2 className="font-bold text-slate-900 text-lg sm:text-xl mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                <span>9. Änderungen dieser Erklärung</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
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
