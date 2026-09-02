'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { runMutation } from './db-helpers';

export async function saveCar(formData: FormData) {
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  let brand = formData.get('brand') as string;
  let model = formData.get('model') as string;
  const subtitle = formData.get('subtitle') as string | null;
  const year = parseInt(formData.get('year') as string);
  const mileage = parseInt(formData.get('mileage') as string);
  const price = parseFloat(formData.get('price') as string);
  const fuel_type = formData.get('fuel_type') as string;
  const transmission = formData.get('transmission') as string;
  const description = (formData.get('description') as string) || '';
  const image_urls_raw = formData.get('image_urls') as string;

  // Auto-fill brand & model if left blank
  if ((!brand || !model) && title) {
    const parts = title.trim().split(' ');
    if (!brand) brand = parts[0] || 'Fahrzeug';
    if (!model) model = parts.slice(1).join(' ') || title;
  }

  // New automation & equipment fields
  const ribbon_tier = formData.get('ribbon_tier') as string | null;
  const warranty_tier = formData.get('warranty_tier') as string | null;
  const badges_raw = formData.get('badges') as string | null;
  const power = formData.get('power') as string | null;
  const consumption = formData.get('consumption') as string | null;
  const drive_type = formData.get('drive_type') as string | null;
  const body_type = formData.get('body_type') as string | null;

  const optional_equipment_raw = formData.get('optional_equipment') as string | null;
  const standard_equipment_raw = formData.get('standard_equipment') as string | null;

  if (!title || isNaN(year) || isNaN(mileage) || isNaN(price) || !fuel_type || !transmission) {
    return { error: 'Bitte füllen Sie alle erforderlichen Felder aus.' };
  }

  const image_urls = image_urls_raw ? JSON.parse(image_urls_raw) : [];
  const badges = badges_raw ? JSON.parse(badges_raw) : [];
  const optional_equipment = optional_equipment_raw ? JSON.parse(optional_equipment_raw) : [];
  const standard_equipment = standard_equipment_raw ? JSON.parse(standard_equipment_raw) : [];

  const supabase = await createClient();

  const carData: Record<string, any> = {
    title,
    subtitle,
    brand,
    model,
    year,
    mileage,
    price,
    fuel_type,
    transmission,
    description,
    image_urls,
    ribbon_tier,
    warranty_tier,
    badges,
    power,
    consumption,
    drive_type,
    body_type,
    optional_equipment,
    standard_equipment,
  };

  let error;
  if (id) {
    const res = await supabase.from('cars_for_sale').update(carData).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('cars_for_sale').insert([carData]);
    error = res.error;
  }

  if (error) {
    console.error('Error saving car to Supabase:', error);
    return { error: `Fehler beim Speichern in Supabase: ${error.message}` };
  }

  revalidatePath('/admin/cars');
  revalidatePath('/occasionen/preview');
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
