'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, BadgeCheck, History, ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PromoBadge, { type Promotion } from './PromoBadge';

const badges = [
  { icon: History, text: '40+ Jahre Erfahrung' },
  { icon: ShieldCheck, text: '100% Schweizer Qualität' },
  { icon: BadgeCheck, text: 'MFK-Garantie' },
];

const FLIP_WORDS = ['Profis', 'Meister', 'Partner', 'Spezialisten'];

export default function Hero({ promotions = [] }: { promotions?: Promotion[] }) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % FLIP_WORDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-slate-50"
    >
      {/* ── Fluid clean layout gradient (Light theme) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50" aria-hidden="true" />

      {/* Grid Pattern overlay for tech/premium style */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-[0.03]"
        aria-hidden="true"
      />

      {/* ── Background Sketch Illustration (Smaller & Right-aligned on desktop) ── */}
      <div
        className="absolute inset-y-0 right-0 md:right-6 w-full md:w-[58%] z-0 pointer-events-none select-none opacity-[0.22] sm:opacity-[0.26] md:opacity-[0.32]"
        aria-hidden="true"
      >
        <Image
          src="/werkstatt-sketch-sazcar.jpg"
          alt="Werkstatt Sketch Background"
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-contain object-center md:object-right"
          priority
        />
      </div>

      {/* Content Container (Left-aligned Layout) */}
      <div
        className="relative z-10 w-full text-left pt-24 md:pt-28 lg:pt-32 xl:pt-40 pb-12 md:pb-16 xl:pb-24 px-4 sm:px-6 md:px-10 xl:px-16 xl:-translate-x-[10.25rem]"
        style={{
          maxWidth: '1000px',
          marginInline: 'auto',
        }}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-black tracking-tight text-slate-900 leading-[1.1] text-2xl sm:text-3xl md:text-[2.15rem] lg:text-[2.55rem] xl:text-[3.25rem]"
        >
          Ihre Carrosserie & <br />
          <span className="text-red-600">Autogarage</span>{" "}
          <span className="inline-block relative h-[1.12em] overflow-hidden align-bottom min-w-[190px] sm:min-w-[260px] md:min-w-[300px] xl:min-w-[350px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={FLIP_WORDS[wordIndex]}
                initial={{ y: 36, opacity: 0, filter: 'blur(10px)', rotateX: -60 }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)', rotateX: 0 }}
                exit={{ y: -36, opacity: 0, filter: 'blur(10px)', rotateX: 60 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="absolute left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-400 to-red-600 font-black tracking-tight whitespace-nowrap"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(220, 38, 38, 0.35))',
                }}
              >
                {FLIP_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>{" "}<br />
          in Zürich Unterland
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="text-slate-700 max-w-[620px] ml-0 mr-auto font-normal"
          style={{
            fontSize: 'clamp(0.875rem, 0.82rem + 0.28vw, 1.125rem)',
            marginTop: 'clamp(1.25rem, 1rem + 0.8vw, 2rem)',
            lineHeight: 1.6,
          }}
        >
          High-End Karosseriearbeiten, Fahrzeuglackierung, Autoservice und MFK-Vorbereitung für alle Marken. Präzise Handwerkskunst trifft auf Schweizer Qualität.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap justify-start items-center"
          style={{
            gap: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)',
            marginTop: 'clamp(2rem, 1.5rem + 1.2vw, 3rem)',
          }}
        >
          <a
            href="#termin"
            className="bg-red-600 hover:bg-red-700 text-white font-normal rounded-xl shadow-xs transition-all flex items-center gap-1.5 py-2 px-4 text-xs sm:text-sm group"
          >
            <span>Online Termin buchen</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=41764717981&text=Guten%20Tag%20SAZCAR%20Team%2C%20ich%20bin%20%C3%BCber%20Ihre%20Webseite%20auf%20Sie%20aufmerksam%20geworden.%20Ich%20m%C3%B6chte%20gerne%20einen%20Termin%20%2F%20eine%20Offerte%20anfragen."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-normal rounded-xl shadow-xs transition-all flex items-center gap-1.5 py-2 px-4 text-xs sm:text-sm group cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white stroke-emerald-600" />
            <span>WhatsApp Chat</span>
          </a>
        </motion.div>

        {/* Trust Badges — Pushed down and shifted left for pixel-perfect alignment with button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-start gap-2.5 sm:gap-3.5 -ml-6 sm:-ml-7"
          style={{
            marginTop: 'clamp(3rem, 2.5rem + 1.5vw, 4.5rem)',
          }}
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.text}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xs rounded-2xl hover:border-red-300 hover:shadow-xs transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100/80 shadow-2xs shrink-0 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span
                  className="font-normal text-slate-800 text-xs sm:text-sm whitespace-nowrap"
                >
                  {badge.text}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Aktions- & Rabatt-Badges — mobile/tablet: fills the empty gap below the trust badges instead of overlaying text. Stacks when several campaigns run at once. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:hidden flex flex-col w-full"
          style={{
            marginTop: 'clamp(0.25rem, 0.1rem + 0.5vw, 0.75rem)',
            gap: 'clamp(0.75rem, 0.5rem + 0.5vw, 1rem)',
          }}
        >
          {promotions.length > 0 ? (
            promotions.map((promo) => <PromoBadge key={promo.id} promotion={promo} />)
          ) : (
            <PromoBadge promotion={null} />
          )}
        </motion.div>
      </div>

      {/* Aktions- & Rabatt-Badges, overlaid on the workshop illustration (desktop only — avoids the risky 768–1024px tablet band).
          Pinned to the same fitted box as the sketch image, so it tracks the illustration at any width — anchored under the lifted car's underbody. */}
      <div className="hidden lg:flex absolute inset-y-0 right-0 lg:right-6 w-full lg:w-[58%] z-20 items-center justify-end pointer-events-none">
        <div className="relative w-full aspect-square max-h-full">
          <div
            className="absolute flex flex-col pointer-events-auto"
            style={{
              left: '62%',
              top: '60%',
              transform: 'translate(-50%, calc(-50% + 2.5rem))',
              width: 'clamp(220px, 18vw, 270px)',
              gap: 'clamp(0.75rem, 0.5rem + 0.5vw, 1rem)',
            }}
          >
            {promotions.length > 0 ? (
              promotions.map((promo) => <PromoBadge key={promo.id} promotion={promo} />)
            ) : (
              <PromoBadge promotion={null} />
            )}
          </div>
        </div>
      </div>

    </section>
  );
}
