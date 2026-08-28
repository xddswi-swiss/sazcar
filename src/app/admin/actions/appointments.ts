'use server';

import { runMutation } from './db-helpers';

export async function updateAppointmentStatus(id: string, status: 'approved' | 'rejected') {
  return runMutation(
    (s) => s.from('appointments').update({ status }).eq('id', id),
    'Fehler beim Aktualisieren des Terminstatus.',
    ['/admin/appointments', '/admin/dashboard']
  );
}

export async function deleteAppointment(id: string) {
  return runMutation(
    (s) => s.from('appointments').delete().eq('id', id),
    'Fehler beim Löschen des Termins.',
    ['/admin/appointments', '/admin/dashboard']
  );
}
