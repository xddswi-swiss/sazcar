import { createClient } from '@/utils/supabase/server';
import InquiriesManagement from './InquiriesManagement';

export const revalidate = 0;

export default async function InquiriesPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from('car_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Fahrzeug-Anfragen & Probefahrten</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Übersicht aller eingegangenen Kundenanfragen für Ihre Occasionen.
          </p>
        </div>
      </div>

      <InquiriesManagement initialInquiries={inquiries || []} />
    </div>
  );
}
