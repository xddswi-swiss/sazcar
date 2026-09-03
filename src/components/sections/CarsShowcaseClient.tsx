'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import TurnstileWidget from '@/components/ui/TurnstileWidget';
import { cldUrl, cldSrcSet } from '@/lib/cloudinaryUrl';
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
  Compass, 
  Droplets,
  FileText,
  Crown,
  Printer
} from 'lucide-react';

interface CarItem {
  id: string;
  title: string;
  subtitle?: string | null;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
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

interface CarsShowcaseClientProps {
  cars: CarItem[];
}

export default function CarsShowcaseClient({ cars }: CarsShowcaseClientProps) {
  const [selectedCarId, setSelectedCarId] = useState<string>(cars.length === 1 ? (cars[0]?.id || '') : '');
  const activeCar = cars.find((c) => c.id === selectedCarId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'optional' | 'standard'>('desc');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeCar) {
      const priceStr = typeof activeCar.price === 'number'
        ? activeCar.price.toLocaleString('de-CH')
        : activeCar.price;
      setFormData((prev) => ({
        ...prev,
        message: `Grüezi, ich interessiere mich für den ${activeCar.title} (CHF ${priceStr}.–). Ich möchte gerne einen Besichtigungstermin oder eine Probefahrt vereinbaren.`
      }));
    }
  }, [activeCar?.id, activeCar?.title, activeCar?.price]);

  if (cars.length === 0) return null;

  const images = activeCar?.image_urls && activeCar.image_urls.length > 0
    ? activeCar.image_urls
    : ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80'];

  const handleCarSwitch = (carId: string) => {
    setSelectedCarId(carId);
    setActiveImageIndex(0);
    setIsExpanded(false);
    setTimeout(() => {
      document.getElementById('occasionen-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCar) return;
    if (!turnstileToken) {
      setFormError('Bitte bestätigen Sie das Sicherheitselement (Turnstile).');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/car-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: activeCar.id,
          carTitle: activeCar.title,
          carPrice: activeCar.price,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          turnstileToken
        })
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

  const formattedPrice = activeCar && typeof activeCar.price === 'number'
    ? activeCar.price.toLocaleString('de-CH')
    : activeCar?.price;

  const formattedMileage = activeCar && typeof activeCar.mileage === 'number'
    ? `${activeCar.mileage.toLocaleString('de-CH')} km`
    : activeCar?.mileage;

  return (
    <section
      id="occasionen"
      className="relative w-full overflow-hidden bg-white text-slate-900"
      style={{
        padding: 'clamp(3rem, 2.5rem + 3vw, 6rem) clamp(1rem, 0.5rem + 2vw, 3rem)',
      }}
    >
      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>

        {/* Section Header */}
        <div className="text-left mb-6">
          <h2
            className="font-black tracking-tight text-slate-900"
            style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)' }}
          >
            Aktuelle Occasionen
          </h2>
          <p
            className="font-normal text-slate-600 mt-1.5"
            style={{ fontSize: 'clamp(0.875rem, 0.821rem + 0.268vw, 1.0625rem)' }}
          >
            Geprüfte Premium-Gebrauchtwagen mit Qualitätsgarantie.
          </p>
        </div>

        {/* Car Grid: compact cards, click for full detail below */}
        {cars.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {cars.map((car) => {
              const cardPrice = typeof car.price === 'number' ? car.price.toLocaleString('de-CH') : car.price;
              const cardMileage = typeof car.mileage === 'number' ? `${car.mileage.toLocaleString('de-CH')} km` : car.mileage;
              const cardImage = car.image_urls?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80';
              const isActive = car.id === selectedCarId;
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleCarSwitch(car.id)}
                  className={`group h-full flex flex-col text-left bg-white rounded-2xl border-2 border-t-4 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer ${
                    isActive ? 'border-red-600 border-t-red-600' : 'border-slate-200 border-t-red-600 hover:border-slate-300'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldUrl(cardImage, 600)}
                      alt={car.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {car.image_urls && car.image_urls.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
                        {car.image_urls.length} Fotos
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col">
                    <h3 className="font-black text-slate-900 text-sm leading-snug truncate">{car.title}</h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-normal text-slate-900 text-sm shrink-0">CHF {cardPrice}.–</span>
                      <span className="text-[11px] font-medium text-slate-900 truncate">{car.year} · {cardMileage}</span>
                    </div>
                    <div className="mt-auto flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wide pt-0.5">
                      <span>Details ansehen</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Embedded White Car Detail Card */}
        {activeCar && (
        <div id="occasionen-detail" className="bg-white text-slate-900 rounded-3xl border border-slate-200/90 shadow-md overflow-hidden p-5 sm:p-7 lg:p-8 transition-all duration-500">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT COLUMN: Gallery */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-950 group">
                
                {/* Main Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cldUrl(images[activeImageIndex] || images[0], 900)}
                  srcSet={cldSrcSet(images[activeImageIndex] || images[0], [400, 700, 900])}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  alt={activeCar.title}
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
                  {images.slice(1, 5).map((img, idx) => {
                    const actualIndex = idx + 1;
                    const isFourthThumb = idx === 3;
                    const extraImagesCount = images.length - 4;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(actualIndex)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImageIndex === actualIndex
                            ? 'border-red-600 ring-2 ring-red-600/30 scale-[1.02] shadow-sm'
                            : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cldUrl(img, 200)} alt={`Thumb ${actualIndex}`} loading="lazy" className="w-full h-full object-cover" />
                        
                        {isFourthThumb && extraImagesCount > 0 && (
                          <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-black tracking-wider">
                            +{extraImagesCount} Bilder
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Details & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              
              <div>
                <h1 
                  className="font-bold text-slate-900 tracking-tight leading-tight"
                  style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)' }}
                >
                  {activeCar.title}
                </h1>
                {activeCar.subtitle && (
                  <p className="text-xs sm:text-[13px] text-slate-900 mt-2 leading-relaxed font-normal">
                    {activeCar.subtitle}
                  </p>
                )}
              </div>

              {/* Price & Action Buttons */}
              <div className="space-y-3 py-2 border-y border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span 
                    className="font-extrabold text-slate-900 tracking-tight"
                    style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.4vw, 1.625rem)' }}
                  >
                    CHF {formattedPrice}.–
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExpanded(true);
                      setTimeout(() => {
                        document.getElementById('kontakt-form-client')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full bg-white hover:bg-amber-50/40 text-slate-800 font-normal py-2.5 px-3 rounded-xl border border-amber-400 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm group"
                  >
                    <Mail className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-colors shrink-0" />
                    <span>Anfrage</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full bg-white hover:bg-amber-50/40 text-slate-800 font-normal py-2.5 px-3 rounded-xl border border-amber-400 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm group"
                  >
                    <Phone className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-colors shrink-0" />
                    <span className="truncate">{showPhone ? '+41 76 302 54 54' : '076...anzeigen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full bg-white hover:bg-amber-50/40 text-slate-800 font-normal py-2.5 px-3 rounded-xl border border-amber-400 hover:border-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs sm:text-sm group"
                    title="Fahrzeug-Datenblatt als PDF drucken"
                  >
                    <Printer className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-colors shrink-0" />
                    <span>Drucken</span>
                  </button>
                </div>
              </div>

              {/* Badges Row */}
              {activeCar.badges && activeCar.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {activeCar.badges.map((badge: string, idx: number) => (
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

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-3 pl-3 sm:pl-3.5 text-xs sm:text-sm text-slate-900 font-normal">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.year}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Fuel className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.fuel_type}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formattedMileage}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.power || 'k.A.'}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.transmission}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.consumption || 'k.A.'}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.drive_type || 'k.A.'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{activeCar.body_type || 'Limousine'}</span>
                </div>
              </div>

              {/* Toggle Button for 2nd Layer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 sm:gap-4">
                <div className="shrink-0 flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo_gold.svg" alt="SAZCAR GMBH" className="h-8 sm:h-10 w-auto object-contain" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-3 sm:px-4 rounded-2xl border-b-2 border-b-amber-400 hover:border-b-amber-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer text-xs sm:text-sm group"
                >
                  <span className="truncate">{isExpanded ? 'Alle Fahrzeugdaten ausblenden' : 'Alle Details & Fahrzeug-Anfrage'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
              </div>

            </div>

          </div>

          {/* 2nd LAYER: EXPANDED TABS & INQUIRY FORM */}
          {isExpanded && (
            <div id="ausstattungen-section" className="mt-8 pt-8 border-t border-slate-200/90 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Notice Disclaimer Banner */}
              <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Die tatsächliche Ausstattung kann von der veröffentlichten Ausstattung abweichen. Bitte überprüfen Sie alle Details bei der Besichtigung.
                </p>
              </div>

              {/* Üst Sekme Butonları */}
              <div className="space-y-0">
                <div className="flex items-end gap-1.5 px-0.5 relative z-10 flex-wrap sm:flex-nowrap">
                  {/* Tab 1: Optionale Ausstattung (Özel - Altın Sarısı) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('optional')}
                    className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                      activeTab === 'optional'
                        ? 'bg-amber-400 text-slate-950 font-black border-2 border-b-0 border-amber-400 -mb-[2px] shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-amber-400 font-bold border border-slate-200/90'
                    }`}
                  >
                    <Crown className={`w-4 h-4 ${activeTab === 'optional' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>Optionale Ausstattung ({activeCar.optional_equipment?.length || 0})</span>
                  </button>

                  {/* Tab 2: Serienmässige Ausstattung (Standart - Siyah) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('standard')}
                    className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                      activeTab === 'standard'
                        ? 'bg-slate-900 text-white font-black border-2 border-b-0 border-slate-900 -mb-[2px] shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold border border-slate-200/90'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${activeTab === 'standard' ? 'text-white' : 'text-slate-900'}`} />
                    <span>Serienmässige Ausstattung ({activeCar.standard_equipment?.length || 0})</span>
                  </button>

                  {/* Tab 3: Fahrzeugbeschreibung (Açıklama - Kırmızı) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('desc')}
                    className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-extrabold rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 select-none ${
                      activeTab === 'desc'
                        ? 'bg-red-600 text-white font-black border-2 border-b-0 border-red-600 -mb-[2px] shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-red-600 font-bold border border-slate-200/90'
                    }`}
                  >
                    <FileText className={`w-4 h-4 ${activeTab === 'desc' ? 'text-white' : 'text-red-600'}`} />
                    <span>Fahrzeugbeschreibung</span>
                  </button>
                </div>

                {/* Aktif Sekmeyle Çerçevesi Birleşen İçerik Kutusu */}
                <div
                  className={`p-4 sm:p-5 bg-slate-50/90 border-2 shadow-xs relative z-0 ${
                    activeTab === 'optional' 
                      ? 'border-amber-400 rounded-b-2xl rounded-tr-2xl rounded-tl-none' 
                      : activeTab === 'standard'
                      ? 'border-slate-900 rounded-b-2xl rounded-t-2xl'
                      : 'border-red-600 rounded-b-2xl rounded-tl-2xl rounded-tr-none'
                  }`}
                >
                  {activeTab === 'desc' ? (
                    <div className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-900 leading-relaxed font-normal shadow-2xs whitespace-pre-line">
                      {activeCar.description || 'Keine besondere Beschreibung vorhanden.'}
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-900 font-medium">
                      {(activeTab === 'optional' ? (activeCar.optional_equipment || []) : (activeCar.standard_equipment || [])).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === 'optional' ? 'bg-amber-500' : 'bg-slate-900'}`} />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* 5. FAHRZEUG-ANFRAGE KONTAKTFORMULAR */}
              <div id="kontakt-form-client" className="space-y-4 border-t border-slate-200 pt-6">
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
                      Wir haben Ihre Nachricht zum <strong>{activeCar.title}</strong> erhalten und melden uns umgehend bei Ihnen!
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleFormSubmit}
                    className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs"
                  >
                    {formError && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
                        {formError}
                      </div>
                    )}
                    
                    {/* İlgilenilen Araç Rozeti */}
                    <div className="bg-amber-50/80 border border-amber-300/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-slate-900 text-xs sm:text-sm font-normal shadow-2xs">
                      <div className="flex items-center gap-2.5 font-normal">
                        <div className="p-1.5 bg-amber-400 text-slate-950 rounded-xl">
                          <Car className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="font-normal">Anfrage für: {activeCar.title}</span>
                      </div>
                      <span className="shrink-0 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-normal rounded-xl shadow-2xs">
                        CHF {formattedPrice}.–
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                          <User className="w-3.5 h-3.5 text-red-600" /> Vorname & Nachname *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Max Mustermann"
                          className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs px-3.5 py-2.5 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                          <Phone className="w-3.5 h-3.5 text-red-600" /> Telefonnummer *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="079 123 45 67"
                          className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs px-3.5 py-2.5 text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                          <Mail className="w-3.5 h-3.5 text-red-600" /> E-Mail Adresse *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@beispiel.ch"
                          className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs px-3.5 py-2.5 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5 uppercase tracking-wide">
                        <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Ihre Nachricht / Wunschtermin
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Ich interessiere mich für dieses Fahrzeug und möchte gerne einen Termin vereinbaren..."
                        className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs p-3.5 text-xs sm:text-sm"
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
        )}

      {/* PRINT-ONLY A4 FAHRZEUG-DATENBLATT (EXPOSÉ) */}
      {isMounted && activeCar && createPortal(
        <div id="print-car-expose" className="hidden print:block font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo_gold.svg" alt="SAZCAR GMBH" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">SAZCAR GMBH</h1>
                <p className="text-xs font-bold text-red-600 uppercase tracking-widest">Autogarage & Carrosserie</p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-700 font-medium">
              <p className="font-bold text-slate-900 text-base uppercase tracking-wider">FAHRZEUG-EXPOSÉ</p>
              <p className="text-[11px] text-slate-500 font-medium">Schweizer Qualitäts-Occasion</p>
            </div>
          </div>

          {/* Car Title & Price Banner */}
          <div className="border-b border-slate-300 pb-3 flex items-center justify-between mb-4 gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-slate-900 leading-tight">{activeCar.title}</h2>
              {activeCar.subtitle && <p className="text-xs text-slate-600 mt-1">{activeCar.subtitle}</p>}
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-red-600 whitespace-nowrap">CHF {formattedPrice}.–</div>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">MwSt. inkl. / Verkaufspreis</p>
            </div>
          </div>

          {/* Photo & Technical Data Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4 items-start">
            {/* Featured Photo */}
            <div className="border border-slate-300 rounded-xl overflow-hidden aspect-[4/3] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0]}
                alt={activeCar.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Technical Specs */}
            <div className="bg-white border border-slate-300 rounded-xl p-3 space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2 text-xs uppercase tracking-wider text-red-600">
                Technische Fahrzeugdaten
              </h3>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-slate-800">
                <div><span className="text-slate-500 font-semibold">Erstzulassung:</span> <br /><strong>{activeCar.year}</strong></div>
                <div><span className="text-slate-500 font-semibold">Kilometerstand:</span> <br /><strong>{formattedMileage}</strong></div>
                <div><span className="text-slate-500 font-semibold">Treibstoff:</span> <br /><strong>{activeCar.fuel_type}</strong></div>
                <div><span className="text-slate-500 font-semibold">Getriebe:</span> <br /><strong>{activeCar.transmission}</strong></div>
                <div><span className="text-slate-500 font-semibold">Leistung:</span> <br /><strong>{activeCar.power || 'k.A.'}</strong></div>
                <div><span className="text-slate-500 font-semibold">Karosserie:</span> <br /><strong>{activeCar.body_type || 'Limousine'}</strong></div>
                <div><span className="text-slate-500 font-semibold">Antrieb:</span> <br /><strong>{activeCar.drive_type || 'k.A.'}</strong></div>
                <div><span className="text-slate-500 font-semibold">Verbrauch:</span> <br /><strong>{activeCar.consumption || 'k.A.'}</strong></div>
              </div>
            </div>
          </div>

          {/* Equipment lists */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            {/* Optional Equipment */}
            {activeCar.optional_equipment && activeCar.optional_equipment.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-300 p-3 rounded-xl">
                <h4 className="font-extrabold text-amber-500 border-b-2 border-amber-400 pb-1 mb-1.5 text-xs uppercase tracking-wider">
                  Optionale Ausstattung ({activeCar.optional_equipment.length})
                </h4>
                <ul className="space-y-1 text-slate-800 text-[11px] list-disc list-inside">
                  {activeCar.optional_equipment.slice(0, 10).map((opt, idx) => (
                    <li key={idx} className="truncate">{opt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standard Equipment */}
            {activeCar.standard_equipment && activeCar.standard_equipment.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1.5 text-xs uppercase tracking-wider">
                  Serienmässige Ausstattung ({activeCar.standard_equipment.length})
                </h4>
                <ul className="space-y-1 text-slate-800 text-[11px] list-disc list-inside">
                  {activeCar.standard_equipment.slice(0, 10).map((std, idx) => (
                    <li key={idx} className="truncate">{std}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Description */}
          {activeCar.description && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4 text-xs text-slate-800">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1 text-xs uppercase tracking-wider">
                Fahrzeugbeschreibung
              </h4>
              <p className="line-clamp-3 text-[11px] leading-relaxed">{activeCar.description}</p>
            </div>
          )}

          {/* Personal Note / Invitation */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 mb-4 text-xs text-slate-900 flex items-start gap-2.5">
            <span className="text-base leading-none shrink-0 mt-0.5">☕</span>
            <div>
              <p className="font-extrabold text-slate-900 mb-0.5">Herzlichen Dank für Ihr Interesse an unserem Fahrzeug!</p>
              <p className="text-[11px] text-slate-700 leading-normal font-medium">
                Sie müssen sich absolut nicht sofort entscheiden. Kommen Sie ganz unverbindlich bei uns vorbei, geniessen Sie einen frischen Kaffee und machen Sie eine entspannte Probefahrt. Wir freuen uns sehr auf Ihren Besuch!
              </p>
            </div>
          </div>

          {/* Footer Contact Info */}
          <div className="border-t-2 border-slate-900 pt-3 mt-auto flex items-center justify-between text-xs text-slate-800">
            <div>
              <p className="font-bold text-slate-900">SAZCAR GMBH — Autogarage & Carrosserie</p>
              <p className="text-[11px] text-slate-600">Ihr Schweizer Partner für geprüfte Qualitäts-Occasionen & Carrosserie</p>
            </div>
            <div className="text-right font-semibold">
              <p>Direktkontakt: 076 302 54 54</p>
              <p className="text-red-600 font-bold">www.sazcar.ch</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      </div>
    </section>
  );
}


