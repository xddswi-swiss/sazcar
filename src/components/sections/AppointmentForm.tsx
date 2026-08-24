'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { uploadImage } from '@/app/actions/upload';
import { services } from '@/content/services';
import {
  CalendarDays,
  Clock,
  Car,
  User,
  Phone,
  Mail,
  MessageSquare,
  Camera,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Send,
  Settings,
} from 'lucide-react';

async function compressImage(file: File, maxW = 1200, maxH = 1200, quality = 0.8): Promise<File> {
  if (typeof window === 'undefined') return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxW) { height = Math.round((height * maxW) / width); width = maxW; }
        } else {
          if (height > maxH) { width = Math.round((width * maxH) / height); height = maxH; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg', lastModified: Date.now() }));
            } else resolve(file);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

async function submitAppointment(data: {
  customer_name: string;
  phone: string;
  email: string;
  vehicle_info: string;
  selected_services: string[];
  preferred_date: string;
  preferred_time: string;
  notes: string;
  image_urls: string[];
}) {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default function AppointmentForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleServiceToggle = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i]);
        const formData = new FormData();
        formData.append('file', compressed);
        const res = await uploadImage(formData);
        if (res.success && res.url) {
          setImages((prev) => [...prev, res.url]);
        } else {
          setError(res.error || 'Fehler beim Hochladen.');
        }
      }
    } catch { setError('Fehler bei der Bildverarbeitung.'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const form = e.currentTarget;
      
      const getVal = (name: string) => {
        const el = form.elements.namedItem(name);
        return el ? (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value : '';
      };

      const data = {
        customer_name: getVal('customer_name'),
        phone: getVal('phone'),
        email: getVal('email'),
        vehicle_info: getVal('vehicle_info'),
        selected_services: selectedServices,
        preferred_date: getVal('preferred_date'),
        preferred_time: getVal('preferred_time'),
        notes: getVal('notes'),
        image_urls: images,
      };

      if (!data.customer_name || !data.phone || !data.email || !data.vehicle_info || !data.preferred_date || !data.preferred_time) {
        setError('Bitte füllen Sie alle Pflichtfelder (*) aus.');
        return;
      }

      startTransition(async () => {
        try {
          const result = await submitAppointment(data);
          if (result && result.error) {
            setError(result.error);
          } else if (result && result.success) {
            setSuccess(true);
          } else {
            setError('Verbindung zum Server fehlgeschlagen (Keine gültige Antwort).');
          }
        } catch (err) {
          console.error('Submit error:', err);
          setError('Netzwerkfehler: Verbindung zum Server fehlgeschlagen.');
        }
      });
    } catch (err) {
      console.error('Form processing error:', err);
      setError('Formularfehler: Fehler bei der Datenverarbeitung.');
    }
  };

  if (success) {
    return (
      <section
        id="termin"
        className="relative w-full overflow-hidden bg-slate-50 text-slate-800"
        style={{ padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto text-center bg-white border border-slate-200 rounded-3xl shadow-sm"
          style={{ maxWidth: '520px', padding: 'clamp(2.5rem, 2rem + 1vw, 3.5rem)' }}
        >
          <div className="mx-auto p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full w-fit">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h3
            className="font-bold text-slate-900 tracking-tight"
            style={{ fontSize: 'clamp(1.125rem, 1rem + 0.3vw, 1.375rem)', marginTop: '1.25rem' }}
          >
            Anfrage erfolgreich gesendet!
          </h3>
          <p className="text-slate-600 text-sm mt-2.5 leading-relaxed">
            Vielen Dank! Wir haben Ihre Terminanfrage erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen.
          </p>
        </motion.div>
      </section>
    );
  }

  const inputClass = 'w-full bg-white/20 backdrop-blur-xs border border-slate-300 hover:border-slate-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-2xl text-slate-900 placeholder-slate-400 hover:bg-white focus:bg-white transition-all duration-300 focus:outline-none';

  return (
    <section
      id="termin"
      className="relative w-full overflow-hidden bg-slate-50 text-slate-800"
      style={{ padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)' }}
    >
      {/* ── Background Sketch Illustration (Watermark style, multiplied to blend with slate-50) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none select-none opacity-[0.20] sm:opacity-[0.25] md:opacity-[0.30] mix-blend-multiply"
        aria-hidden="true"
      >
        <Image
          src="/appointment-bg.jpg"
          alt="Appointment Sketch Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="mx-auto relative z-10" style={{ maxWidth: '1200px' }}>
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4rem)' }}>
          <span
            className="inline-block bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest rounded-full"
            style={{ fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)', padding: '0.375rem 1rem', marginBottom: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)' }}
          >
            Terminbuchung & Schadensmeldung
          </span>
          <h2
            className="font-black tracking-tight text-slate-900"
            style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)' }}
          >
            Online-Terminanfrage
          </h2>
          <p
            className="text-slate-600"
            style={{ fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)', maxWidth: '500px', marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)', lineHeight: 1.6 }}
          >
            Wählen Sie Ihre Services und Ihren Wunschtermin bequem online aus.
          </p>
        </div>

        <div className="mx-auto w-full" style={{ maxWidth: '750px' }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/25 backdrop-blur-md border border-slate-200/80 hover:bg-white rounded-3xl shadow-sm transition-all duration-300"
            style={{ padding: 'clamp(1.5rem, 1.25rem + 0.8vw, 2.5rem)' }}
          >
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-2xl bg-red-50 text-red-700 border border-red-100 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer_name" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <User className="w-3.5 h-3.5 text-red-600" /> Name *
                  </label>
                  <input id="customer_name" name="customer_name" type="text" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} placeholder="Vor- und Nachname" />
                </div>
                <div>
                  <label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <Phone className="w-3.5 h-3.5 text-red-600" /> Telefon *
                  </label>
                  <input id="phone" name="phone" type="tel" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} placeholder="+41 79 ..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <Mail className="w-3.5 h-3.5 text-red-600" /> E-Mail *
                  </label>
                  <input id="email" name="email" type="email" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} placeholder="name@beispiel.ch" />
                </div>
                <div>
                  <label htmlFor="vehicle_info" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <Car className="w-3.5 h-3.5 text-red-600" /> Fahrzeugdaten *
                  </label>
                  <input id="vehicle_info" name="vehicle_info" type="text" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} placeholder="z.B. VW Golf VII, ZH 12345" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferred_date" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <CalendarDays className="w-3.5 h-3.5 text-red-600" /> Wunschdatum *
                  </label>
                  <input id="preferred_date" name="preferred_date" type="date" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} />
                </div>
                <div>
                  <label htmlFor="preferred_time" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                    <Clock className="w-3.5 h-3.5 text-red-600" /> Wunschzeit *
                  </label>
                  <select id="preferred_time" name="preferred_time" required className={inputClass} style={{ padding: 'clamp(0.625rem, 0.5rem + 0.3vw, 0.75rem) 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }}>
                    <option value="">Bitte wählen...</option>
                    <option value="Morgen (08:00 - 12:00)">Morgen (08:00 - 12:00)</option>
                    <option value="Nachmittag (13:30 - 17:00)">Nachmittag (13:30 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  <Settings className="w-3.5 h-3.5 text-red-600" /> Gewünschte Services (Optional)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((srv) => {
                    const isSelected = selectedServices.includes(srv.title);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleServiceToggle(srv.title)}
                        className={`text-left p-3 rounded-2xl border text-xs font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-red-600 border-red-600 text-white shadow-xs'
                            : 'bg-white/20 backdrop-blur-xs border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white'
                        }`}
                      >
                        {srv.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Bemerkungen / Schadenbeschreibung
                </label>
                <textarea id="notes" name="notes" rows={4} className={inputClass} style={{ padding: '0.75rem 1rem', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)' }} placeholder="Beschreiben Sie hier Ihr Anliegen oder Details zum Schaden..." />
              </div>

              <div className="space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  <Camera className="w-3.5 h-3.5 text-red-600" /> Schadenfotos hochladen (Optional)
                </span>
                <div className="flex gap-2.5 flex-wrap">
                  {images.map((url, idx) => (
                    <div key={url} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Schaden" className="object-cover w-full h-full" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg cursor-pointer transition-colors hover:bg-red-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {uploading ? (
                    <div className="w-16 h-16 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                    </div>
                  ) : (
                    <label className="w-16 h-16 flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-red-500/50 rounded-2xl bg-slate-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5" />
                      <span className="text-[8px] mt-0.5 font-bold uppercase tracking-wider">Foto</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || uploading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ padding: 'clamp(0.75rem, 0.6rem + 0.3vw, 0.95rem)', fontSize: 'clamp(0.8125rem, 0.79rem + 0.1vw, 0.9375rem)' }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Terminanfrage senden</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
