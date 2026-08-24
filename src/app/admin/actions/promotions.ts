'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function savePromotion(formData: FormData) {
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const original_price_raw = formData.get('original_price') as string;
  const discounted_price_raw = formData.get('discounted_price') as string;
  const discount_percent_raw = formData.get('discount_percent') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const is_active = formData.get('is_active') === 'on';
  const badge_type = formData.get('badge_type') as string;

  if (!title || !start_date || !end_date || !badge_type) {
    return { error: 'Bitte füllen Sie alle erforderlichen Felder aus.' };
  }
  if (end_date < start_date) {
    return { error: 'Das Enddatum darf nicht vor dem Startdatum liegen.' };
  }

  const promotionData = {
    title,
    description: description || null,
    original_price: original_price_raw ? parseFloat(original_price_raw) : null,
    discounted_price: discounted_price_raw ? parseFloat(discounted_price_raw) : null,
    discount_percent: discount_percent_raw ? parseInt(discount_percent_raw) : null,
    start_date,
    end_date,
    is_active,
    badge_type,
  };

  const supabase = await createClient();

  let error;
  if (id) {
    const { error: err } = await supabase
      .from('promotions')
      .update(promotionData)
      .eq('id', id);
    error = err;
  } else {
    const { error: err } = await supabase
      .from('promotions')
      .insert([promotionData]);
    error = err;
  }

  if (error) {
    console.error('Error saving promotion:', error);
    return { error: 'Fehler beim Speichern der Aktion in der Datenbank.' };
  }

  revalidatePath('/admin/promotions');
  revalidatePath('/');
  return { success: true };
}

export async function deletePromotion(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting promotion:', error);
    return { error: 'Fehler beim Löschen der Aktion.' };
  }

  revalidatePath('/admin/promotions');
  revalidatePath('/');
  return { success: true };
}

export async function togglePromotionActive(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('promotions')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    console.error('Error toggling promotion state:', error);
    return { error: 'Fehler beim Aktualisieren des Aktionsstatus.' };
  }

  revalidatePath('/admin/promotions');
  revalidatePath('/');
  return { success: true };
}
