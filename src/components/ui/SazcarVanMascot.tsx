'use client';

import React from 'react';

export default function SazcarVanMascot({ className = '' }: { className?: string }) {
  return (
    <div className={`relative select-none pointer-events-none group-hover:translate-x-1 transition-transform duration-300 ${className}`}>
      <svg
        viewBox="0 0 120 60"
        className="w-16 h-8 sm:w-20 sm:h-10 drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow under wheels */}
        <ellipse cx="60" cy="54" rx="45" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* Van Main Body */}
        <path
          d="M 12 44 L 12 24 C 12 18 16 14 22 14 L 88 14 C 98 14 106 18 108 26 L 112 36 C 113 39 113 44 110 44 Z"
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth="2"
        />

        {/* Roof line */}
        <path d="M 22 14 L 86 14" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />

        {/* Front Windshield (Glass) */}
        <path
          d="M 88 17 L 104 27 C 105 28 105 30 103 30 L 86 30 Z"
          fill="#E0F2FE"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        {/* Windshield Shine */}
        <path d="M 94 20 L 98 27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

        {/* Side Windows */}
        <path d="M 64 18 L 82 18 L 82 30 L 64 30 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <path d="M 42 18 L 60 18 L 60 30 L 42 30 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />

        {/* White Side Panel Badge with SAZCAR Text */}
        <rect x="18" y="32" width="70" height="10" rx="3" fill="white" stroke="#FCA5A5" strokeWidth="1" />
        <text x="53" y="39.5" textAnchor="middle" fill="#DC2626" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
          SAZCAR
        </text>

        {/* Headlight (Yellow Glow) */}
        <circle cx="109" cy="38" r="3" fill="#FACC15" stroke="#EAB308" strokeWidth="1" />

        {/* Front & Rear Bumpers */}
        <rect x="108" y="42" width="5" height="4" rx="1" fill="#475569" />
        <rect x="7" y="42" width="5" height="4" rx="1" fill="#475569" />

        {/* Wheels */}
        <circle cx="30" cy="46" r="8" fill="#1E293B" />
        <circle cx="30" cy="46" r="4" fill="#94A3B8" />
        <circle cx="30" cy="46" r="1.5" fill="#1E293B" />

        <circle cx="90" cy="46" r="8" fill="#1E293B" />
        <circle cx="90" cy="46" r="4" fill="#94A3B8" />
        <circle cx="90" cy="46" r="1.5" fill="#1E293B" />
      </svg>
    </div>
  );
}
