import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle2, Phone, Mail, Clock, MapPin, ArrowLeft } from 'lucide-react';

export default function DankePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm text-center">
          
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white">
            Vielen Dank!
          </h1>
          <p className="text-lg text-slate-650 dark:text-slate-350 mb-8 leading-relaxed">
            Ihre Terminanfrage ist erfolgreich bei uns eingegangen. Wir bearbeiten Ihre Anfrage so schnell wie möglich und setzen uns in Kürze mit Ihnen in Verbindung.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border-t border-b border-slate-100 dark:border-slate-800 py-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Wie geht es weiter?</h3>
              <ul className="space-y-2 text-sm text-slate-650 dark:text-slate-350">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Wir prüfen Ihren Wunschtermin auf Verfügbarkeit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Sie erhalten eine Bestätigung per E-Mail oder einen Anruf zur Abstimmung.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Bei Rückfragen können Sie uns jederzeit kontaktieren.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Direkter Kontakt</h3>
              <ul className="space-y-3 text-sm text-slate-650 dark:text-slate-350">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-500" />
                  <a href="tel:+41434228676" className="hover:text-red-500 transition-colors">+41 43 422 86 76</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-red-500" />
                  <a href="mailto:sazcargmbh@gmail.com" className="hover:text-red-500 transition-colors">sazcargmbh@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>Unterdorfstrasse 14, 8165 Schöfflisdorf</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>Mo-Fr: 07:30-12:00, 13:15-18:00 | Sa: 09:00-14:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
