'use client';

import Image from 'next/image';
import { Shield, Award, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PromoBadge, { type Promotion } from './PromoBadge';

const badges = [
  { icon: Clock, text: '40+ Jahre Erfahrung' },
  { icon: Shield, text: '100% Schweizer Qualität' },
  { icon: Award, text: 'MFK-Garantie' },
];

export default function Hero({ promotions = [] }: { promotions?: Promotion[] }) {
  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden bg-slate-50 lg:min-h-[100svh]"
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
          className="object-contain object-center md:object-right"
          priority
        />
      </div>

      {/* Content Container (Left-aligned Layout) */}
      <div
        className="relative z-10 w-full text-left"
        style={{
          padding: 'clamp(7rem, 5rem + 6vw, 11rem) clamp(1.5rem, 0.786rem + 3.571vw, 4rem)',
          maxWidth: '1000px',
          marginInline: 'auto',
        }}
      >
        {/* Upper Accent Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-slate-200 shadow-xs rounded-full mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <span 
            className="font-bold tracking-widest text-slate-500 uppercase"
            style={{ fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)' }}
          >
            Premium Automotive Studio
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-black tracking-tight text-slate-900 leading-[1.05]"
          style={{
            fontSize: 'clamp(2.25rem, 1.34rem + 4.54vw, 4.5rem)',
          }}
        >
          Ihre Carrosserie & <br />
          <span className="text-red-600">Autogarage</span>{" "}
          <span className="text-red-600/30">
            Experten
          </span> <br />
          in Zürich Unterland
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="text-slate-700 max-w-[620px] ml-0 mr-auto font-bold bg-white/40 backdrop-blur-xs rounded-xl p-2"
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
            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2 group"
            style={{
              padding: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem) clamp(1.5rem, 1.25rem + 0.8vw, 2.5rem)',
              fontSize: 'clamp(0.8125rem, 0.78rem + 0.15vw, 0.9375rem)',
            }}
          >
            <span>Online Termin buchen</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#occasionen"
            className="bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold rounded-xl shadow-xs transition-colors"
            style={{
              padding: 'clamp(0.75rem, 0.6rem + 0.5vw, 1rem) clamp(1.5rem, 1.25rem + 0.8vw, 2.5rem)',
              fontSize: 'clamp(0.8125rem, 0.78rem + 0.15vw, 0.9375rem)',
            }}
          >
            Occasionen
          </a>
        </motion.div>

        {/* Clean Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-start"
          style={{
            gap: 'clamp(1rem, 0.5rem + 1vw, 2rem)',
            marginTop: 'clamp(3rem, 2.5rem + 1.5vw, 4.5rem)',
          }}
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.text}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-xs rounded-xl"
              >
                <Icon className="w-4 h-4 text-red-600" />
                <span
                  className="font-bold text-slate-700"
                  style={{
                    fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)',
                  }}
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
          className="lg:hidden flex flex-col"
          style={{
            marginTop: 'clamp(1.5rem, 1rem + 2vw, 2.5rem)',
            maxWidth: '280px',
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
      <div className="hidden lg:flex absolute inset-y-0 right-0 lg:right-6 w-full lg:w-[58%] z-[2] items-center justify-end pointer-events-none">
        <div className="relative w-full aspect-square max-h-full">
          <div
            className="absolute flex flex-col pointer-events-auto"
            style={{
              left: '62%',
              top: '60%',
              transform: 'translate(-50%, -50%)',
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

      {/* Decorative looping van in the open space below the content, before the section ends */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-x-0 z-[1] pointer-events-none select-none"
        style={{ bottom: 'clamp(2.5rem, 8vh, 5rem)' }}
      >
        <svg
          className="hero-van-drive"
          width="190"
          height="68"
          viewBox="0 0 180 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="90" cy="58" rx="72" ry="3" fill="#0f172a" opacity="0.08" />

          {/* body — boxy minibus silhouette, front (windshield) on the right */}
          <path d="M14 50 L14 26 Q14 16 26 14 L120 14 Q136 14 146 24 L162 38 Q166 42 166 46 L166 50 Z" fill="#dc2626" />
          <path d="M14 26 Q14 16 26 14 L120 14 Q136 14 146 24" stroke="#fecaca" strokeWidth="2" fill="none" opacity="0.45" />

          {/* windshield + side window */}
          <path d="M124 22 L138 22 Q144 22 149 27 L156 36 L124 36 Z" fill="#fecaca" />
          <rect x="34" y="22" width="70" height="16" rx="4" fill="#fecaca" opacity="0.85" />

          {/* headlight + bumper */}
          <circle cx="160" cy="44" r="2.6" fill="#fde68a" />
          <rect x="12" y="48" width="156" height="5" rx="2.5" fill="#7f1d1d" />

          {/* side lettering */}
          <text x="90" y="46" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="8" fill="#ffffff" letterSpacing="0.5">
            SAZCAR GMBH
          </text>

          {/* wheels */}
          <circle cx="46" cy="54" r="8" fill="#1e293b" />
          <circle cx="46" cy="54" r="3.2" fill="#94a3b8" />
          <circle cx="140" cy="54" r="8" fill="#1e293b" />
          <circle cx="140" cy="54" r="3.2" fill="#94a3b8" />
        </svg>
      </div>
    </section>
  );
}
