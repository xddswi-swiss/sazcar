import Image from 'next/image';
import { Car } from 'lucide-react';

interface LogoProps {
  className?: string;
  /** 'default' for light backgrounds (header). 'inverted' for the red footer. */
  variant?: 'default' | 'inverted';
}

/**
 * Logo component with fallback.
 * If public/logo.svg exists, it renders via next/image.
 * Otherwise, renders a styled text + icon fallback.
 *
 * Colors are chosen from `variant`, not `prefers-color-scheme` — the two
 * usages sit on fixed backgrounds (white header, red footer) regardless of
 * the visitor's OS theme, so tying color to dark-mode made the text vanish
 * on a light header for dark-mode users.
 */
export default function Logo({ className, variant = 'default' }: LogoProps) {
  const inverted = variant === 'inverted';

  return (
    <div className={className}>
      {/* Try to load the user-provided SVG logo first */}
      <picture>
        {/* next/image with fallback: onError hides it and shows the fallback */}
        <Image
          src="/logo.svg"
          alt="Autogarage Logo"
          width={180}
          height={48}
          className="h-10 w-auto hidden logo-image"
          priority
          onLoad={(e) => {
            // If loaded successfully, show image and hide fallback
            const img = e.currentTarget as HTMLImageElement;
            img.classList.remove('hidden');
            const fallback = img.closest('[data-logo-root]')?.querySelector('[data-logo-fallback]');
            if (fallback) (fallback as HTMLElement).style.display = 'none';
          }}
          onError={(e) => {
            // If loading fails, keep fallback visible
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </picture>

      {/* Fallback: styled text logo + car icon */}
      <div data-logo-root="" className="contents">
        <div data-logo-fallback="" className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${inverted ? 'bg-white' : 'bg-red-600'}`}>
            <Car className={`w-5 h-5 ${inverted ? 'text-red-600' : 'text-white'}`} />
          </div>
          <div className="flex flex-col leading-none">
            {/* fluid font: 16px@320 → 20px@1440 */}
            {/* slope=(20-16)/(1440-320)=0.00357 → 0.357vw, intercept=16-0.00357*320=14.86px≈0.929rem */}
            <span className="flex items-baseline gap-1.5">
              <span
                className={`font-black tracking-tight ${inverted ? 'text-white' : 'text-slate-900'}`}
                style={{ fontSize: 'clamp(1rem, 0.929rem + 0.357vw, 1.25rem)' }}
              >
                AUTOGARAGE
              </span>
              <span
                className={`font-bold tracking-wide ${inverted ? 'text-red-100' : 'text-red-600'}`}
                style={{ fontSize: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.9375rem)' }}
              >
                SAZCAR
              </span>
            </span>
            <span className={`text-[10px] font-semibold tracking-widest uppercase ${inverted ? 'text-red-100' : 'text-red-600'}`}>
              & Carrosserie
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
