import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      car_id,
      car_title,
      car_price,
      customer_name,
      customer_phone,
      customer_email,
      customer_message,
      turnstile_token,
    } = body;

    // Server-side validation
    if (!customer_name || !customer_phone || !customer_email) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle erforderlichen Felder aus (Name, Telefon, E-Mail).' },
        { status: 400 }
      );
    }

    // Verify Turnstile if secret key is configured
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!turnstile_token) {
        return NextResponse.json(
          { error: 'Sicherheitsprüfung fehlt. Bitte versuchen Sie es erneut.' },
          { status: 400 }
        );
      }

      try {
        const verifyRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: turnstileSecret,
              response: turnstile_token,
            }),
          }
        );

        const verifyJson = await verifyRes.json();
        if (!verifyJson.success) {
          console.warn('Turnstile verification failed for car inquiry:', verifyJson);
          return NextResponse.json(
            { error: 'Sicherheitsprüfung fehlgeschlagen.' },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error('Turnstile connection error:', err);
      }
    }

    const supabase = await createClient();

    // 1. Insert into Supabase car_inquiries table
    const { error: dbError } = await supabase.from('car_inquiries').insert([
      {
        car_id: car_id || null,
        car_title: car_title || 'Unbekanntes Fahrzeug',
        car_price: car_price || 'Auf Anfrage',
        customer_name,
        customer_phone,
        customer_email,
        customer_message: customer_message || null,
        status: 'pending',
      },
    ]);

    if (dbError) {
      console.error('Error inserting car inquiry into Supabase:', dbError);
    }

    // 2. Send email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'SAZCAR Occasionen <onboarding@resend.dev>';
        const toEmail = process.env.RESEND_TO_EMAIL || 'info@sazcar.ch';

        // Garage Owner Notification Email HTML
        const garageEmailHtml = `
          <div style="font-family: sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #ef4444; border-radius: 16px; background-color: #ffffff;">
            <div style="background-color: #fef2f2; padding: 16px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
              <h2 style="color: #dc2626; margin: 0; font-size: 20px;">🚗 Neue Fahrzeug-Anfrage / Probefahrt</h2>
              <p style="margin: 6px 0 0 0; color: #475569; font-size: 14px;"><strong>Fahrzeug:</strong> ${car_title} (${car_price})</p>
            </div>

            <h3 style="color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">Kundenangaben:</h3>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${customer_name}</p>
            <p style="margin: 10px 0;"><strong>Telefon:</strong> <a href="tel:${customer_phone}" style="color: #dc2626; text-decoration: none; font-weight: bold;">${customer_phone}</a></p>
            <p style="margin: 10px 0;"><strong>E-Mail:</strong> <a href="mailto:${customer_email}" style="color: #dc2626; text-decoration: none; font-weight: bold;">${customer_email}</a></p>
            
            <h3 style="color: #0f172a; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 20px;">Nachricht des Kunden:</h3>
            <blockquote style="background: #f8fafc; padding: 14px; border-left: 4px solid #e2e8f0; border-radius: 6px; margin: 10px 0; font-style: italic; color: #334155;">
              ${(customer_message || 'Keine Nachricht hinterlassen.').replace(/\n/g, '<br/>')}
            </blockquote>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
              SAZCAR Garage & Carrosserie | Automatische Benachrichtigung
            </div>
          </div>
        `;

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          replyTo: customer_email,
          subject: `🚗 Neue Fahrzeug-Anfrage: ${car_title} (${customer_name})`,
          html: garageEmailHtml,
        });

        // Customer Confirmation Receipt HTML
        const customerEmailHtml = `
          <div style="font-family: sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #dc2626; margin-top: 0; border-bottom: 2px solid #fee2e2; padding-bottom: 12px;">Bestätigung Ihrer Anfrage bei SAZCAR</h2>
            <p>Guten Tag ${customer_name},</p>
            <p>Vielen Dank für Ihr Interesse an unserem Fahrzeug <strong>${car_title}</strong>.</p>
            <p>Wir haben Ihre Anfrage für eine Besichtigung / Probefahrt erhalten und werden uns schnellstmöglich telefonisch oder per E-Mail bei Ihnen melden.</p>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 14px;">Zusammenfassung Ihrer Anfrage:</h3>
              <p style="margin: 6px 0; font-size: 13px;"><strong>Fahrzeug:</strong> ${car_title}</p>
              <p style="margin: 6px 0; font-size: 13px;"><strong>Preis:</strong> ${car_price}</p>
              <p style="margin: 6px 0; font-size: 13px;"><strong>Ihre Telefonnummer:</strong> ${customer_phone}</p>
            </div>

            <p style="font-size: 13px; color: #475569;">Mit freundlichen Grüssen,<br/><strong>SAZCAR Garage & Carrosserie Team</strong></p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              SAZCAR Garage & Carrosserie | Tel: +41 79 382 43 43 | E-Mail: info@sazcar.ch
            </p>
          </div>
        `;

        await resend.emails.send({
          from: fromEmail,
          to: customer_email,
          subject: `Ihre Anfrage für ${car_title} - SAZCAR Garage`,
          html: customerEmailHtml,
        });

      } catch (emailErr) {
        console.error('Error sending Resend emails for car inquiry:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error in /api/car-inquiry:', err);
    return NextResponse.json(
      { error: 'Ein interner Serverfehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
