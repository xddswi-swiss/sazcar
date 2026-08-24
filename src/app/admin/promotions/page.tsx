import { createClient } from '@/utils/supabase/server';
import PromotionsManagement from './PromotionsManagement';

export const revalidate = 0;

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Aktionen verwalten</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verwalten Sie das Aktions- &amp; Rabatt-Badge, das im Hero-Bereich der Website erscheint.
          </p>
        </div>
      </div>

      <PromotionsManagement initialPromotions={promotions || []} />
    </div>
  );
}
