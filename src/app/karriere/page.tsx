import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Briefcase, Clock, Send, Check } from 'lucide-react';
import {
  EMPLOYMENT_TYPE_LABELS,
  JOB_AD_INTRO,
  jobAdTitle,
  jobMailtoHref,
  type JobOpening,
} from '@/content/jobs';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Karriere | Autogarage & Carrosserie',
  description: 'Offene Stellen bei der SAZCAR GMBH.',
};

export default async function KarrierePage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('job_openings')
    .select('*')
    .order('sort_order', { ascending: true });

  const openings = (jobs || []) as JobOpening[];

  return (
    <div
      className="min-h-screen flex flex-col text-slate-800"
      style={{
        backgroundImage:
          'linear-gradient(rgba(248,250,252,0.82), rgba(248,250,252,0.82)), url(/karriere-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />

      <main
        className="flex-1 w-full"
        style={{
          padding: 'clamp(7rem, 5rem + 6vw, 11rem) clamp(1rem, 0.429rem + 2.857vw, 3rem) clamp(4rem, 3rem + 4vw, 6rem)',
        }}
      >
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      <h1
        className="font-black tracking-tight text-slate-900"
        style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)' }}
      >
        Karriere
      </h1>
      <p className="text-slate-600 mt-3" style={{ fontSize: 'clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem)', lineHeight: 1.6, maxWidth: '620px' }}>
        {JOB_AD_INTRO}
      </p>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {openings.length > 0 ? (
          openings.map((job, index) => (
            <div
              key={job.id}
              className={`border rounded-2xl shadow-xs transition-colors duration-300 ${
                index % 2 === 1
                  ? 'card-tint-red border-red-100'
                  : 'bg-white border-black hover:border-red-600'
              }`}
              style={{ padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2.25rem)' }}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 shrink-0">
                  <Briefcase className="w-4.5 h-4.5" />
                </span>
                <h2
                  className="font-bold text-slate-900 tracking-tight"
                  style={{ fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.25rem)' }}
                >
                  {jobAdTitle(job)}
                </h2>
              </div>
              <p
                className="flex items-center gap-1.5 text-slate-500 mt-2"
                style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
              >
                <Clock className="w-3.5 h-3.5" />
                {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                {job.hours_per_week ? ` · ${job.hours_per_week} Std./Woche` : ''}
              </p>

              {job.description && (
                <p
                  className="text-slate-600 mt-4"
                  style={{ fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)', lineHeight: 1.6 }}
                >
                  {job.description}
                </p>
              )}

              {job.tasks && job.tasks.length > 0 && (
                <div className="mt-4">
                  <h3
                    className="font-bold text-slate-900 uppercase tracking-wide"
                    style={{ fontSize: 'clamp(0.6875rem, 0.67rem + 0.1vw, 0.75rem)' }}
                  >
                    Typische Aufgaben
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {job.tasks.map((task, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-700 font-medium"
                        style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
                      >
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div className="mt-4">
                  <h3
                    className="font-bold text-slate-900 uppercase tracking-wide"
                    style={{ fontSize: 'clamp(0.6875rem, 0.67rem + 0.1vw, 0.75rem)' }}
                  >
                    Anforderungen &amp; Erwartungen
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {job.requirements.map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-slate-700 font-medium"
                        style={{ fontSize: 'clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem)' }}
                      >
                        <Check className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a
                href={jobMailtoHref(job)}
                className="mt-5 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
                style={{ fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}
              >
                <Send className="w-4 h-4" />
                <span>Jetzt bewerben</span>
              </a>
            </div>
          ))
        ) : (
          <p className="text-slate-500" style={{ fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}>
            Aktuell keine offenen Stellen. Initiativbewerbungen sind jederzeit willkommen.
          </p>
        )}
      </div>
      </div>
      </main>

      <Footer />
    </div>
  );
}
