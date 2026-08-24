import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

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

    // Send email notification via Resend if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'SazCar Garage <onboarding@resend.dev>';
        const toEmail = process.env.RESEND_TO_EMAIL || 'sazcargmbh@gmail.com';

        const servicesList = selected_services && selected_services.length > 0
          ? selected_services.join(', ')
          : 'Keine Dienstleistung ausgewählt';

        const photosList = image_urls && image_urls.length > 0
          ? image_urls.map((url: string, i: number) => `<a href="${url}" target="_blank">Foto ${i + 1}</a>`).join(' | ')
          : 'Keine Fotos hochgeladen';

        const emailHtml = `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #dc2626; margin-top: 0; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">Neue Online-Terminanfrage</h2>
            <p style="margin: 15px 0;"><strong>Kundenname:</strong> ${customer_name}</p>
            <p style="margin: 15px 0;"><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p style="margin: 15px 0;"><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 15px 0;"><strong>Fahrzeugdaten:</strong> ${vehicle_info}</p>
            <p style="margin: 15px 0;"><strong>Gewünschte Services:</strong> ${servicesList}</p>
            <p style="margin: 15px 0;"><strong>Wunschtermin:</strong> ${preferred_date} - ${preferred_time}</p>
            <p style="margin: 15px 0;"><strong>Schadensbeschreibung / Bemerkungen:</strong></p>
            <blockquote style="background: #f8fafc; padding: 12px 15px; border-left: 4px solid #dc2626; border-radius: 4px; margin: 15px 0; font-style: italic;">
              ${(notes || 'Keine Bemerkungen').replace(/\n/g, '<br/>')}
            </blockquote>
            <p style="margin: 15px 0; border-top: 1px solid #e2e8f0; pt: 15px;"><strong>Schadenfotos:</strong> ${photosList}</p>
          </div>
        `;

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `Neue Terminanfrage von ${customer_name}`,
          html: emailHtml,
        });
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
      }
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
