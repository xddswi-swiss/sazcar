import { createClient } from '@/utils/supabase/server';
import JobsManagement from './JobsManagement';

export const revalidate = 0;

export default async function JobsPage() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from('job_openings')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Stellenangebote verwalten</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Bereich, Pensum und Einsatzart auswählen — das Inserat wird daraus automatisch erstellt.
        </p>
      </div>

      <JobsManagement initialJobs={jobs || []} />
    </div>
  );
}
