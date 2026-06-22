"use client";

import React, { useState, useEffect } from "react";

interface CarLoaderProps {
  onComplete: () => void;
}

export const CarLoader: React.FC<CarLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showHeadlight, setShowHeadlight] = useState(false);
  const [zoomOff, setZoomOff] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Prevent scrolling during load
    document.body.style.overflow = "hidden";

    // Smooth simulated progress loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment by a random amount to make it feel natural
        const increment = Math.floor(Math.random() * 8) + 2;
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  // Handle the exit animation sequence when progress reaches 100%
  useEffect(() => {
    if (progress === 100) {
      // 1. Turn on headlights
      const headlightTimer = setTimeout(() => {
        setShowHeadlight(true);
      }, 200);

      // 2. Zoom off the screen
      const zoomTimer = setTimeout(() => {
        setZoomOff(true);
      }, 700);

      // 3. Fade out the overlay
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1200);

      // 4. Complete loading
      const completeTimer = setTimeout(() => {
        onComplete();
        document.body.style.overflow = "";
      }, 1600);

      return () => {
        clearTimeout(headlightTimer);
        clearTimeout(zoomTimer);
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0e12] select-none transition-opacity duration-500 overflow-hidden ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* CSS Keyframe Animations */}
      <style jsx global>{`
        @keyframes engine-vibrate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.2px) scaleY(0.99); }
        }
        @keyframes wheel-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes exhaust-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-vibrate {
          animation: engine-vibrate 0.12s infinite linear;
        }
        .animate-wheel {
          animation: wheel-rotate 0.8s infinite linear;
        }
        .animate-exhaust {
          animation: exhaust-glow 0.2s infinite ease-in-out;
        }
      `}</style>

      {/* Main Car Visualizer Container */}
      <div className="relative w-full max-w-[400px] h-[150px] flex items-center justify-center px-4">
        {/* Car Outline Wrapper */}
        <div
          className={`relative w-[280px] h-[90px] transition-all ${
            zoomOff ? "translate-x-[150vw] scale-95 duration-700 ease-in" : "animate-vibrate"
          }`}
        >
          {/* SVG Sports Car Outline */}
          <svg
            viewBox="0 0 240 80"
            className="w-full h-full text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Front splitter & Underbody */}
            <path d="M 12 60 L 25 60 A 15 15 0 0 1 55 60 L 175 60 A 15 15 0 0 1 205 60 L 228 60 C 235 60 236 57 232 55 L 225 50 C 220 46 215 42 205 42 L 180 42 C 160 25 145 15 110 13 C 85 11 60 17 48 24 L 28 35 C 18 42 12 48 12 55 Z" />
            
            {/* Windows & Cabin Outline */}
            <path d="M 75 29 L 105 18 C 120 18 135 24 148 29 Z" strokeWidth="1.5" />
            
            {/* Door Panel details */}
            <path d="M 112 29 L 112 59" strokeWidth="1.5" opacity="0.6" />
            <path d="M 78 35 L 145 35" strokeWidth="1.5" opacity="0.4" />
            
            {/* Rear Spoiler */}
            <path d="M 22 38 L 12 38 C 10 38 10 42 12 42 L 20 42" strokeWidth="1.5" />

            {/* Exhaust Fire / Puff (active when idling/vibrating) */}
            <path
              d="M 5 56 C 2 54 2 62 5 60 C 7 59 7 57 5 56"
              fill="currentColor"
              className="animate-exhaust text-red-500/70"
              stroke="none"
            />

            {/* Front Wheel Spokes (HTML inside SVG) */}
            <g className="animate-wheel origin-[40px_60px]">
              <circle cx="40" cy="60" r="12" stroke="currentColor" strokeWidth="2.5" fill="#0d0e12" />
              <line x1="40" y1="48" x2="40" y2="72" stroke="currentColor" strokeWidth="1.5" />
              <line x1="28" y1="60" x2="52" y2="60" stroke="currentColor" strokeWidth="1.5" />
              <line x1="31" y1="51" x2="49" y2="69" stroke="currentColor" strokeWidth="1.5" />
              <line x1="31" y1="69" x2="49" y2="51" stroke="currentColor" strokeWidth="1.5" />
            </g>

            {/* Rear Wheel Spokes */}
            <g className="animate-wheel origin-[190px_60px]">
              <circle cx="190" cy="60" r="12" stroke="currentColor" strokeWidth="2.5" fill="#0d0e12" />
              <line x1="190" y1="48" x2="190" y2="72" stroke="currentColor" strokeWidth="1.5" />
              <line x1="178" y1="60" x2="202" y2="60" stroke="currentColor" strokeWidth="1.5" />
              <line x1="181" y1="51" x2="199" y2="69" stroke="currentColor" strokeWidth="1.5" />
              <line x1="181" y1="69" x2="199" y2="51" stroke="currentColor" strokeWidth="1.5" />
            </g>
          </svg>

          {/* Glowing Headlight Beam */}
          <div
            className={`absolute top-[48px] left-[225px] w-[180px] h-[55px] bg-gradient-to-r from-orange-400/90 via-orange-400/25 to-transparent pointer-events-none transition-all duration-300 ease-out origin-left`}
            style={{
              clipPath: "polygon(0 20%, 100% 0, 100% 100%, 0 80%)",
              transform: showHeadlight ? "scaleX(1)" : "scaleX(0)",
              opacity: showHeadlight ? 1 : 0,
            }}
          />
        </div>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <span className="text-2xl font-black tracking-widest text-white/90 drop-shadow-md">
          {progress}%
        </span>
        <div className="relative w-56 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-zinc-500 animate-pulse mt-1">
          SazCar Garage Is Loading
        </span>
      </div>
    </div>
  );
};
