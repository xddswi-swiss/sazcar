'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { runMutation } from './db-helpers';

export async function createProject(formData: FormData) {
  const brand = formData.get('brand') as string;
  const model = formData.get('model') as string;
  const license_plate = formData.get('license_plate') as string;
  const entry_date = formData.get('entry_date') as string;
  const before_images_raw = formData.get('before_images') as string;
  const after_images_raw = formData.get('after_images') as string;
  const services_done_raw = formData.get('services_done') as string;
  const is_published = formData.get('is_published') !== 'false'; // Default to true if not explicitly false

  if (!brand) {
    return { error: 'Marke ist erforderlich.' };
  }

  const before_image_urls = before_images_raw ? JSON.parse(before_images_raw) : [];
  const after_image_urls = after_images_raw ? JSON.parse(after_images_raw) : [];
  const services_done = services_done_raw ? JSON.parse(services_done_raw) : [];

  const supabase = await createClient();

  const { error } = await supabase
    .from('projects')
    .insert([
      {
        brand,
        model: model || '',
        license_plate: license_plate || '',
        entry_date: entry_date ? new Date(entry_date).toISOString() : new Date().toISOString(),
        before_image_urls,
        after_image_urls,
        services_done,
        status: after_image_urls.length > 0 ? 'completed' : 'in_progress',
        is_published,
        completion_date: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Error inserting project:', error);
    return { error: 'Fehler beim Speichern des Auftrags in der Datenbank.' };
  }

  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
}

export async function completeProject(id: string, formData: FormData) {
  const services_done_raw = formData.get('services_done') as string;
  const after_images_raw = formData.get('after_images') as string;
  const is_published = formData.get('is_published') === 'true';

  const services_done = services_done_raw ? JSON.parse(services_done_raw) : [];
  const after_image_urls = after_images_raw ? JSON.parse(after_images_raw) : [];

  const supabase = await createClient();

  const { error } = await supabase
    .from('projects')
    .update({
      services_done,
      after_image_urls,
      status: 'completed',
      completion_date: new Date().toISOString(),
      is_published,
    })
    .eq('id', id);

  if (error) {
    console.error('Error completing project:', error);
    return { error: 'Fehler beim Abschliessen des Auftrags.' };
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  redirect('/admin/dashboard');
}

export async function deleteProject(id: string) {
  return runMutation(
    (s) => s.from('projects').delete().eq('id', id),
    'Fehler beim Löschen des Auftrags.',
    ['/admin/dashboard', '/']
  );
}

export async function toggleProjectPublish(id: string, currentPublished: boolean) {
  return runMutation(
    (s) => s.from('projects').update({ is_published: !currentPublished }).eq('id', id),
    'Fehler beim Verändern des Veröffentlichungsstatus.',
    ['/admin/dashboard', '/']
  );
}
