'use client';

import { Snowflake, Sun, Sparkles, Wrench, Tag, ArrowUpRight } from 'lucide-react';
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
}

const badgeIcons = {
  winter_tires: Snowflake,
  summer_tires: Sun,
  detailing: Sparkles,
  service: Wrench,
  custom: Tag,
} as const;

// Per-category accent so several active promos read as distinct cards at a glance.
const badgeTheme = {
  winter_tires: { iconBg: 'bg-sky-50', iconText: 'text-sky-600', label: 'text-sky-600', cta: 'text-sky-600 hover:text-sky-700', border: 'border-sky-100', glow: 'bg-sky-500/25', bg: 'from-sky-50 to-white', dot: 'bg-sky-500' },
  summer_tires: { iconBg: 'bg-amber-50', iconText: 'text-amber-600', label: 'text-amber-600', cta: 'text-amber-600 hover:text-amber-700', border: 'border-amber-100', glow: 'bg-amber-500/25', bg: 'from-amber-50 to-white', dot: 'bg-amber-500' },
  detailing: { iconBg: 'bg-violet-50', iconText: 'text-violet-600', label: 'text-violet-600', cta: 'text-violet-600 hover:text-violet-700', border: 'border-violet-100', glow: 'bg-violet-500/25', bg: 'from-violet-50 to-white', dot: 'bg-violet-500' },
  service: { iconBg: 'bg-red-50', iconText: 'text-red-600', label: 'text-red-600', cta: 'text-red-600 hover:text-red-700', border: 'border-red-100', glow: 'bg-red-500/25', bg: 'from-red-50 to-white', dot: 'bg-red-500' },
  custom: { iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', label: 'text-emerald-600', cta: 'text-emerald-600 hover:text-emerald-700', border: 'border-emerald-100', glow: 'bg-emerald-500/25', bg: 'from-emerald-50 to-white', dot: 'bg-emerald-500' },
} as const;

// Maps a promo's badge_type to the matching entry in src/content/services.ts (by title).
// detailing/custom have no direct match, so the CTA just scrolls without pre-selecting.
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
  const Icon = promotion ? badgeIcons[promotion.badge_type] ?? Tag : Tag;
  const line = promotion ? discountLine(promotion) : null;
  const theme = badgeTheme[promotion?.badge_type ?? 'service'];

  return (
    <div className="relative">
      {/* Glow ring behind the card — more visible pulse so it reads as "active promo", not plain text */}
      <motion.div
        aria-hidden
        className={`absolute -inset-3 rounded-2xl blur-2xl ${theme.glow}`}
        animate={shouldReduceMotion ? undefined : { opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: shouldReduceMotion ? 1 : [1, 1.025, 1] }}
        transition={
          shouldReduceMotion
            ? { duration: 0.5, delay: 0.6 }
            : { scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }, opacity: { duration: 0.5, delay: 0.6 }, y: { duration: 0.5, delay: 0.6 } }
        }
        className={`relative bg-gradient-to-br backdrop-blur-sm border shadow-lg shadow-slate-900/10 rounded-2xl ${theme.bg} ${theme.border}`}
        style={{ padding: 'clamp(0.875rem, 0.7rem + 0.6vw, 1.25rem)' }}
      >
        <div className="flex items-center gap-2">
          <span className={`flex items-center justify-center rounded-full shrink-0 ${theme.iconBg} ${theme.iconText}`}
            style={{ width: 'clamp(1.75rem, 1.5rem + 0.5vw, 2.25rem)', height: 'clamp(1.75rem, 1.5rem + 0.5vw, 2.25rem)' }}
          >
            <Icon style={{ width: '55%', height: '55%' }} />
          </span>
          <span
            className={`font-bold uppercase tracking-wider ${theme.label}`}
            style={{ fontSize: 'clamp(0.5625rem, 0.53rem + 0.15vw, 0.6875rem)' }}
          >
            {promotion ? 'Aktion' : 'Aktionen'}
          </span>
          {promotion && (
            <span className="relative flex shrink-0" style={{ width: '0.4rem', height: '0.4rem' }}>
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden
                  className={`absolute inline-flex h-full w-full rounded-full ${theme.dot}`}
                  animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span className={`relative inline-flex h-full w-full rounded-full ${theme.dot}`} />
            </span>
          )}
        </div>

        {promotion ? (
          <>
            <h3
              className="font-black text-slate-900 leading-tight"
              style={{ fontSize: 'clamp(0.9375rem, 0.85rem + 0.4vw, 1.125rem)', marginTop: 'clamp(0.4rem, 0.35rem + 0.2vw, 0.5rem)' }}
            >
              {promotion.title}
            </h3>
            {line && (
              <p
                className="font-bold text-slate-700"
                style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)', marginTop: '0.25rem' }}
              >
                {line}
              </p>
            )}
            <p
              className="text-slate-500 font-semibold"
              style={{ fontSize: 'clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)', marginTop: '0.4rem' }}
            >
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
              className={`inline-flex items-center gap-1 font-bold transition-colors ${theme.cta}`}
              style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)', marginTop: '0.6rem' }}
            >
              Jetzt buchen
              <ArrowUpRight style={{ width: '0.9em', height: '0.9em' }} />
            </a>
          </>
        ) : (
          <p
            className="font-bold text-slate-600 leading-snug"
            style={{ fontSize: 'clamp(0.8125rem, 0.76rem + 0.25vw, 0.9375rem)', marginTop: 'clamp(0.4rem, 0.35rem + 0.2vw, 0.5rem)' }}
          >
            Aktuell keine Aktionen – Bald neue Angebote verfügbar.
          </p>
        )}
      </motion.div>
    </div>
  );
}
