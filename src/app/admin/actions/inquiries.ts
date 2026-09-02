'use server';

import { createClient } from '@/utils/supabase/server';
import { runMutation } from './db-helpers';

export async function updateInquiryStatus(id: string, status: string) {
  return runMutation(
    (s) => s.from('car_inquiries').update({ status }).eq('id', id),
    'Fehler beim Aktualisieren des Anfragestatus.',
    ['/admin/inquiries']
  );
}

export async function deleteInquiry(id: string) {
  return runMutation(
    (s) => s.from('car_inquiries').delete().eq('id', id),
    'Fehler beim Löschen der Anfrage.',
    ['/admin/inquiries']
  );
}
