'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TurnstileWidget from '@/components/ui/TurnstileWidget';
import SazcarVanMascot from '@/components/ui/SazcarVanMascot';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Fuel, 
  Gauge, 
  Zap, 
  SlidersHorizontal, 
  Droplets,
  CheckCircle2,
  Sparkles,
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
  FileText,
  Crown
} from 'lucide-react';

import { createClient } from '@/utils/supabase/client';

export default function OccasionPreviewPage() {
  // Default fallback sample car data
  const defaultSampleCar = {
    id: 'demo-car-1',
    title: 'BMW M135i xDrive M Performance',
    subtitle: '*8-fach alubereift*M-Sportsitze*Harman/Kardon*AC Schnitzer Tieferlegung*',
    price: "33'490",
    badges: ['Ab MFK', 'Mit Garantie', 'Kein Unfallfahrzeug', '8 fach bereift'],
    year: '01.2021',
    mileage: "48'500 km",
    fuel_type: 'Benzin',
    power: '306 PS (225 kW)',
    transmission: 'Automat',
    consumption: '7.4 l/100 km',
    drive_type: 'Allrad',
    body_type: 'Limousine',
    ribbon_tier: 'top',
    warranty_tier: 'quality_1',
    accident_free: true,
    image_urls: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
    optional_equipment: [
      'Adaptive LED-Scheinwerfer',
      'Harman/Kardon Surround Sound System',
      'M Sportsitze für Fahrer und Beifahrer',
      'Parking Assistant'
    ],
    standard_equipment: [
      'Active Guard Plus',
      'Bordcomputer',
      'ConnectedDrive Services',
      'Regensensor'
    ],
    description: 'Nahezu vollausgestatteter BMW M135i mit eingetragenen AC Schnitzer Sportfedern und 8-facher Alubereifung.'
  };

  const [allCars, setAllCars] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('demo-car-1');
  const [sampleCar, setSampleCar] = useState<any>(defaultSampleCar);

  React.useEffect(() => {
    async function fetchRealCarFromSupabase() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('cars_for_sale')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          const parsedCars = data.map((dbCar) => ({
            id: dbCar.id,
            title: dbCar.title,
            subtitle: dbCar.subtitle || null,
            price: typeof dbCar.price === 'number' ? dbCar.price.toLocaleString('de-CH') : dbCar.price,
            badges: dbCar.badges && dbCar.badges.length > 0 ? dbCar.badges : [],
            year: String(dbCar.year),
            mileage: typeof dbCar.mileage === 'number' ? `${dbCar.mileage.toLocaleString('de-CH')} km` : dbCar.mileage,
            fuel_type: dbCar.fuel_type,
            power: dbCar.power || 'k.A.',
            transmission: dbCar.transmission,
            consumption: dbCar.consumption || 'k.A.',
            drive_type: dbCar.drive_type || 'k.A.',
            body_type: dbCar.body_type || 'Limousine',
            ribbon_tier: dbCar.ribbon_tier || 'none',
            warranty_tier: dbCar.warranty_tier || 'none',
            image_urls: dbCar.image_urls && dbCar.image_urls.length > 0 ? dbCar.image_urls : defaultSampleCar.image_urls,
            optional_equipment: dbCar.optional_equipment || [],
            standard_equipment: dbCar.standard_equipment || [],
            description: dbCar.description || 'Keine besondere Fahrzeugbeschreibung vorhanden.',
          }));

          // Always combine real database cars + demo reference car for side-by-side comparison
          const combined = [
            ...parsedCars,
            { ...defaultSampleCar, title: `[DEMO REFERANS] ${defaultSampleCar.title}` }
          ];

          setAllCars(combined);
          setSampleCar(parsedCars[0]);
          setSelectedCarId(parsedCars[0].id);
        } else {
          setAllCars([defaultSampleCar]);
          setSampleCar(defaultSampleCar);
        }
      } catch (err) {
        console.error('Failed to load real cars from Supabase:', err);
      }
    }
    fetchRealCarFromSupabase();
  }, []);

  const selectCar = (car: any) => {
    setSampleCar(car);
    setSelectedCarId(car.id);
    setActiveImageIndex(0);
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptionalOpen, setShowOptionalOpen] = useState(true);
  const [showStandardOpen, setShowStandardOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmitInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      car_id: sampleCar.id,
      car_title: sampleCar.title,
      car_price: `CHF ${sampleCar.price}.–`,
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

  // New interactive equipment preview state
  const [selectedCat, setSelectedCat] = useState('Alle');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTabOption3, setActiveTabOption3] = useState<'optional' | 'standard' | 'description'>('optional');

  const activeImage = sampleCar.image_urls[activeImageIndex];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % sampleCar.image_urls.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + sampleCar.image_urls.length) % sampleCar.image_urls.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 relative">
      <Header />

      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Secret Preview Notice Banner */}
        <div className="mb-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">🔒 GİZLİ İLAN ÖNİZLEME SAYFASI</h3>
              <p className="text-xs text-red-100 mt-0.5">
                Bu sayfa sitede hiçbir yere bağlı değildir. Garaj sahibi veya müşteri seçtiği ilanı görüntüler.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-lg backdrop-blur-md border border-white/30">
            Önizleme Modu
          </span>
        </div>

        {/* Multi-Car Switcher Bar (Yüklenen Arabalar Arasında Tek Tıkla Geçiş) */}
        {allCars.length > 1 && (
          <div className="mb-6 bg-slate-800/90 border border-slate-700/80 p-3 rounded-2xl flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-300 shrink-0 flex items-center gap-1.5 px-2">
              <Car className="w-4 h-4 text-red-500" /> Araç Seçimi:
            </span>
            {allCars.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCar(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCarId === c.id
                    ? 'bg-red-600 text-white shadow-md border border-red-500'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span>{i + 1}. {c.title}</span>
                <span className="text-[10px] opacity-80">({c.price} CHF)</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Vehicle Showcase Container (2. Katman Kapı Açılması) */}
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-5 sm:p-7 lg:p-8 transition-all duration-500">
          
          {/* ======================================================== */}
          {/* TOP BLOCK (SABİT HERO BÖLÜMÜ)                           */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* LEFT COLUMN: Gallery (Main Photo + Thumbnail Column) */}
            <div className="lg:col-span-6 space-y-3.5">
              
              {/* Main Big Image Container with Arrow Controls (Zero Modal/Popup) */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-950 group">
                
                {/* Admin-Selected Ribbon Badge Component */}
                <div className="absolute top-3 left-3 z-10">
                  {sampleCar.ribbon_tier === 'neu' && (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-red-500/80">
                      NEU
                    </span>
                  )}
                  {sampleCar.ribbon_tier === 'aktion' && (
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg shadow-md border border-blue-500/80">
                      AKTION
                    </span>
                  )}
                </div>

                {/* Main Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={sampleCar.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Left/Right Arrow Navigation (Direct in-page change, zero modal!) */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 cursor-pointer border border-white/20"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Counter Overlay */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                  {activeImageIndex + 1} / {sampleCar.image_urls.length}
                </div>
              </div>

              {/* Thumbnails Row (First 3 + 4th showing "+X Bilder" badge!) */}
              <div className="grid grid-cols-4 gap-2">
                {sampleCar.image_urls.slice(1, 5).map((img, idx) => {
                  const actualIndex = idx + 1;
                  const isFourthThumb = idx === 3;
                  const extraImagesCount = sampleCar.image_urls.length - 4;

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
                      <img src={img} alt={`Thumb ${actualIndex}`} className="w-full h-full object-cover" />
                      
                      {/* "+X Bilder" Overlay on the 4th thumbnail */}
                      {isFourthThumb && extraImagesCount > 0 && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-black tracking-wider">
                          +{extraImagesCount} Bilder
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Details, Price & Direct Contact Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              
              {/* Title & Subtitle */}
              <div>
                <h1 
                  className="font-bold text-slate-900 tracking-tight leading-tight"
                  style={{
                    fontSize: 'clamp(1.25rem, 1.1rem + 0.6vw, 1.75rem)'
                  }}
                >
                  {sampleCar.title}
                </h1>
                {sampleCar.subtitle && (
                  <p className="text-xs sm:text-[13px] text-slate-900 mt-2 leading-relaxed font-normal">
                    {sampleCar.subtitle}
                  </p>
                )}
              </div>

              {/* Price & Primary Action Buttons (Yellow Anfrage + White Phone) */}
              <div className="space-y-3 py-2 border-y border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span 
                    className="font-extrabold text-slate-900 tracking-tight"
                    style={{
                      fontSize: 'clamp(1.25rem, 1.1rem + 0.4vw, 1.625rem)'
                    }}
                  >
                    CHF {sampleCar.price}.–
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Anfrage Button */}
                  <a
                    href="#kontakt-form"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsExpanded(true);
                      setTimeout(() => {
                        document.getElementById('kontakt-form')?.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="w-full bg-white hover:bg-amber-50/40 text-slate-800 font-normal py-3 px-4 rounded-xl border border-amber-400 hover:border-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm group"
                  >
                    <Mail className="w-4 h-4 text-slate-700 group-hover:text-amber-600 transition-colors" />
                    <span>Anfrage</span>
                  </a>

                  {/* Phone Button */}
                  <button
                    type="button"
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full bg-white hover:bg-amber-50/40 text-slate-800 font-normal py-3 px-4 rounded-xl border border-amber-400 hover:border-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm group"
                  >
                    <Phone className="w-4 h-4 text-slate-700 group-hover:text-amber-600 transition-colors" />
                    <span>{showPhone ? '+41 76 302 54 54' : '076...anzeigen'}</span>
                  </button>
                </div>
              </div>

              {/* Badges Row */}
              {sampleCar.badges && sampleCar.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {sampleCar.badges.map((badge: string, idx: number) => (
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

              {/* 2-Column Technical Specs Grid with Icons (Left aligned under green checkmark icon) */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 py-3 pl-3 sm:pl-3.5 text-xs sm:text-sm text-slate-900 font-normal">
                {/* Row 1 */}
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.year}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Fuel className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.fuel_type}</span>
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.mileage}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.power}</span>
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.transmission}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.consumption}</span>
                </div>

                {/* Row 4 */}
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.drive_type}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{sampleCar.body_type}</span>
                </div>
              </div>

              {/* Bottom Footer Area: SAZCAR Logo + Red Toggle Button Side-by-Side */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 sm:gap-4">
                
                {/* SAZCAR Logo */}
                <div className="shrink-0 flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.svg" alt="SAZCAR GMBH" className="h-8 sm:h-10 w-auto object-contain" />
                </div>

                {/* Red Toggle Button for 2nd Layer */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isExpanded) {
                      setIsExpanded(true);
                      setTimeout(() => {
                        document.getElementById('ausstattungen-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 120);
                    } else {
                      setIsExpanded(false);
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-3 sm:px-4 rounded-2xl border-b-2 border-b-amber-400 hover:border-b-amber-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer text-xs sm:text-sm group"
                >
                  <span className="truncate">{isExpanded ? 'Alle Fahrzeugdaten ausblenden' : 'Alle Details & Fahrzeug-Anfrage'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>

              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* BOTTOM BLOCK (2. KATMAN: KAPI AÇILMASI & SCROLL ALANI)     */}
          {/* ======================================================== */}
          {isExpanded && (
            <div id="ausstattungen-section" className="mt-8 pt-8 border-t border-slate-200/90 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
              
              {/* Notice Disclaimer Banner */}
              <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Die tatsächliche Ausstattung kann von der veröffentlichten Ausstattung abweichen. Bitte überprüfen Sie alle Details bei der Besichtigung.
                </p>
              </div>

              {/* ======================================================== */}
              {/* ✨ BİREBİR RESİMDEKİ GİBİ: SADECE AKTİF SEKME VE İÇERİĞİ ALTIN ÇERÇEVEYLE BİRLEŞİR */}
              {/* ======================================================== */}
              <div className="space-y-0">
                
                {/* Üst Sekme Butonları */}
                <div className="flex items-end gap-1.5 px-0.5 relative z-10 flex-wrap sm:flex-nowrap">
                  {/* Tab 1: Optionale Ausstattung (Özel - Altın Sarısı) */}
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
                    <span>Optionale Ausstattung ({sampleCar.optional_equipment.length})</span>
                  </button>

                  {/* Tab 2: Serienmässige Ausstattung (Standart - Siyah) */}
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
                    <span>Serienmässige Ausstattung ({sampleCar.standard_equipment.length})</span>
                  </button>

                  {/* Tab 3: Fahrzeugbeschreibung (Açıklama - Kırmızı) */}
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

                {/* Aktif Sekmeyle Çerçevesi Birleşen İçerik Kutusu */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTabOption3}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className={`p-4 sm:p-5 bg-slate-50/90 border-2 shadow-xs relative z-0 ${
                      activeTabOption3 === 'optional' 
                        ? 'border-amber-400 rounded-b-2xl rounded-tr-2xl rounded-tl-none' 
                        : activeTabOption3 === 'standard'
                        ? 'border-slate-900 rounded-b-2xl rounded-t-2xl'
                        : 'border-red-600 rounded-b-2xl rounded-tl-2xl rounded-tr-none'
                    }`}
                  >
                    {activeTabOption3 === 'description' ? (
                      <div className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-900 leading-relaxed font-normal shadow-2xs">
                        {sampleCar.description}
                      </div>
                    ) : (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-900 font-medium">
                        {(activeTabOption3 === 'optional' ? sampleCar.optional_equipment : sampleCar.standard_equipment).map((item, idx) => (
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

              {/* 5. FAHRZEUG-ANFRAGE KONTAKTFORMULAR */}
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
                      Wir haben Ihre Nachricht zum <strong>{sampleCar.title}</strong> erhalten ve umgehend per E-Mail verarbeitet. Wir melden uns Kürze bei Ihnen!
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
                    
                    {/* İlgilenilen Araç Rozeti (Tüm yazılar font-normal, hiç kalın yok) */}
                    <div className="bg-amber-50/80 border border-amber-300/90 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2.5 text-slate-900 text-xs sm:text-sm font-normal shadow-2xs">
                      <div className="flex items-center gap-2.5 font-normal">
                        <div className="p-1.5 bg-amber-400 text-slate-950 rounded-xl">
                          <Car className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="font-normal">Anfrage für: {sampleCar.title}</span>
                      </div>
                      <span className="shrink-0 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-normal rounded-xl shadow-2xs">
                        CHF {sampleCar.price}.–
                      </span>
                    </div>

                    {/* Garaj Sahibine E-posta / Veritabanı ile İletilecek Gizli Bilgiler */}
                    <input type="hidden" name="vehicle_title" value={sampleCar.title} />
                    <input type="hidden" name="vehicle_price" value={`CHF ${sampleCar.price}.–`} />

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
                          style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}
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
                          style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}
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
                          style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}
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
                        defaultValue={`Grüezi, ich interessiere mich für den ${sampleCar.title} (CHF ${sampleCar.price}.–). Ich möchte gerne einen Besichtigungstermin oder eine Probefahrt vereinbaren.`}
                        className="w-full bg-white border border-slate-400 hover:border-slate-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none shadow-2xs"
                        style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}
                      />
                    </div>

                    {/* Güvenlik Doğrulaması (Turnstile) + Kırmızı Gönder Butonu YAN YANA (Boş Tarla Yok!) */}
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
      </main>

      <Footer />
    </div>
  );
}
