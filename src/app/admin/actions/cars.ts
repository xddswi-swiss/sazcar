'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { runMutation } from './db-helpers';

export async function saveCar(formData: FormData) {
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const brand = formData.get('brand') as string;
  const model = formData.get('model') as string;
  const year = parseInt(formData.get('year') as string);
  const mileage = parseInt(formData.get('mileage') as string);
  const price = parseFloat(formData.get('price') as string);
  const fuel_type = formData.get('fuel_type') as string;
  const transmission = formData.get('transmission') as string;
  const description = formData.get('description') as string;
  const image_urls_raw = formData.get('image_urls') as string;

  if (!title || !brand || !model || isNaN(year) || isNaN(mileage) || isNaN(price) || !fuel_type || !transmission) {
    return { error: 'Bitte füllen Sie alle erforderlichen Felder aus.' };
  }

  const image_urls = image_urls_raw ? JSON.parse(image_urls_raw) : [];

  const supabase = await createClient();

  const carData = {
    title,
    brand,
    model,
    year,
    mileage,
    price,
    fuel_type,
    transmission,
    description,
    image_urls,
  };

  let error;
  if (id) {
    const { error: err } = await supabase
      .from('cars_for_sale')
      .update(carData)
      .eq('id', id);
    error = err;
  } else {
    const { error: err } = await supabase
      .from('cars_for_sale')
      .insert([carData]);
    error = err;
  }

  if (error) {
    console.error('Error saving car:', error);
    return { error: 'Fehler beim Speichern des Fahrzeugs in der Datenbank.' };
  }

  revalidatePath('/admin/cars');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCar(id: string) {
  return runMutation(
    (s) => s.from('cars_for_sale').delete().eq('id', id),
    'Fehler beim Löschen des Fahrzeugs.',
    ['/admin/cars', '/']
  );
}

export async function toggleCarActive(id: string, is_active: boolean) {
  return runMutation(
    (s) => s.from('cars_for_sale').update({ is_active }).eq('id', id),
    'Fehler beim Aktualisieren des Fahrzeugstatus.',
    ['/admin/cars', '/']
  );
}
