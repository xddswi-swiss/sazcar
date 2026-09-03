'use client';

import React, { useState } from 'react';
import { Car } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface LogoProps {
  className?: string;
  /** 'default' for light backgrounds (header). 'inverted' for the red footer. */
  variant?: 'default' | 'inverted';
}

/**
 * Logo component with fallback and rich gold window effects.
 */
export default function Logo({ className, variant = 'default' }: LogoProps) {
  const [hasError, setHasError] = useState(false);
  const inverted = variant === 'inverted';
  const reduceMotion = useReducedMotion();

  if (!hasError) {
    return (
      <div className={`relative overflow-visible flex items-center ${className || ''}`}>
        {/* White Badge Card with Kırmızı Seçenek 1: Red Laser Sweep Line */}
        <div
          className={
            inverted
              ? 'contents'
              : 'relative bg-white border-2 border-amber-400/90 shadow-[0_4px_25px_rgba(245,158,11,0.45)] rounded-2xl px-5 py-2.5 flex items-center justify-center -my-5 sm:-my-8 z-30 translate-y-6 sm:translate-y-8 overflow-hidden group transition-all duration-300 hover:shadow-[0_6px_30px_rgba(220,38,38,0.5)] hover:border-red-400'
          }
        >
          {!inverted && (
            <>
              {/* Inner Soft Red Tint Accent */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-50/40 via-transparent to-red-50/40 pointer-events-none rounded-2xl" />

              {/* Kırmızı Seçenek 1: 100% Vibrant Red Laser Sweep Line */}
              <motion.div
                className="absolute inset-0 w-[55%] h-full bg-gradient-to-r from-transparent via-red-600 via-red-500 to-transparent skew-x-[-25deg] pointer-events-none z-10 opacity-95 drop-shadow-[0_0_12px_rgba(220,38,38,0.95)]"
                animate={reduceMotion ? undefined : { x: ['-150%', '250%'] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: 'easeInOut',
                  repeatDelay: 1.4,
                }}
              />
            </>
          )}

          <img
            src="/logo_gold.svg"
            alt="SAZCAR GMBH Logo"
            className={
              inverted
                ? 'h-9 sm:h-11 w-auto object-contain block max-w-full'
                : 'h-12 md:h-14 lg:h-16 xl:h-20 w-auto object-contain block max-w-none relative z-20 drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)] transition-transform duration-300 group-hover:scale-105'
            }
            onError={() => setHasError(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Fallback: styled text logo + car icon */}
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${inverted ? 'bg-white' : 'bg-red-600'}`}>
          <Car className={`w-5 h-5 ${inverted ? 'text-red-600' : 'text-white'}`} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight ${inverted ? 'text-white' : 'text-slate-900'}`}
              style={{ fontSize: 'clamp(1rem, 0.929rem + 0.357vw, 1.25rem)' }}
            >
              AUTOGARAGE
            </span>
            <motion.span
              className={`font-black italic tracking-wide ${
                inverted ? 'text-white' : 'bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent'
              }`}
              style={{ fontSize: 'clamp(1.0625rem, 0.991rem + 0.357vw, 1.3125rem)' }}
              animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              SAZCAR
            </motion.span>
          </span>
          <span className={`text-[10px] font-semibold tracking-widest uppercase ${inverted ? 'text-red-100' : 'text-red-600'}`}>
            & Carrosserie
          </span>
        </div>
      </div>
    </div>
  );
}
