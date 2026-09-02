'use client';

import { Snowflake, Sun, Sparkles, Wrench, Tag, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

// Fired when the CTA is clicked so AppointmentForm can pre-select the matching service.
export const PROMO_CTA_EVENT = 'sazcar:promo-cta';

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  original_price: number | null;
  discounted_price: number | null;
  discount_percent: number | null;
  start_date: string;
  end_date: string;
  badge_type: 'winter_tires' | 'summer_tires' | 'detailing' | 'service' | 'custom';
  image_url?: string | null;
}

const badgeIcons = {
  winter_tires: Snowflake,
  summer_tires: Sun,
  detailing: Sparkles,
  service: Wrench,
  custom: Tag,
} as const;

// Per-category accents mapped directly to Database badge_type
const badgeTheme = {
  winter_tires: { iconBg: 'bg-sky-100/90', iconText: 'text-sky-600', label: 'text-sky-600', cta: 'bg-sky-600 hover:bg-sky-700 text-white', border: 'border-sky-200/80', glow: 'from-sky-500/20 via-sky-400/10 to-transparent', bg: 'from-sky-50/90 via-white to-sky-50/30', badge: 'bg-sky-100 text-sky-700 border-sky-200' },
  summer_tires: { iconBg: 'bg-amber-100/90', iconText: 'text-amber-600', label: 'text-amber-600', cta: 'bg-amber-600 hover:bg-amber-700 text-white', border: 'border-amber-200/80', glow: 'from-amber-500/20 via-orange-400/10 to-transparent', bg: 'from-amber-50/90 via-white to-amber-50/30', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  detailing: { iconBg: 'bg-violet-100/90', iconText: 'text-violet-600', label: 'text-violet-600', cta: 'bg-violet-600 hover:bg-violet-700 text-white', border: 'border-violet-200/80', glow: 'from-violet-500/20 via-purple-400/10 to-transparent', bg: 'from-violet-50/90 via-white to-violet-50/30', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  service: { iconBg: 'bg-red-100/90', iconText: 'text-red-600', label: 'text-red-600', cta: 'bg-red-600 hover:bg-red-700 text-white', border: 'border-red-200/80', glow: 'from-red-500/20 via-rose-400/10 to-transparent', bg: 'from-red-50/90 via-white to-rose-50/30', badge: 'bg-red-100 text-red-700 border-red-200' },
  custom: { iconBg: 'bg-emerald-100/90', iconText: 'text-emerald-600', label: 'text-emerald-600', cta: 'bg-emerald-600 hover:bg-emerald-700 text-white', border: 'border-emerald-200/80', glow: 'from-emerald-500/20 via-teal-400/10 to-transparent', bg: 'from-emerald-50/90 via-white to-emerald-50/30', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
} as const;

// Maps a promo's badge_type to the matching entry in src/content/services.ts (by title).
const CTA_SERVICE_MATCH: Partial<Record<Promotion['badge_type'], string>> = {
  winter_tires: 'Reifenservice',
  summer_tires: 'Reifenservice',
  service: 'Autoservice & Reparatur',
};

function formatChf(value: number): string {
  return value.toLocaleString('de-CH', { maximumFractionDigits: 0 });
}

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('de-CH', {
    day: 'numeric',
    month: 'long',
  });
}

function discountLine(promo: Promotion): string | null {
  if (promo.discounted_price != null && promo.original_price != null) {
    return `Jetzt CHF ${formatChf(promo.discounted_price)}.– statt CHF ${formatChf(promo.original_price)}.–`;
  }
  if (promo.discount_percent != null) {
    return `${promo.discount_percent}% Rabatt auf ${promo.title}`;
  }
  return promo.description;
}

export default function PromoBadge({ promotion }: { promotion: Promotion | null }) {
  const shouldReduceMotion = useReducedMotion();

  // If there is an active promotion in Supabase DB, render the promotion card.
  if (promotion) {
    const Icon = badgeIcons[promotion.badge_type] ?? Tag;
    const line = discountLine(promotion);
    const theme = badgeTheme[promotion.badge_type ?? 'service'];

    return (
      <div className="relative group">
        <motion.div
          aria-hidden
          className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${theme.glow} blur-xl opacity-80 group-hover:opacity-100 transition-opacity`}
          animate={shouldReduceMotion ? undefined : { opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-900/10 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300 ${theme.bg}`}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center rounded-xl shrink-0 shadow-xs ${theme.iconBg} ${theme.iconText}`}
                style={{ width: 'clamp(2.1rem, 1.8rem + 0.6vw, 2.5rem)', height: 'clamp(2.1rem, 1.8rem + 0.6vw, 2.5rem)' }}
              >
                <Icon style={{ width: '55%', height: '55%' }} />
              </span>

              <span className={`font-extrabold uppercase text-[10px] sm:text-xs tracking-wider ${theme.label}`}>
                AKTUELLES ANGEBOT
              </span>
            </div>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border font-extrabold text-[10px] sm:text-xs rounded-full shadow-2xs ${theme.badge}`}>
              <span className="relative flex shrink-0 w-2 h-2">
                <motion.span
                  aria-hidden
                  className={`absolute inline-flex h-full w-full rounded-full ${theme.dot}`}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className={`relative inline-flex h-full w-full rounded-full ${theme.dot}`} />
              </span>
              <span>AKTIV</span>
            </span>
          </div>

          {promotion.image_url && (
            <div className="w-full rounded-xl overflow-hidden mb-3 border border-slate-200/60 aspect-video shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={promotion.image_url}
                alt={promotion.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug tracking-tight">
            {promotion.title}
          </h3>

          {line && (
            <p className="font-bold text-red-600 text-sm sm:text-base mt-1">
              {line}
            </p>
          )}

          <p className="text-slate-500 font-medium text-xs mt-1.5 leading-relaxed">
            Gültig vom {formatDate(promotion.start_date)} bis {formatDate(promotion.end_date)}
          </p>

          <a
            href="#termin"
            onClick={(e) => {
              e.preventDefault();
              const service = CTA_SERVICE_MATCH[promotion.badge_type] ?? null;
              window.dispatchEvent(new CustomEvent(PROMO_CTA_EVENT, { detail: { service } }));
              document.getElementById('termin')?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
            }}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${theme.cta}`}
          >
            <span>Angebot jetzt sichern</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  // General Sazcar Quality Card when DB has no active promotions (NO fake prices, NO fake discounts!)
  return (
    <div className="relative group">
      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-red-500/20 via-rose-400/10 to-transparent blur-xl opacity-80 group-hover:opacity-100 transition-opacity"
        animate={shouldReduceMotion ? undefined : { opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-900/10 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-red-200 bg-gradient-to-br from-red-50/90 via-white to-rose-50/30"
      >
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex items-center justify-center rounded-xl shrink-0 shadow-xs bg-red-100/90 text-red-600 w-7 h-7 sm:w-8 sm:h-8">
              <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>

            <span className="font-extrabold uppercase text-[9px] sm:text-[10px] tracking-tight text-red-600 truncate">
              SAZCAR MEISTERBETRIEB
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 border font-extrabold text-[9px] sm:text-[10px] rounded-full shadow-2xs bg-emerald-50 text-emerald-700 border-emerald-300 shrink-0 whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>HEUTE GEÖFFNET</span>
          </span>
        </div>

        <h3 className="font-black text-slate-900 text-base sm:text-lg leading-snug tracking-tight">
          Ihr Spezialist für Karosserie & Autoservice
        </h3>

        <p className="text-slate-600 font-semibold text-xs mt-1.5 leading-relaxed">
          Professionelle Reparatur, Dellenentfernung & Fahrzeugwartung in Schöfflisdorf – präzise & zuverlässig.
        </p>

        <div className="flex items-center gap-3 pt-2 text-[11px] font-bold text-slate-700">
          <span className="inline-flex items-center gap-1 text-red-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Schweizer Qualität</span>
          </span>
        </div>

        <a
          href="#termin"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('termin')?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
          }}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
        >
          <span>Termin vereinbaren</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}
