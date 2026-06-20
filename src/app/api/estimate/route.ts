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

    const { data, error } = await resend.emails.send({
      from: "SazCar Garage <onboarding@resend.dev>", // default sender for dev accounts
      to: "info@sazcar.ch", // Replace with your actual email or recipient
      subject: `Yeni Teklif Talebi: ${name} - ${car}`,
      html: emailHtml,
      attachments: attachments,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Estimate API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
