import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Calendar, 
  Wrench, 
  Car, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import ProjectsList from './ProjectsList';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch counts
  const { count: pendingAppointmentsCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: activeProjectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');

  const { count: activeCarsCount } = await supabase
    .from('cars_for_sale')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Fetch recent appointments (last 5)
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch recent projects (last 20)
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Offene Termine</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{pendingAppointmentsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aktive Aufträge</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{activeProjectsCount || 0}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inserierte Autos</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{activeCarsCount || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Letzte Terminanfragen</span>
            </h3>
            <Link 
              href="/admin/appointments" 
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <span>Alle ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {recentAppointments && recentAppointments.length > 0 ? (
              recentAppointments.map((appt) => (
                <div key={appt.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{appt.customer_name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{appt.vehicle_info} • {appt.preferred_date}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {appt.selected_services?.map((srv: string) => (
                        <span key={srv} className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`
                      text-xs px-2.5 py-1 rounded-full font-semibold border
                      ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900' : ''}
                      ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : ''}
                      ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' : ''}
                    `}>
                      {appt.status === 'pending' && 'Ausstehend'}
                      {appt.status === 'approved' && 'Bestätigt'}
                      {appt.status === 'rejected' && 'Abgelehnt'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Keine Terminanfragen vorhanden.
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <ProjectsList initialProjects={recentProjects || []} />
      </div>
    </div>
  );
}
