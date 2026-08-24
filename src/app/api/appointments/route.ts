import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      email,
      vehicle_info,
      selected_services,
      preferred_date,
      preferred_time,
      notes,
      image_urls,
    } = body;

    // Server-side validation
    if (!customer_name || !phone || !email || !vehicle_info || !preferred_date || !preferred_time) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle erforderlichen Felder aus.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from('appointments').insert([
      {
        customer_name,
        phone,
        email,
        vehicle_info,
        selected_services: selected_services || [],
        preferred_date,
        preferred_time,
        notes: notes || null,
        image_urls: image_urls || [],
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Error inserting appointment in database:', error);
      return NextResponse.json(
        { error: 'Fehler beim Speichern der Terminanfrage.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Ein interner Serverfehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
