'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAppointmentStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await createClient();

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating appointment:', error);
    return { error: 'Fehler beim Aktualisieren des Terminstatus.' };
  }

  revalidatePath('/admin/appointments');
  revalidatePath('/admin/dashboard');
  return { success: true };
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting appointment:', error);
    return { error: 'Fehler beim Löschen des Termins.' };
  }

  revalidatePath('/admin/appointments');
  revalidatePath('/admin/dashboard');
  return { success: true };
}
