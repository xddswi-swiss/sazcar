'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveJob(formData: FormData) {
  const id = formData.get('id') as string | null;
  const department = formData.get('department') as string;
  const pensum = formData.get('pensum') as string;
  const employment_type = formData.get('employment_type') as string;
  const hours_per_week_raw = formData.get('hours_per_week') as string;
  const is_active = formData.get('is_active') === 'on';
  const description = ((formData.get('description') as string) ?? '').trim();
  const tasks = formData
    .getAll('tasks')
    .map((r) => (r as string).trim())
    .filter(Boolean);
  const requirements = formData
    .getAll('requirements')
    .map((r) => (r as string).trim())
    .filter(Boolean);

  if (!department || !pensum || !employment_type) {
    return { error: 'Bitte füllen Sie alle erforderlichen Felder aus.' };
  }

  const jobData = {
    department,
    pensum,
    employment_type,
    hours_per_week: hours_per_week_raw ? parseFloat(hours_per_week_raw) : null,
    description,
    tasks,
    requirements,
    is_active,
  };

  const supabase = await createClient();

  let error;
  if (id) {
    const { error: err } = await supabase.from('job_openings').update(jobData).eq('id', id);
    error = err;
  } else {
    const { count } = await supabase
      .from('job_openings')
      .select('id', { count: 'exact', head: true });
    const { error: err } = await supabase
      .from('job_openings')
      .insert([{ ...jobData, sort_order: count ?? 0 }]);
    error = err;
  }

  if (error) {
    console.error(
      `Error saving job opening: code=${error.code} message=${error.message} details=${error.details} hint=${error.hint}`
    );
    return { error: 'Fehler beim Speichern der Stelle in der Datenbank.' };
  }

  revalidatePath('/admin/jobs');
  revalidatePath('/karriere');
  return { success: true };
}

export async function deleteJob(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('job_openings').delete().eq('id', id);

  if (error) {
    console.error('Error deleting job opening:', error);
    return { error: 'Fehler beim Löschen der Stelle.' };
  }

  revalidatePath('/admin/jobs');
  revalidatePath('/karriere');
  return { success: true };
}

export async function reorderJob(idA: string, orderA: number, idB: string, orderB: number) {
  const supabase = await createClient();

  const { error: errA } = await supabase.from('job_openings').update({ sort_order: orderB }).eq('id', idA);
  const { error: errB } = await supabase.from('job_openings').update({ sort_order: orderA }).eq('id', idB);

  if (errA || errB) {
    console.error('Error reordering job openings:', errA || errB);
    return { error: 'Fehler beim Ändern der Reihenfolge.' };
  }

  revalidatePath('/admin/jobs');
  revalidatePath('/karriere');
  return { success: true };
}

export async function toggleJobActive(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase.from('job_openings').update({ is_active }).eq('id', id);

  if (error) {
    console.error('Error toggling job opening state:', error);
    return { error: 'Fehler beim Aktualisieren des Status.' };
  }

  revalidatePath('/admin/jobs');
  revalidatePath('/karriere');
  return { success: true };
}
