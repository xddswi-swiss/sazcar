import { createClient } from '@/utils/supabase/server';
import CarsManagement from './CarsManagement';

export const revalidate = 0;

export default async function CarsPage() {
  const supabase = await createClient();

  const { data: cars } = await supabase
    .from('cars_for_sale')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Occasionen verwalten</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Fügen Sie Fahrzeuge hinzu, bearbeiten Sie Details oder löschen Sie verkaufte Autos.
          </p>
        </div>
      </div>

      <CarsManagement initialCars={cars || []} />
    </div>
  );
}
