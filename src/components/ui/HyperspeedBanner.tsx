'use client';

import React, { useState } from 'react';
import { Zap, Camera } from 'lucide-react';

// Static streak layout (top offset %, width %, delay s, color) — no JS render loop.
const SPEED_LINES = [
  { top: 12, width: 38, delay: 0, color: 'rgba(220,38,38,0.85)' },
  { top: 24, width: 55, delay: 0.4, color: 'rgba(255,255,255,0.6)' },
  { top: 38, width: 30, delay: 1.1, color: 'rgba(220,38,38,0.7)' },
  { top: 52, width: 65, delay: 0.2, color: 'rgba(255,255,255,0.5)' },
  { top: 64, width: 42, delay: 0.9, color: 'rgba(220,38,38,0.8)' },
  { top: 76, width: 50, delay: 1.5, color: 'rgba(255,255,255,0.55)' },
  { top: 88, width: 34, delay: 0.6, color: 'rgba(220,38,38,0.75)' },
];

export default function HyperspeedBanner() {
  const [isSpeedingUp, setIsSpeedingUp] = useState(false);

  const lines = SPEED_LINES;

  return (
    <div
      className="relative w-full h-72 sm:h-72 md:h-80 lg:h-96 bg-black overflow-hidden border-y border-red-600/30 shadow-2xl select-none group cursor-pointer"
      onMouseDown={() => setIsSpeedingUp(true)}
      onMouseUp={() => setIsSpeedingUp(false)}
      onMouseLeave={() => setIsSpeedingUp(false)}
      onTouchStart={() => setIsSpeedingUp(true)}
      onTouchEnd={() => setIsSpeedingUp(false)}
    >
      {/* Lightweight CSS speed-line streaks — GPU-only transform/opacity, no render loop */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        {lines.map((line, i) => (
          <span
            key={i}
            className="speed-line"
            style={{
              top: `${line.top}%`,
              width: `${line.width}%`,
              background: line.color,
              animationDelay: `${line.delay}s`,
              ['--speed-line-duration' as string]: isSpeedingUp ? '0.5s' : '2.4s',
            }}
          />
        ))}
      </div>

      {/* Glassmorphism UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 py-3 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/70">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 backdrop-blur-md border border-red-400/40 text-white font-extrabold text-[9px] sm:text-[10px] md:text-xs rounded-full shadow-lg shadow-red-900/40 mb-2 uppercase tracking-widest animate-pulse shrink-0">
          <Zap className="w-3 h-3 fill-white text-white" />
          <span>EXPRESS REPARATUR & SERVICE</span>
        </div>

        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
          Präzision & Geschwindigkeit <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
            auf Höchstem Niveau
          </span>
        </h2>

        {/* Meaningful Connection Between Speed & Repair Service (Hidden on mobile for sleek thin view) */}
        <p className="hidden sm:block text-slate-200 text-[11px] sm:text-sm font-normal mt-2 max-w-xl leading-relaxed drop-shadow-sm px-1">
          Wir erledigen Ihre Auto- & Karosseriereparatur in Höchstgeschwindigkeit – präzise, zuverlässig & professionell für Sie.
        </p>

        {/* Dynamic Speed-Up Indicator (Hidden on mobile for sleek thin view) */}
        <p className="hidden sm:block text-red-400 text-[10px] sm:text-xs font-normal mt-1.5 drop-shadow-sm tracking-wide">
          {isSpeedingUp ? (
            <span className="text-red-400 font-extrabold animate-bounce inline-block">
              ⚡ TURBO WARP SPEED AKTIV! ⚡
            </span>
          ) : (
            <span className="opacity-90">
              🖱️ Gedrückt halten für Warp-Speed Animation
            </span>
          )}
        </p>

        {/* Action Buttons Overlay */}
        <div className="pointer-events-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mt-3 w-full sm:w-auto px-4 sm:px-0">
          <a
            href="#termin"
            className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 text-white font-normal text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg shadow-red-900/50 transition-all flex items-center gap-2 group cursor-pointer hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Express-Offerte anfordern</span>
          </a>
          <a
            href="https://wa.me/41763784141?text=Hallo%20SAZCAR,%20ich%20m%C3%B6chte%20ein%20Schaden-Foto%20f%C3%BCr%20eine%20Express-Sch%C3%A4tzung%20senden."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-normal text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Schaden-Foto via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
