"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    setIsZooming(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset the car animation after the transition finishes
    setTimeout(() => {
      setIsZooming(false);
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-[49] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-orange-500 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-500/50 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-orange-400 dark:hover:border-orange-500/40 dark:hover:bg-zinc-900 group select-none`}
      aria-label="Scroll to top"
    >
      <style jsx>{`
        @keyframes mini-vibrate {
          0%, 100% { transform: rotate(-90deg) translateY(0); }
          50% { transform: rotate(-90deg) translateY(-0.8px); }
        }
        .car-idle {
          animation: mini-vibrate 0.1s infinite linear;
        }
      `}</style>

      {/* Speeding car or arrow icon wrapper */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isZooming 
            ? "translate-y-[-80px] opacity-0 scale-95" 
            : "translate-y-0 opacity-100 group-hover:scale-105"
        }`}
      >
        {/* SVG of sports car rotated -90deg to point UP */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)] transition-transform duration-200 -rotate-90 group-hover:car-idle"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Car body */}
          <path d="M 3 18 L 4 18 A 2 2 0 0 1 8 18 L 16 18 A 2 2 0 0 1 20 18 L 22 18 C 23 18 23 17 22 16 L 21 15 C 20 14 18 13 16 13 L 14 13 C 12 8 11 5 8 5 C 6 5 4 7 3 9 L 2 12 C 1 14 1 16 1 18 Z" />
          {/* Cabin window */}
          <path d="M 7 9 L 10 9 C 11 9 12 11 13 13 L 7 13 Z" strokeWidth="1.5" />
          {/* Wheels */}
          <circle cx="6" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Subtle indicator arrow (fades in on hover) */}
      <ArrowUp
        size={12}
        className="absolute top-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2px] transition-all text-orange-500/80 dark:text-orange-400/80"
      />
    </button>
  );
};
