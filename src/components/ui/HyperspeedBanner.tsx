'use client';

import React, { useState, useMemo } from 'react';
import Hyperspeed from './Hyperspeed';
import { ArrowUpRight, Zap } from 'lucide-react';

export default function HyperspeedBanner() {
  const [isSpeedingUp, setIsSpeedingUp] = useState(false);

  // Memoize options so WebGL scene is NOT torn down & recreated on state changes!
  const hyperspeedOptions = useMemo(() => ({
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,
    fov: 90,
    fovSpeedUp: 150,          // Dramatic Warp FOV Speedup
    speedUp: 5,               // 5x Speed Acceleration on Press
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [12, 80] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],
    colors: {
      roadColor: 0x080808,      // Deep Charcoal
      islandColor: 0x0a0a0a,    // Neutral Dark Gray
      background: 0x000000,     // Black Background
      shoulderLines: 0xdc2626,  // SAZCAR Red Lines
      brokenLines: 0xffffff,    // Pure White Lines
      leftCars: [0xdc2626, 0xef4444, 0xb91c1c],  // SAZCAR Red Taillights
      rightCars: [0xffffff, 0xf8fafc, 0xe2e8f0], // Pure White Xenon Lights
      sticks: 0xdc2626,         // Pure Red Sticks
    },
    onSpeedUp: () => setIsSpeedingUp(true),
    onSlowDown: () => setIsSpeedingUp(false),
  }), []);

  return (
    <div
      className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 bg-black overflow-hidden border-y border-red-600/30 shadow-2xl select-none group cursor-pointer"
      onMouseDown={() => setIsSpeedingUp(true)}
      onMouseUp={() => setIsSpeedingUp(false)}
      onMouseLeave={() => setIsSpeedingUp(false)}
      onTouchStart={() => setIsSpeedingUp(true)}
      onTouchEnd={() => setIsSpeedingUp(false)}
    >
      {/* Official React Bits Three.js Hyperspeed Canvas */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>

      {/* Glassmorphism UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600/90 backdrop-blur-md border border-red-400/40 text-white font-extrabold text-[10px] md:text-xs rounded-full shadow-lg shadow-red-900/40 mb-3 uppercase tracking-widest animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-white text-white" />
          <span>EXPRESS REPARATUR & SERVICE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
          Präzision & Geschwindigkeit <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent">
            auf Höchstem Niveau
          </span>
        </h2>

        {/* Meaningful Connection Between Speed & Repair Service */}
        <p className="text-slate-200 text-xs sm:text-sm font-semibold mt-2.5 max-w-xl leading-relaxed drop-shadow-sm px-2">
          Wir erledigen Ihre Auto- & Karosseriereparatur in Höchstgeschwindigkeit – präzise, zuverlässig & professionell für Sie.
        </p>

        {/* Dynamic Speed-Up Indicator */}
        <p className="text-red-400 text-[11px] sm:text-xs font-bold mt-2 drop-shadow-sm tracking-wide">
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
        <div className="pointer-events-auto flex items-center gap-3 mt-4">
          <a
            href="#termin"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-red-900/50 transition-all flex items-center gap-1.5 group cursor-pointer hover:scale-105"
          >
            <span>Termin buchen</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#dienstleistungen"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer hover:scale-105"
          >
            Dienstleistungen
          </a>
        </div>
      </div>
    </div>
  );
}
