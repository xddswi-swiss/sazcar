'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, ShieldCheck, Car, X, ArrowRight, Wrench, Sparkles, PhoneCall } from 'lucide-react';
import { PROMO_CTA_EVENT } from './PromoBadge';

const HAGEL_SERVICE_NAME = 'Hagelschaden & Unwetterschaden';
const SEEN_KEY = 'sazcar_hagelschaden_popup_seen_v2';

export default function HagelschadenPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show strictly ONCE per visitor ever
    let seen = false;
    try {
      seen = !!localStorage.getItem(SEEN_KEY);
    } catch {}
    if (seen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        localStorage.setItem(SEEN_KEY, '1');
      } catch {}
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAction = () => {
    handleClose();
    // Dispatch event to pre-select Hagelschaden in AppointmentForm
    window.dispatchEvent(new CustomEvent(PROMO_CTA_EVENT, { detail: { service: HAGEL_SERVICE_NAME } }));
    
    // Smooth scroll to appointment form
    const formElement = document.getElementById('termin');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#termin');
    }
  };

  const handleMoreInfo = () => {
    handleClose();
    router.push('/hagelschaden');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Centered Modal Wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg md:max-w-3xl max-h-[85svh] flex flex-col bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden text-slate-800 pointer-events-auto my-auto"
            >
              {/* Sticky Top Accent Stripe & Emergency Badge (Always visible on top) */}
              <div className="sticky top-0 z-20 shrink-0 bg-gradient-to-r from-red-600 via-red-500 to-amber-600 px-4 sm:px-8 py-3 sm:py-4 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                    <CloudRain className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-bounce" />
                  </div>
                  <span className="font-extrabold text-[11px] sm:text-base uppercase tracking-wider text-red-50">
                    Aktueller Hinweis • Region Schöfflisdorf
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  aria-label="Schliessen"
                  className="p-1.5 sm:p-2 rounded-full bg-black/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Main Content Area with Internal Scroll */}
              <div
                className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1"
                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
              >
                <div className="space-y-1.5 sm:space-y-2 text-left">
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Hagelschaden am Auto? Wir helfen sofort!
                  </h3>
                  <p className="text-xs sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                    Nach den aktuellen Hagelunwettern in der Region unterstützen wir Sie rasch, unkompliziert und werterhaltend.
                  </p>
                </div>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                  <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-2xs">
                    <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                      Sanftes Ausbeulen (Drücktechnik ohne Lackieren)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                      100% Abwicklung mit Ihrer Schweizer Kaskoversicherung
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-2xs">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                      Scheiben- & Glasschaden Reparatur
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 sm:gap-3 bg-slate-50/90 p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-2xs">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
                      Ersatzwagen auf Wunsch verfügbar
                    </span>
                  </div>
                </div>

                {/* Experience Trust Banner */}
                <p className="text-[11px] sm:text-sm text-slate-500 font-medium italic border-t border-slate-100 pt-3 sm:pt-4">
                  💡 <strong>SAZCAR GMBH:</strong> Seit über 40 Jahren Ihr erfahrener Karosserie- & Spenglerfachbetrieb.
                </p>

                {/* Direct Phone Call Box */}
                <div className="bg-red-50/90 border border-red-200 p-3 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-red-600 text-white rounded-2xl shrink-0 animate-pulse">
                      <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-base font-bold text-slate-900 leading-snug">
                        Rufen Sie uns direkt & unverbindlich an – zögern Sie nicht!
                      </p>
                      <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5">
                        Wir beraten Sie gerne persönlich am Telefon.
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:+41434228676"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-lg rounded-2xl transition-all shadow-md hover:shadow-lg animate-pulse shrink-0 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>043 422 86 76</span>
                  </a>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
                  <button
                    onClick={handleAction}
                    className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 sm:py-4 px-5 sm:px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 sm:gap-2.5 text-sm sm:text-lg cursor-pointer group"
                  >
                    <span>Jetzt unverbindlich Termin buchen</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleMoreInfo}
                    className="w-full sm:w-auto px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-base font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Für detaillierte Infos & Techniken</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-4 text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Später
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
