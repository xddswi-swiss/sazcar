import { createClient } from '@/utils/supabase/server';
import AppointmentsList from './AppointmentsList';

export const revalidate = 0;

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Terminanfragen</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Verwalten Sie eingehende Terminanfragen und Schadensmeldungen von Kunden.
        </p>
      </div>

      <AppointmentsList initialAppointments={appointments || []} />
    </div>
  );
}
