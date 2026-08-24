'use client';

import { Snowflake, Sun, Sparkles, Wrench, Tag } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

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

  return (
    <div className="relative">
      {/* Glow ring behind the card */}
      <motion.div
        aria-hidden
        className="absolute -inset-2 rounded-2xl bg-red-500/25 blur-xl"
        animate={shouldReduceMotion ? undefined : { opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: shouldReduceMotion ? 1 : [1, 1.025, 1] }}
        transition={
          shouldReduceMotion
            ? { duration: 0.5, delay: 0.6 }
            : { scale: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }, opacity: { duration: 0.5, delay: 0.6 }, y: { duration: 0.5, delay: 0.6 } }
        }
        className="relative bg-white/95 backdrop-blur-sm border border-red-100 shadow-lg shadow-red-900/10 rounded-2xl"
        style={{ padding: 'clamp(0.875rem, 0.7rem + 0.6vw, 1.25rem)' }}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center rounded-full bg-red-50 text-red-600 shrink-0"
            style={{ width: 'clamp(1.75rem, 1.5rem + 0.5vw, 2.25rem)', height: 'clamp(1.75rem, 1.5rem + 0.5vw, 2.25rem)' }}
          >
            <Icon style={{ width: '55%', height: '55%' }} />
          </span>
          <span
            className="font-bold uppercase tracking-wider text-red-600"
            style={{ fontSize: 'clamp(0.5625rem, 0.53rem + 0.15vw, 0.6875rem)' }}
          >
            {promotion ? 'Aktion' : 'Aktionen'}
          </span>
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
