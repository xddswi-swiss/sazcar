import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, car, serviceType, message, date, photos } = body;

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("WARNING: RESEND_API_KEY is not set in environment variables. Running in development DEMO mode.");
      console.log("Estimate Request Details (Demo Mode):", {
        name,
        email,
        phone,
        car,
        serviceType,
        message,
        date,
        photosCount: photos?.length || 0,
      });
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ success: true, message: "Demo mode: request received successfully without API key" });
    }

    const resend = new Resend(resendApiKey);

    // Prepare attachments
    const attachments = (photos || []).map((photo: { name: string; base64: string }) => {
      // Split base64 header (e.g. data:image/png;base64,...)
      const parts = photo.base64.split(";base64,");
      const contentBase64 = parts[1] || parts[0];
      return {
        filename: photo.name || "attachment.jpg",
        content: contentBase64,
      };
    });

    const emailHtml = `
      <h2>SazCar Garage - Yeni Fiyat Teklifi ve Randevu Talebi</h2>
      <p><strong>Müşteri Adı:</strong> ${name}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Araç Bilgisi:</strong> ${car}</p>
      <p><strong>Talep Edilen Hizmet:</strong> ${serviceType}</p>
      <p><strong>Randevu Tercihi:</strong> ${date || "Belirtilmedi"}</p>
      <p><strong>Açıklama:</strong></p>
      <blockquote style="background: #f4f4f4; padding: 10px; border-left: 5px solid #ff6b00;">
        ${message.replace(/\n/g, "<br/>")}
      </blockquote>
      <p>Ekte ${attachments.length} adet hasar fotoğrafı bulunmaktadır.</p>
    `;

    const fromEmail = process.env.RESEND_FROM_EMAIL || "SazCar Garage <onboarding@resend.dev>";
    const toEmail = process.env.RESEND_TO_EMAIL || "sazcargmbh@gmail.com";

    let sendResult = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Yeni Teklif Talebi: ${name} - ${car}`,
      html: emailHtml,
      attachments: attachments,
    });

    if (sendResult.error) {
      console.error("Resend API Error:", sendResult.error);
      const errorMsg = sendResult.error.message || "";
      
      // Check for sandbox domain restriction
      if (errorMsg.includes("You can only send testing emails to your own email address")) {
        // Extract the email address inside the parentheses: e.g. (eren.yigit.aydin@gmail.com)
        const match = errorMsg.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          const fallbackEmail = match[1];
          console.log(`Sandbox restriction detected. Retrying with fallback email: ${fallbackEmail}`);
          
          const fallbackHtml = `
            <div style="background-color: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeeba; border-radius: 5px; margin-bottom: 20px; font-family: sans-serif;">
              <strong>⚠️ Resend Sandbox Hinweis (Entwickler-Modus):</strong><br/>
              Diese E-Mail wurde an Ihre registrierte Test-Adresse (<strong>${fallbackEmail}</strong>) gesendet, da Ihre Domain noch nicht verifiziert ist.<br/>
              Sobald Sie Ihre Domain bei <a href="https://resend.com/domains" target="_blank">resend.com/domains</a> verifizieren und die Absenderadresse im Code/Environment anpassen, werden die E-Mails direkt an <strong>${toEmail}</strong> gesendet.
            </div>
            ${emailHtml}
          `;

          const retryResult = await resend.emails.send({
            from: fromEmail,
            to: fallbackEmail,
            subject: `[TEST-SANDBOX] Yeni Teklif Talebi: ${name} - ${car}`,
            html: fallbackHtml,
            attachments: attachments,
          });

          if (!retryResult.error) {
            return NextResponse.json({ 
              success: true, 
              sandboxFallback: true, 
              recipient: fallbackEmail,
              data: retryResult.data 
            });
          } else {
            console.error("Resend Fallback Error:", retryResult.error);
            return NextResponse.json({ error: retryResult.error.message }, { status: 400 });
          }
        }
      }
      return NextResponse.json({ error: sendResult.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: sendResult.data });
  } catch (error: any) {
    console.error("Estimate API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
