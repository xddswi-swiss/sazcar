"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { EstimateForm } from "@/components/EstimateForm";
import { ContactSection } from "@/components/ContactSection";
import { Wrench, Paintbrush, Hammer, ShieldCheck, ChevronRight, MessageSquare, AlertCircle, X, Globe } from "lucide-react";
import defaultJobs from "@/data/jobs.json";
import { CarLoader } from "@/components/CarLoader";

interface Job {
  id: number | string;
  titleDe: string;
  titleTr: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
  carModel?: string;
}

interface Car {
  id: string;
  title: string;
  price: number;
  mileage: number;
  year: string;
  power: string;
  transmission: string;
  fuelType: string;
  mfk: string;
  descriptionDe: string;
  descriptionTr: string;
  descriptionEn: string;
  imageUrls: string[];
  createdAt: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  const [jobs, setJobs] = useState<Job[]>(defaultJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const [carsForSale, setCarsForSale] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeCarPhotoIdx, setActiveCarPhotoIdx] = useState(0);

  const translateSpecValue = (val: string) => {
    if (!val) return "";
    const lowerVal = val.toLowerCase();
    if (lowerVal === "automat" || lowerVal === "automatic" || lowerVal === "automatik") return t.carSpecs.automatic;
    if (lowerVal === "schaltgetriebe" || lowerVal === "manual" || lowerVal === "manuel") return t.carSpecs.manual;
    if (lowerVal === "benzin" || lowerVal === "petrol") return t.carSpecs.petrol;
    if (lowerVal === "diesel") return t.carSpecs.diesel;
    if (lowerVal === "hybrid") return t.carSpecs.hybrid;
    if (lowerVal === "elektro" || lowerVal === "electric" || lowerVal === "elektrikli") return t.carSpecs.electric;
    return val;
  };

  // Fetch cars dynamically
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("/api/cars");
        if (res.ok) {
          const data = await res.json();
          setCarsForSale(data);
        }
      } catch (err) {
        console.error("Failed to load cars", err);
      }
    };
    fetchCars();
  }, []);



  // Fetch jobs dynamically to display admin uploads in real-time
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setJobs(data);
            setActiveJob(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic jobs, using static local backup", err);
      }
    };
    fetchJobs();
  }, []);

  // Sync active job if jobs list updates
  useEffect(() => {
    if (jobs.length > 0 && !activeJob) {
      setActiveJob(jobs[0]);
    }
  }, [jobs, activeJob]);

  // Helper to get localized title of job
  const getJobTitle = (job: Job) => {
    if (language === "tr") return job.titleTr;
    if (language === "en") return job.titleEn;
    return job.titleDe;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <CarLoader onComplete={() => setIsLoading(false)} />}
      <Header />

      {/* Hero Section */}
      <section id="home" className="scroll-mt-[72px] md:scroll-mt-[80px] relative flex flex-col items-center justify-center overflow-hidden px-6 py-12 md:py-20">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px] dark:bg-orange-500/20" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-[150px] dark:bg-red-600/25" />

        <div className="mx-auto max-w-5xl text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-500 dark:border-orange-500/40">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 animate-pulse"></span>
            </span>
            {t.hero.badge}
          </div>
          
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
            {t.hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-xl font-medium text-zinc-700 dark:text-zinc-300">
            {t.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#estimate"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all duration-200"
            >
              {t.hero.ctaEstimate}
            </a>
            <a
              href="#services"
              className="rounded-xl border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-sm px-8 py-4 text-base font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              {t.hero.ctaServices}
            </a>
            <a
              href="#cars"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all duration-200"
            >
              {t.nav.cars}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="scroll-mt-[72px] md:scroll-mt-[80px] px-6 py-20 border-t border-zinc-200/50 dark:border-zinc-850/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-wider text-zinc-950 dark:text-white">
              {t.services.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Bodywork Service Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <Hammer className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.bodyworkTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.bodyworkDesc}
              </p>
            </div>

            {/* Painting Service Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <Paintbrush className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.paintingTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.paintingDesc}
              </p>
            </div>

            {/* General Service Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.repairTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.repairDesc}
              </p>
            </div>

            {/* Tires Service Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.tiresTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.tiresDesc}
              </p>
            </div>

            {/* MFK Prep Service Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.mfkTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.mfkDesc}
              </p>
            </div>

            {/* Glass Damage (Glasschaden) Card */}
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-orange-950/30 glow-hover transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 mb-4 group-hover:scale-105 transition-transform">
                <svg className="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M4 18V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z" />
                  <path d="M12 12l-3-3M12 12l4-2M12 12l2 4M12 12l-4 3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                {t.services.glassTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t.services.glassDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery (Before/After comparison) Section */}
      <section id="gallery" className="scroll-mt-[72px] md:scroll-mt-[80px] px-6 py-20 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200/50 dark:border-zinc-850/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-wider text-zinc-950 dark:text-white">
              {t.gallery.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Projects list panel (1 col) */}
            <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-3 pb-4 lg:pb-0 scrollbar-none">
              {jobs.map((job, index) => (
                <button
                  key={job.id}
                  onClick={() => setActiveJob(job)}
                  className={`flex flex-col text-left p-4 rounded-xl border shrink-0 w-[200px] lg:w-full transition-all ${
                    activeJob?.id === job.id
                      ? "border-orange-500 bg-orange-500/5 text-orange-500 dark:border-orange-500 dark:bg-orange-500/10 dark:text-orange-400"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider font-extrabold text-orange-500">
                    {job.carModel ? job.carModel : `${language === "tr" ? "PROJE" : language === "en" ? "PROJECT" : "PROJEKT"} #${index + 1}`}
                  </span>
                  <span className="text-sm font-bold truncate w-full mt-1">
                    {getJobTitle(job)}
                  </span>
                </button>
              ))}
            </div>

            {/* Slider Display (3 cols) */}
            <div className="lg:col-span-3">
              {activeJob ? (
                <div className="flex flex-col gap-3">
                  <BeforeAfterSlider
                    beforeImage={activeJob.beforeImage}
                    afterImage={activeJob.afterImage}
                    title={getJobTitle(activeJob)}
                  />
                  <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 font-semibold tracking-wide">
                    💡 {t.gallery.sliderInstruction}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 sm:p-20 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 text-center">
                  <AlertCircle className="h-10 w-10 text-zinc-400 mb-3 animate-pulse" />
                  <p className="text-sm sm:text-base font-bold text-zinc-500 max-w-md">
                    {t.gallery.emptyState}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Car Sales Section */}
      <section id="cars" className="scroll-mt-[72px] md:scroll-mt-[80px] px-6 py-20 border-t border-zinc-200/50 dark:border-zinc-850/50 transition-colors">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black uppercase tracking-wider text-zinc-950 dark:text-white">
              {t.nav.cars}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
              {language === "tr" 
                ? "Sizin için özenle seçilmiş, bakımları yapılmış satılık araçlarımız." 
                : language === "en" 
                ? "Our carefully selected and fully serviced vehicles for sale." 
                : "Unsere sorgfältig ausgewählten und gewarteten Fahrzeuge zum Verkauf."}
            </p>
          </div>

          {carsForSale.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-zinc-250 dark:border-zinc-850 rounded-2xl bg-white dark:bg-zinc-950/20">
              <p className="text-sm font-bold text-zinc-500">
                {language === "tr" ? "Aktif ilan bulunmuyor." : language === "en" ? "No active listings." : "Derzeit keine Angebote."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {carsForSale.map((car) => (
                <div key={car.id} className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all overflow-hidden">
                  {/* Car Image Header */}
                  <div className="relative h-56 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <img src={car.imageUrls[0]} alt={car.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* MFK Badge */}
                    {car.mfk && (
                      <span className="absolute top-4 left-4 rounded bg-orange-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                        {car.mfk.toLowerCase().includes("mfk") ? car.mfk : `MFK: ${car.mfk}`}
                      </span>
                    )}
                  </div>

                  {/* Car Details Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white line-clamp-1">
                      {car.title}
                    </h3>
                    
                    {/* Price Display */}
                    <div className="mt-2 text-2xl font-black text-orange-500">
                      CHF {car.price.toLocaleString("de-CH")}
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4 border-t border-b border-zinc-100 dark:border-zinc-900 py-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-extrabold">{t.carSpecs.year}</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold mt-0.5">{car.year}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-extrabold">{t.carSpecs.mileage}</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold mt-0.5">{car.mileage.toLocaleString("de-CH")} km</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-extrabold">{t.carSpecs.power}</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold mt-0.5">{car.power}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-extrabold">{t.carSpecs.transmission}</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold mt-0.5">{translateSpecValue(car.transmission)}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setActiveCarPhotoIdx(0);
                      }}
                      className="mt-6 w-full rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-orange-600 hover:border-orange-600 dark:hover:bg-orange-600 dark:hover:border-orange-600 transition-all text-center cursor-pointer shadow-md"
                    >
                      {language === "tr" ? "İlanı İncele" : language === "en" ? "View Details" : "Details Anzeigen"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Car Details Modal Overlay */}
      {selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-850 bg-zinc-950 p-6 md:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-none flex flex-col gap-6 md:flex-row">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCar(null)}
              className="absolute top-4 right-4 rounded-full bg-zinc-900 p-1.5 text-zinc-400 hover:text-white border border-zinc-800 transition-all shadow cursor-pointer z-50"
            >
              <X size={18} />
            </button>

            {/* Left side: Photo gallery */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              <div className="relative h-64 md:h-[450px] w-full rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={selectedCar.imageUrls[activeCarPhotoIdx]}
                  alt={`${selectedCar.title} - Photo ${activeCarPhotoIdx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnails list */}
              {selectedCar.imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {selectedCar.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCarPhotoIdx(index)}
                      className={`relative h-14 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeCarPhotoIdx === index ? "border-orange-500 scale-95" : "border-zinc-800 hover:border-zinc-650"
                      }`}
                    >
                      <img src={url} alt="Thumbnail" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Spec info & Actions */}
            <div className="w-full md:w-80 flex flex-col justify-between shrink-0 gap-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
                  {selectedCar.title}
                </h3>
                <div className="text-3xl font-black text-orange-500 mt-2">
                  CHF {selectedCar.price.toLocaleString("de-CH")}
                </div>

                {/* Specs Table */}
                <div className="mt-6 border-t border-zinc-900 pt-4 space-y-2 text-xs font-semibold text-zinc-400">
                  <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                    <span className="text-zinc-500">{t.carSpecs.year}</span>
                    <span className="text-white font-bold">{selectedCar.year}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                    <span className="text-zinc-500">{t.carSpecs.mileage}</span>
                    <span className="text-white font-bold">{selectedCar.mileage.toLocaleString("de-CH")} km</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                    <span className="text-zinc-500">{t.carSpecs.power}</span>
                    <span className="text-white font-bold">{selectedCar.power}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                    <span className="text-zinc-500">{t.carSpecs.transmission}</span>
                    <span className="text-white font-bold">{translateSpecValue(selectedCar.transmission)}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                    <span className="text-zinc-500">{t.carSpecs.fuelType}</span>
                    <span className="text-white font-bold">{translateSpecValue(selectedCar.fuelType)}</span>
                  </div>
                  {selectedCar.mfk && (
                    <div className="flex justify-between border-b border-zinc-900/40 pb-2">
                      <span className="text-zinc-500">{t.carSpecs.mfk}</span>
                      <span className="text-white font-bold">{selectedCar.mfk}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {(selectedCar.descriptionDe || selectedCar.descriptionTr || selectedCar.descriptionEn) && (
                  <div className="mt-6">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-extrabold">
                      {language === "tr" ? "Açıklama / Detaylar" : language === "en" ? "Description / Details" : "Beschreibung / Details"}
                    </span>
                    <p className="text-xs font-medium text-zinc-300 leading-relaxed mt-1 whitespace-pre-line max-h-36 overflow-y-auto">
                      {language === "tr" 
                        ? (selectedCar.descriptionTr || selectedCar.descriptionDe)
                        : language === "en" 
                        ? (selectedCar.descriptionEn || selectedCar.descriptionDe)
                        : selectedCar.descriptionDe}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <a
                  href={`https://wa.me/41764717981?text=${encodeURIComponent(
                    language === "tr"
                      ? `Merhaba, CHF ${selectedCar.price.toLocaleString("de-CH")} fiyatındaki ${selectedCar.title} aracı hakkında detaylı bilgi alabilir miyim?`
                      : language === "en"
                      ? `Hello, I'm interested in the ${selectedCar.title} for CHF ${selectedCar.price.toLocaleString("de-CH")}. Could I get more information?`
                      : `Grüezi, ich interessiere mich für das Fahrzeug ${selectedCar.title} für CHF ${selectedCar.price.toLocaleString("de-CH")}. Könnte ich bitte mehr Details bekommen?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.025 13.91 1.002 11.998 1.002c-5.441 0-9.865 4.372-9.87 9.802-.002 1.8.48 3.55 1.396 5.095L2.516 21.9l6.131-1.746zm11.758-5.321c-.328-.164-1.942-.959-2.242-1.069-.3-.11-.519-.164-.737.164-.219.328-.847 1.069-1.039 1.288-.192.219-.384.246-.712.082-1.799-.899-3.036-1.579-4.048-3.328-.266-.46.266-.427.761-1.417.082-.164.041-.308-.021-.432-.062-.124-.519-1.25-.712-1.713-.188-.452-.378-.39-.519-.398-.135-.008-.29-.01-.446-.01-.156 0-.41.059-.624.292-.214.233-.817.798-.817 1.946 0 1.148.832 2.257.949 2.42.117.164 1.638 2.502 3.97 3.508.554.24 1.055.382 1.41.495.557.177 1.063.152 1.464.092.447-.067 1.942-.794 2.215-1.52.273-.726.273-1.348.192-1.48-.082-.132-.29-.214-.618-.378z" />
                  </svg>
                  <span>WhatsApp ile İletişime Geç</span>
                </a>
                <a
                  href="#estimate"
                  onClick={() => setSelectedCar(null)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all text-center"
                >
                  <span>Kostenvorschlag / Görüşme Planla</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Damage Estimate Request Form Section */}
      <section id="estimate" className="scroll-mt-[72px] md:scroll-mt-[80px] px-6 py-20 border-t border-zinc-200/50 dark:border-zinc-850/50">
        <div className="mx-auto max-w-4xl">
          <EstimateForm />
        </div>
      </section>

      {/* Contact Section with Maps */}
      <ContactSection />

      <Footer />
    </div>
  );
}
