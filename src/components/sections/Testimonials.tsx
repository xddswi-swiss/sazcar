import { Star, Quote } from 'lucide-react';
import { reviews, googleRating, googleReviewCount, googleReviewsUrl } from '@/content/reviews';

export default function Testimonials() {
  return (
    <section
      id="bewertungen"
      className="relative w-full overflow-hidden bg-white text-slate-800 section-pad"
    >
      <div className="mx-auto section-container-1200">
        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4rem)' }}
        >
          <div className="text-left">
            <h2
              className="font-black tracking-tight text-slate-900 section-heading-size"
            >
              Was unsere Kunden sagen
            </h2>
            <p
              className="text-slate-600 font-normal"
              style={{
                fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)',
                marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)',
                lineHeight: 1.5,
              }}
            >
              Echte Bewertungen von echten Kunden auf Google.
            </p>
          </div>

          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl px-4 py-3 transition-all"
          >
            <span className="font-black text-slate-900" style={{ fontSize: 'clamp(1.5rem, 1.4rem + 0.5vw, 1.875rem)' }}>
              {googleRating.toFixed(1)}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <span className="text-xs text-slate-600 font-normal">{googleReviewCount} Google-Bewertungen</span>
            </span>
          </a>
        </div>

        {/* Review Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(1rem, 0.75rem + 0.625vw, 1.5rem)' }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col border border-slate-200 rounded-3xl bg-white hover:border-amber-300 hover:shadow-md transition-all duration-300"
              style={{ padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2rem)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold text-sm shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm leading-tight">{review.name}</p>
                    <p className="text-slate-500 text-xs">{review.timeAgo}</p>
                  </div>
                </div>
                <Quote className="w-5 h-5 text-slate-200 shrink-0" />
              </div>

              <div className="flex gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
