import { createClient } from '@/utils/supabase/server';
import BeforeAfterClient from './BeforeAfterClient';

export default async function BeforeAfter() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('id, brand, model, license_plate, services_done, before_image_urls, after_image_urls')
    .eq('is_published', true)
    .eq('status', 'completed')
    .order('completion_date', { ascending: false })
    .limit(6);

  // If no published projects, hide section entirely
  if (!projects || projects.length === 0) {
    return null;
  }

  return <BeforeAfterClient projects={projects} />;
}
