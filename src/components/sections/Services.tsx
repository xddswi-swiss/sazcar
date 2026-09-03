'use client';

import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/content/services';
import { motion } from 'framer-motion';
import SazcarVanMascot from '@/components/ui/SazcarVanMascot';
import {
  Wrench,
  Paintbrush,
  Settings,
  ClipboardCheck,
  CircleDot,
  Sparkles,
  CloudRain,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Paintbrush,
  Settings,
  ClipboardCheck,
  CircleDot,
  Sparkles,
  CloudRain,
};

// 3-way color cycle (red/black/gold — the site's accent triad) so cards in a row
// each read as a distinct color instead of repeating the same red accent 7 times.
const cardColors = [
  {
    iconBg: 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white',
    border: 'border-slate-200 hover:border-red-400',
    top: 'border-t-red-600',
    bullet: 'bg-red-600',
    hoverTitle: 'group-hover:text-red-600',
  },
  {
    iconBg: 'bg-slate-100 text-slate-900 border-slate-200 group-hover:bg-slate-900 group-hover:text-white',
    border: 'border-slate-200 hover:border-slate-400',
    top: 'border-t-slate-900',
    bullet: 'bg-slate-900',
    hoverTitle: 'group-hover:text-slate-900',
  },
  {
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-400 group-hover:text-slate-950',
    border: 'border-slate-200 hover:border-amber-400',
    top: 'border-t-amber-500',
    bullet: 'bg-amber-500',
    hoverTitle: 'group-hover:text-amber-600',
  },
];

export default function Services() {
  return (
    <section
      id="dienstleistungen"
      className="relative w-full overflow-hidden bg-slate-50 text-slate-800"
      style={{
        padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      {/* ── Background Sketch Illustration (Watermark style, multiplied to blend with slate-50) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.25] sm:opacity-[0.35] md:opacity-[0.45] mix-blend-multiply"
        aria-hidden="true"
      >
        <Image
          src="/services-bg.jpg"
          alt="Services Sketch Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4.5rem)' }}>
          <div className="flex items-center gap-3">
            <h2
              className="font-black tracking-tight text-slate-900"
              style={{
                fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)',
              }}
            >
              Dienstleistungen
            </h2>
            <SazcarVanMascot />
          </div>
          <p
            className="text-slate-600 font-normal"
            style={{
              fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)',
              marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)',
              lineHeight: 1.5,
            }}
          >
            Professioneller Fahrzeugservice auf höchstem Niveau.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(1rem, 0.75rem + 0.625vw, 1.5rem)' }}
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName] || Wrench;
            const color = cardColors[index % cardColors.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 1, 0.5, 1] }}
                className={`
                  group relative border-2 border-t-4 rounded-3xl overflow-hidden
                  transition-colors duration-300 shadow-sm hover:shadow-md
                  flex flex-col justify-between bg-white/80 will-change-transform transform-gpu
                  ${color.border} ${color.top}
                `}
                style={{
                  padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2.25rem)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl w-fit shrink-0 transition-all duration-300 border ${color.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3
                      className={`font-bold text-slate-900 tracking-tight transition-colors flex-1 min-w-0 ${color.hoverTitle}`}
                      style={{
                        fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.25rem)',
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    className="text-slate-600"
                    style={{
                      fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)',
                      lineHeight: 1.6,
                    }}
                  >
                    {service.shortDescription}
                  </p>
                </div>

                {/* Features List */}
                <ul
                  className="grid grid-cols-1 gap-y-2.5 border-t border-slate-100 pt-5"
                  style={{
                    marginTop: 'clamp(1.5rem, 1.25rem + 0.5vw, 2rem)',
                  }}
                >
                  {service.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-slate-700 font-medium"
                      style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${color.bullet}`} />
                      <span className="line-clamp-2">{feat}</span>
                    </li>
                  ))}
                </ul>

                {service.id === 'hagelschaden-instandsetzung' && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <Link
                      href="/hagelschaden"
                      className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 text-xs sm:text-sm transition-colors group"
                    >
                      <span>Alle Hagel-Techniken & 4-Schritte-Prozess ansehen</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
