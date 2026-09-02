'use client';

import React, { useState } from 'react';
import TurnstileWidget from '@/components/ui/TurnstileWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Fuel, 
  Gauge, 
  Zap, 
  SlidersHorizontal, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Car, 
  Crown, 
  FileText
} from 'lucide-react';

interface CarData {
  id: string;
  title: string;
  subtitle?: string | null;
  price: number | string;
  year: number | string;
  mileage: number | string;
  fuel_type: string;
  transmission: string;
  description?: string | null;
  image_urls?: string[] | null;
  badges?: string[] | null;
  power?: string | null;
  consumption?: string | null;
  drive_type?: string | null;
  body_type?: string | null;
  ribbon_tier?: string | null;
  optional_equipment?: string[] | null;
  standard_equipment?: string[] | null;
}

export default function OccasionDetailClient({ car }: { car: CarData }) {
  const images = car.image_urls && car.image_urls.length > 0
    ? car.image_urls
    : ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTabOption3, setActiveTabOption3] = useState<'optional' | 'standard' | 'description'>('optional');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const formattedPrice = typeof car.price === 'number'
    ? car.price.toLocaleString('de-CH')
    : car.price;

  const formattedMileage = typeof car.mileage === 'number'
    ? `${car.mileage.toLocaleString('de-CH')} km`
    : car.mileage;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImage = images[activeImageIndex];
  const optionalList = car.optional_equipment || [];
  const standardList = car.standard_equipment || [];
  const carBadges = car.badges || ['Ab MFK', 'Mit Garantie', '8-fach bereift'];

  const handleSubmitInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      car_id: car.id,
      car_title: car.title,
      car_price: `CHF ${formattedPrice}.–`,
      customer_name: formData.get('customer_name') as string,
      customer_phone: formData.get('customer_phone') as string,
      customer_email: formData.get('customer_email') as string,
      customer_message: formData.get('customer_message') as string,
      turnstile_token: turnstileToken,
    };

    try {
      const res = await fetch('/api/car-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setFormError(data.error || 'Fehler beim Senden der Anfrage.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-5 sm:p-7 lg:p-8 transition-all duration-500">
      
      {/* ======================================================== */}
      {/* TOP BLOCK (HERO SECTION)                                */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-950 group">
            
            {/* Ribbon Badge */}
            {car.ribbon_tier && car.ribbon_tier !== 'none' && (
              <div className="absolute top-3 left-3 z-10">
                {car.ribbon_tier === 'neu' && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-red-500/80">
                    NEU
                  </span>
                )}
                {car.ribbon_tier === 'aktion' && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-blue-500/80">
                    AKTION
                  </span>
                )}
              </div>
            )}

            {/* Main Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={car.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-red-600 scale-[0.98]' : 'border-slate-200/80 hover:border-slate-400'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Car Core Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                Geprüfte Occasion
              </span>
              <span className="text-xs text-slate-400 font-semibold">ID: {car.id.substring(0, 8)}</span>
            </div>

            <h1 className="font-black text-slate-900 tracking-tight text-xl sm:text-2xl leading-snug">
              {car.title}
            </h1>
            {car.subtitle && (
              <p className="text-xs text-slate-500 font-normal mt-1.5 leading-relaxed">
                {car.subtitle}
              </p>
            )}
          </div>

          <div className="space-y-3 py-2 border-y border-slate-100">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-600 font-normal">Barzahlung / Verkaufspreis:</span>
              <div className="text-right">
                <span className="font-black text-red-600 text-2xl sm:text-3xl tracking-tight">
                  CHF {formattedPrice}.–
                </span>
              </div>
            </div>
          </div>

          {/* Badges Row */}
          {car.badges && car.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2">
              {car.badges.map((badge: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-3 pl-3 sm:pl-3.5 text-xs text-slate-800 bg-slate-50/90 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-normal block">Jahrgang</span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{car.year}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-normal block">Kilometerstand</span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{formattedMileage}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Fuel className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-normal block">Treibstoff</span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{car.fuel_type}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-600 uppercase font-normal block">Getriebe</span>
                <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{car.transmission}</span>
              </div>
            </div>

            {car.power && (
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-normal block">Leistung</span>
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{car.power}</span>
                </div>
              </div>
            )}

            {car.drive_type && (
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-normal block">Antrieb</span>
                  <span className="font-extrabold text-slate-950 text-xs sm:text-sm">{car.drive_type}</span>
                </div>
              </div>
            )}
          </div>

          {/* RED TOGGLE BUTTON (2. Katman Açılımı) */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-between cursor-pointer group text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{isExpanded ? 'Details verbergen (Schließen)' : 'Alle Details & Ausstattungen anzeigen'}</span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
            </button>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* BOTTOM BLOCK (2. KATMAN: KAPI AÇILMASI)                 */}
      {/* ======================================================== */}
      {isExpanded && (
        <div id="ausstattungen-section" className="mt-8 pt-8 border-t border-slate-200/90 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          
          <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Die tatsächliche Ausstattung kann von der veröffentlichten Ausstattung abweichen. Bitte überprüfen Sie alle Details bei der Besichtigung.
            </p>
          </div>

          {/* 3-TAB SYSTEM MATCHING PREVIEW PAGE EXACTLY */}
          <div className="space-y-0">
            
            <div className="flex items-end gap-1.5 px-0.5 relative z-10 flex-wrap sm:flex-nowrap">
              {/* Tab 1: Optionale Ausstattung (Altın Sarısı) */}
              <button
                type="button"
                onClick={() => setActiveTabOption3('optional')}
                className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                  activeTabOption3 === 'optional'
                    ? 'bg-amber-400 text-slate-950 font-black border-2 border-b-0 border-amber-400 -mb-[2px] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold border border-slate-200/90'
                }`}
              >
                <Crown className={`w-4 h-4 ${activeTabOption3 === 'optional' ? 'text-slate-950' : 'text-slate-900'}`} />
                <span>Optionale Ausstattung ({optionalList.length})</span>
              </button>

              {/* Tab 2: Serienmässige Ausstattung (Siyah) */}
              <button
                type="button"
                onClick={() => setActiveTabOption3('standard')}
                className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                  activeTabOption3 === 'standard'
                    ? 'bg-slate-900 text-white font-black border-2 border-b-0 border-slate-900 -mb-[2px] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold border border-slate-200/90'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${activeTabOption3 === 'standard' ? 'text-white' : 'text-slate-900'}`} />
                <span>Serienmässige Ausstattung ({standardList.length})</span>
              </button>

              {/* Tab 3: Fahrzeugbeschreibung (Kırmızı) */}
              <button
                type="button"
                onClick={() => setActiveTabOption3('description')}
                className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                  activeTabOption3 === 'description'
                    ? 'bg-red-600 text-white font-black border-2 border-b-0 border-red-600 -mb-[2px] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold border border-slate-200/90'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTabOption3 === 'description' ? 'text-white' : 'text-slate-900'}`} />
                <span>Fahrzeugbeschreibung</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className={`p-5 sm:p-6 rounded-b-3xl rounded-tr-3xl border-2 space-y-4 shadow-sm bg-slate-50/50 ${
              activeTabOption3 === 'optional'
                ? 'border-amber-400'
                : activeTabOption3 === 'standard'
                ? 'border-slate-900'
                : 'border-red-600'
            }`}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabOption3}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTabOption3 === 'description' ? (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-slate-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal shadow-2xs">
                      {car.description || 'Keine besondere Fahrzeugbeschreibung vorhanden.'}
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-900 text-xs sm:text-sm font-normal">
                      {(activeTabOption3 === 'optional' ? optionalList : standardList).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTabOption3 === 'optional' ? 'bg-amber-500' : 'bg-slate-900'}`} />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* FAHRZEUG-ANFRAGE KONTAKTFORMULAR */}
          <div id="kontakt-form" className="space-y-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Fahrzeug-Anfrage / Probefahrt
              </h3>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-emerald-950">Vielen Dank für Ihre Anfrage!</h4>
                <p className="text-sm text-emerald-800 font-normal">
                  Wir haben Ihre Nachricht zum <strong>{car.title}</strong> erhalten ve umgehend per E-Mail verarbeitet. Wir melden uns in Kürze bei Ihnen!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitInquiry}
                className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs"
              >
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
                    {formError}
                  </div>
                )}

                <div className="bg-amber-50/80 border border-amber-300/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-slate-900 text-xs sm:text-sm font-normal shadow-2xs">
                  <div className="flex items-center gap-2.5 font-normal">
                    <div className="p-1.5 bg-amber-400 text-slate-950 rounded-xl">
                      <Car className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="font-normal">Anfrage für: {car.title}</span>
                  </div>
                  <span className="shrink-0 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-normal rounded-xl shadow-2xs">
                    CHF {formattedPrice}.–
                  </span>
                </div>

                <input type="hidden" name="vehicle_title" value={car.title} />
                <input type="hidden" name="vehicle_price" value={`CHF ${formattedPrice}.–`} />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                      <User className="w-3.5 h-3.5 text-red-600" /> Vorname & Nachname *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      placeholder="Max Mustermann"
                      className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs"
                      style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                      <Phone className="w-3.5 h-3.5 text-red-600" /> Telefonnummer *
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      placeholder="+41 79 000 00 00"
                      className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs"
                      style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                      <Mail className="w-3.5 h-3.5 text-red-600" /> E-Mail Adresse *
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      required
                      placeholder="max@example.ch"
                      className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs"
                      style={{ padding: '0.625rem 1rem', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                    <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Ihre Nachricht / Wunschtermin
                  </label>
                  <textarea
                    rows={3}
                    name="customer_message"
                    defaultValue={`Grüezi, ich interessiere mich für den ${car.title} (CHF ${formattedPrice}.–). Ich möchte gerne einen Besichtigungstermin oder eine Probefahrt vereinbaren.`}
                    className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs"
                    style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-1">
                  {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                    <div className="shrink-0 w-full sm:w-auto">
                      <TurnstileWidget
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        onVerify={(token) => setTurnstileToken(token)}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl border-b-2 border-b-amber-400 hover:border-b-amber-300 transition-all shadow-sm cursor-pointer text-sm flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span>{isSubmitting ? 'Wird gesendet...' : 'Anfrage Jetzt Absenden'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
