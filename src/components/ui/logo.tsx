'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Car } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface LogoProps {
  className?: string;
  /** 'default' for light backgrounds (header). 'inverted' for the red footer. */
  variant?: 'default' | 'inverted';
}

/**
 * Logo component with fallback.
 * If public/logo.svg exists, it renders via next/image.
 * Otherwise, renders a styled text + icon fallback.
 *
 * Colors are chosen from `variant`, not `prefers-color-scheme` — the two
 * usages sit on fixed backgrounds (white header, red footer) regardless of
 * the visitor's OS theme, so tying color to dark-mode made the text vanish
 * on a light header for dark-mode users.
 */
export default function Logo({ className, variant = 'default' }: LogoProps) {
  const [hasError, setHasError] = useState(false);
  const inverted = variant === 'inverted';
  const reduceMotion = useReducedMotion();

  if (!hasError) {
    return (
      <div className={`relative overflow-visible flex items-center ${className || ''}`}>
        {/* White Badge Card for Header Logo to prevent text collision during scroll */}
        <div
          className={
            inverted
              ? 'contents'
              : 'bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md rounded-2xl px-4 py-2 flex items-center justify-center -my-5 sm:-my-8 relative z-30 translate-y-6 sm:translate-y-8'
          }
        >
          <img
            src="/logo.svg"
            alt="SAZCAR GMBH Logo"
            className={
              inverted
                ? 'h-10 sm:h-12 w-auto object-contain block max-w-full'
                : 'h-16 sm:h-24 w-auto object-contain block max-w-none'
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
