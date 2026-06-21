"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { EstimateForm } from "@/components/EstimateForm";
import { ContactSection } from "@/components/ContactSection";
import { Wrench, Paintbrush, Hammer, ShieldCheck, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import defaultJobs from "@/data/jobs.json";

interface Job {
  id: number | string;
  titleDe: string;
  titleTr: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  createdAt: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  
  const [jobs, setJobs] = useState<Job[]>(defaultJobs);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

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
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-12 md:py-20">
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
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-6 py-20 border-t border-zinc-200/50 dark:border-zinc-850/50">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
            <div className="group rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm hover:bg-orange-50/30 dark:border-zinc-800 dark:bg-zinc-950 glow-hover transition-all">
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
      <section id="gallery" className="px-6 py-20 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200/50 dark:border-zinc-850/50">
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
              {jobs.map((job) => (
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
                    Project #{job.id}
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
                <div className="flex flex-col items-center justify-center p-20 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
                  <AlertCircle className="h-10 w-10 text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-500">No jobs uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Damage Estimate Request Form Section */}
      <section id="estimate" className="px-6 py-20 border-t border-zinc-200/50 dark:border-zinc-850/50">
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
