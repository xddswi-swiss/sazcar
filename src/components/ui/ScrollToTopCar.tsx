'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTopCar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsZooming(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsZooming(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setIsZooming(false);
    }, 800);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border-2 border-red-500 bg-white text-red-600 shadow-2xl shadow-red-600/50 backdrop-blur-md hover:scale-110 hover:border-red-600 group select-none"
        aria-label="Nach oben fahren"
        title="Nach oben fahren"
      >
        {/* Yanıp Sönen (Pulsing) Dış Kırmızı Halka */}
        <span className="absolute -inset-1.5 rounded-full bg-red-600/40 animate-ping opacity-75 pointer-events-none" />
        <span className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse pointer-events-none" />

        {/* Speeding car & upward arrow wrapper */}
        <div
          className={`relative flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
            isZooming 
              ? '-translate-y-24 opacity-0 scale-95' 
              : 'translate-y-0 opacity-100 group-hover:scale-105'
          }`}
        >
          {/* Arabanın Önündeki Yanıp Sönen / Zıplayan Yukarı Ok */}
          <ArrowUp
            size={16}
            className="text-red-600 font-extrabold stroke-[3] mb-0.5 animate-bounce drop-shadow-[0_0_6px_rgba(220,38,38,0.6)]"
          />

          {/* SVG of sports car rotated -90deg to point UP */}
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)] transition-transform duration-200 -rotate-90 group-hover:animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
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
      </button>
    </div>
  );
}
