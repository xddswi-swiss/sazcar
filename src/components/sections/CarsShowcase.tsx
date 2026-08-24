import { createClient } from '@/utils/supabase/server';
import CarsShowcaseClient from './CarsShowcaseClient';

export default async function CarsShowcase() {
  const supabase = await createClient();

  const { data: cars } = await supabase
    .from('cars_for_sale')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (!cars || cars.length === 0) {
    return null;
  }

  return <CarsShowcaseClient cars={cars} />;
}
