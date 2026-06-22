"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { AlertTriangle, Wrench, Home } from "lucide-react";

export default function NotFound() {
  const { language } = useLanguage();

  // Localized texts inside the 404 page
  const content = {
    de: {
      title: "404 - Falsche Abzweigung",
      subtitle: "Diese Strasse führt ins Nichts. Die gesuchte Seite existiert nicht oder wurde verschoben.",
      btnText: "Zurück zur Werkstatt",
    },
    tr: {
      title: "404 - Yanlış Saprak",
      subtitle: "Bu yol çıkmaza giriyor. Aradığınız sayfa bulunamadı veya taşınmış olabilir.",
      btnText: "Servise Geri Dön",
    },
    en: {
      title: "404 - Wrong Turn",
      subtitle: "This road leads to nowhere. The page you are looking for does not exist or has been moved.",
      btnText: "Back to Workshop",
    },
  };

  const t404 = content[language] || content["de"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0e12] text-white px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-red-600/5 blur-[150px]" />

      <style jsx global>{`
        @keyframes gauge-wiggle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes needle-pulse {
          0%, 100% { transform: rotate(45deg); }
          50% { transform: rotate(47deg); }
        }
        .animate-gauge {
          animation: gauge-wiggle 3s infinite ease-in-out;
        }
        .animate-needle {
          animation: needle-pulse 0.4s infinite ease-in-out;
          transform-origin: 100px 90px;
        }
      `}</style>

      <div className="z-10 flex flex-col items-center text-center max-w-lg">
        {/* Sleek dashboard speedometer dial SVG */}
        <div className="relative mb-8 animate-gauge drop-shadow-[0_0_20px_rgba(249,115,22,0.2)]">
          <svg
            viewBox="0 0 200 130"
            className="w-56 h-36 text-orange-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Speedometer outer arc */}
            <path
              d="M 30 100 A 75 75 0 1 1 170 100"
              strokeWidth="4"
              stroke="currentColor"
              className="text-zinc-800"
            />
            {/* Speedometer active arc (up to 404 zone) */}
            <path
              d="M 30 100 A 75 75 0 1 1 145 42"
              strokeWidth="4"
              stroke="currentColor"
              strokeDasharray="4 2"
              className="text-orange-500"
            />
            {/* Redline zone */}
            <path
              d="M 145 42 A 75 75 0 0 1 170 100"
              strokeWidth="4"
              stroke="currentColor"
              className="text-red-600"
            />

            {/* Scale markings */}
            <line x1="30" y1="100" x2="38" y2="100" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="65" x2="47" y2="68" stroke="currentColor" strokeWidth="2" />
            <line x1="65" y1="38" x2="70" y2="44" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="25" x2="100" y2="33" stroke="currentColor" strokeWidth="2" />
            <line x1="135" y1="38" x2="130" y2="44" stroke="currentColor" strokeWidth="2" />
            <line x1="160" y1="65" x2="153" y2="68" stroke="currentColor" strokeWidth="2" />
            <line x1="170" y1="100" x2="162" y2="100" stroke="currentColor" strokeWidth="2" />

            {/* Speedometer needle pointing to 404 zone */}
            <g className="animate-needle">
              <line
                x1="100"
                y1="90"
                x2="148"
                y2="42"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
              />
            </g>
            <circle cx="100" cy="90" r="8" fill="currentColor" className="text-zinc-700" />
            <circle cx="100" cy="90" r="4" fill="currentColor" className="text-orange-500" />

            {/* Odometer displaying "404 km" */}
            <rect
              x="72"
              y="74"
              width="56"
              height="16"
              rx="4"
              fill="#08090c"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-800"
            />
            <text
              x="100"
              y="86"
              fill="currentColor"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              letterSpacing="1"
              className="text-orange-500 font-mono"
            >
              404 KM
            </text>

            {/* Engine warning symbol (flashing check engine light) */}
            <g className="animate-pulse text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]">
              {/* Outer shell of motor */}
              <path
                d="M 88 108 L 92 108 L 92 105 L 108 105 L 108 108 L 112 108 L 112 113 L 108 113 L 108 119 L 92 119 L 92 113 L 88 113 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Fan / shaft details */}
              <line x1="100" y1="105" x2="100" y2="119" stroke="currentColor" strokeWidth="1" opacity="0.6" />
              {/* Mini Warning Triangle inside engine light */}
              <path d="M 100 109 L 97 114 L 103 114 Z" fill="currentColor" />
            </g>
          </svg>
        </div>

        {/* Warning Icon & Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/5 text-xs font-black uppercase tracking-widest text-red-500 mb-4 animate-pulse">
          <AlertTriangle size={14} />
          {t404.title}
        </div>

        <p className="mt-4 text-base sm:text-lg text-zinc-400 font-medium leading-relaxed px-4">
          {t404.subtitle}
        </p>

        {/* Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            <Home size={16} />
            {t404.btnText}
          </Link>
          <Link
            href="/#estimate"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-8 py-4 text-sm font-black uppercase tracking-wider text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
          >
            <Wrench size={16} />
            {language === "tr" ? "Teklif İste" : language === "en" ? "Request Estimate" : "Offerte Anfordern"}
          </Link>
        </div>
      </div>
    </div>
  );
}
