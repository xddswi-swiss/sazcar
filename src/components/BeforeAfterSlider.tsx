"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  title,
}) => {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-3">
      {/* Slider Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-wider text-center md:text-left">
        {title}
      </h3>

      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 select-none touch-none"
      >
        {/* Before Image (Base layer - shows when slider is slid to the right) */}
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={beforeImage}
            alt="Before"
            fill
            sizes="(max-w-7xl) 100vw"
            className="object-cover"
            priority
          />
          {/* Label Before */}
          <span className="absolute bottom-4 left-4 rounded bg-black/75 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            {t.gallery.beforeLabel}
          </span>
        </div>

        {/* After Image (Clipped overlay layer - shows when slider is slid to the left) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Container size must match parent to prevent image stretching */}
          <div className="absolute inset-0 h-full w-[100vw] min-w-[300px] sm:min-w-[600px] md:min-w-[800px] lg:min-w-[1200px]" style={{ width: containerRef.current?.getBoundingClientRect().width }}>
            <Image
              src={afterImage}
              alt="After"
              fill
              sizes="(max-w-7xl) 100vw"
              className="object-cover"
            />
          </div>
          {/* Label After */}
          <span className="absolute bottom-4 right-4 rounded bg-orange-600/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            {t.gallery.afterLabel}
          </span>
        </div>

        {/* Sliding Divider Bar */}
        <div
          className="absolute top-0 bottom-0 z-30 w-1 cursor-ew-resize bg-white dark:bg-orange-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] touch-none"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
          }}
        >
          {/* Central Handle Button */}
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-orange-600 text-white shadow-xl dark:border-orange-500 dark:bg-zinc-950 transition-colors">
            <svg
              className="h-5 w-5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8 9l-4 4 4 4m8 0l4-4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
