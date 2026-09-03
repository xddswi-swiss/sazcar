'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cldUrl, cldSrcSet } from '@/lib/cloudinaryUrl';

interface Project {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  services_done: string[];
  before_image_urls: string[];
  after_image_urls: string[];
}

interface BeforeAfterClientProps {
  projects: Project[];
}

export default function BeforeAfterClient({ projects }: BeforeAfterClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const project = projects[activeIndex];
  const beforeImg = project.before_image_urls?.[0];
  const afterImg = project.after_image_urls?.[0];

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
  };

  return (
    <section
      id="vorher-nachher"
      className="relative w-full overflow-hidden bg-slate-50 text-slate-800"
      style={{
        padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4rem)' }}>
          <h2
            className="font-black tracking-tight text-slate-900"
            style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)' }}
          >
            Vorher / Nachher Vitrine
          </h2>
          <p
            className="text-slate-600 font-normal"
            style={{
              fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)',
              marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)',
              lineHeight: 1.5,
            }}
          >
            Verschieben Sie den Regler für den Vorher/Nachher-Vergleich.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md cursor-col-resize select-none bg-slate-200"
          style={{ height: 'clamp(320px, 34vw, 480px)' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onClick={(e) => handleMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        >
          {/* After Image */}
          {afterImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cldUrl(afterImg, 900)}
              srcSet={cldSrcSet(afterImg, [500, 800, 1200])}
              sizes="(min-width: 1024px) 1136px, 100vw"
              alt={`${project.brand} ${project.model} – Nachher`}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}

          {/* Before Image */}
          {beforeImg && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cldUrl(beforeImg, 900)}
                srcSet={cldSrcSet(beforeImg, [500, 800, 1200])}
                sizes="(min-width: 1024px) 1136px, 100vw"
                alt={`${project.brand} ${project.model} – Vorher`}
                className="absolute inset-0 h-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
                draggable={false}
              />
            </div>
          )}

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-10"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Handle Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white text-slate-800 rounded-full border border-slate-200 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4.5 h-4.5 text-red-600 -mr-0.5" />
              <ChevronRight className="w-4.5 h-4.5 text-red-600 -ml-0.5" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-4 left-4 bg-white/90 border border-slate-200 text-slate-800 font-normal px-3.5 py-1.5 rounded-xl shadow-xs z-10 pointer-events-none" style={{ fontSize: 'clamp(0.6875rem, 0.66rem + 0.1vw, 0.8125rem)' }}>
            Vorher
          </div>
          <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 text-slate-800 font-normal px-3.5 py-1.5 rounded-xl shadow-xs z-10 pointer-events-none" style={{ fontSize: 'clamp(0.6875rem, 0.66rem + 0.1vw, 0.8125rem)' }}>
            Nachher
          </div>
        </motion.div>

        {/* Project Details Footer & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 px-0 pt-4 mt-2 transition-all duration-300">
          <div className="flex-1 space-y-2 text-left">
            <h3
              className="font-bold text-slate-900 tracking-tight text-left"
              style={{ fontSize: 'clamp(1rem, 0.95rem + 0.22vw, 1.25rem)' }}
            >
              {project.model && project.model.toLowerCase().startsWith(project.brand.toLowerCase())
                ? project.model
                : `${project.brand} ${project.model || ''}`.trim()}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl text-left">
              Professionell repariert, präzise ausgeführt und mit höchstem Qualitätsanspruch abgeschlossen. So bringen wir jedes Fahrzeug wieder in seinen optimalen Zustand.
            </p>

            <div className="flex gap-2 flex-wrap items-center justify-start pt-1 -ml-3">
              {(project.services_done && project.services_done.length > 0
                ? project.services_done
                : ['Karosserie & Spenglerarbeiten', 'Autolackierung & Malerei']
              ).map((srv) => (
                <span
                  key={srv}
                  className="inline-block bg-slate-100 border border-slate-200 text-slate-700 font-normal rounded-full text-left"
                  style={{
                    fontSize: 'clamp(0.625rem, 0.61rem + 0.07vw, 0.6875rem)',
                    padding: '0.25rem 0.75rem',
                  }}
                >
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Thumbnail Strip Navigation — quick jump via each project's "before" shot */}
          {projects.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`${p.brand} ${p.model} anzeigen`}
                  className={`relative shrink-0 w-14 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activeIndex
                      ? 'border-red-600 ring-2 ring-red-600/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                >
                  {p.before_image_urls?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cldUrl(p.before_image_urls[0], 150)}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
