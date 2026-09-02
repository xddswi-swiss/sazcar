'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const prev = () => setActiveIndex((i) => (i > 0 ? i - 1 : projects.length - 1));
  const next = () => setActiveIndex((i) => (i < projects.length - 1 ? i + 1 : 0));

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
          <span
            className="inline-block bg-red-50 text-red-600 border border-red-100 font-normal uppercase tracking-widest rounded-full"
            style={{
              fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)',
              padding: '0.375rem 1rem',
              marginBottom: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)',
            }}
          >
            Unsere Arbeiten
          </span>
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
          className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-md cursor-col-resize select-none bg-slate-200"
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
              src={afterImg}
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
                src={beforeImg}
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
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/45 backdrop-blur-lg border border-slate-200/80 hover:bg-white p-5 rounded-3xl shadow-sm mt-6 transition-all duration-300"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div>
            <h3
              className="font-normal text-slate-900 tracking-tight pl-3"
              style={{ fontSize: 'clamp(1rem, 0.95rem + 0.22vw, 1.25rem)' }}
            >
              {project.brand} {project.model}
            </h3>
            <div className="flex gap-2 flex-wrap mt-2">
              {project.services_done?.map((srv) => (
                <span
                  key={srv}
                  className="inline-block bg-slate-100 border border-slate-200 text-slate-700 font-normal rounded-full"
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

          {/* Navigation Controls */}
          {projects.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Vorheriges Projekt"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <span
                className="font-normal text-slate-600 tabular-nums"
                style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
              >
                {activeIndex + 1} / {projects.length}
              </span>
              <button
                onClick={next}
                className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Nächstes Projekt"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
