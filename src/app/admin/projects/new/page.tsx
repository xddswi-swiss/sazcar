'use client';

import React, { useState, useTransition } from 'react';
import { createProject } from '@/app/admin/actions/projects';
import { uploadImage } from '@/app/actions/upload';
import { Camera, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Client-side image compression function
async function compressImage(file: File, maxW = 1200, maxH = 1200, quality = 0.8): Promise<File> {
  // If browser environment is not available, return original
  if (typeof window === 'undefined') return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
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

export default function NewProjectPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Client-side compression
        const compressed = await compressImage(file);

        // 2. Prepare Form Data
        const formData = new FormData();
        formData.append('file', compressed);

        // 3. Upload via Server Action
        const res = await uploadImage(formData);
        if (res.success && res.url) {
          setImages((prev) => [...prev, res.url]);
        } else {
          setError(res.error || 'Fehler beim Hochladen der Bilder.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Bildverarbeitung.');
    } finally {
      setUploading(false);
      // Reset input element
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('before_images', JSON.stringify(images));

    startTransition(async () => {
      const result = await createProject(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-[600px] mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Neuer Auftrag erfassen</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Erfassen Sie ein neues Fahrzeug in unter 30 Sekunden für die Werkstatt.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 mb-5 rounded-xl bg-red-50 text-red-700 border border-red-100 text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Marke *
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
              placeholder="z.B. Audi"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Modell *
            </label>
            <input
              id="model"
              name="model"
              type="text"
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
              placeholder="z.B. RS6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="license_plate" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Kontrollschild *
          </label>
          <input
            id="license_plate"
            name="license_plate"
            type="text"
            required
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
            placeholder="z.B. ZH 123456"
          />
        </div>

        <div>
          <label htmlFor="entry_date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Eintrittsdatum
          </label>
          <input
            id="entry_date"
            name="entry_date"
            type="date"
            defaultValue={today}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Image upload section */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Zustand vor Reparatur (Vorher-Bilder)
          </span>
          
          <div className="grid grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Vorher" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {uploading ? (
              <div className="aspect-square flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <span className="text-[10px] mt-1">Lädt hoch...</span>
              </div>
            ) : (
              <label className="aspect-square flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-red-500 dark:border-slate-600 dark:hover:border-red-500 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] mt-1 font-semibold">Foto aufnehmen</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <Link
            href="/admin/dashboard"
            className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={isPending || uploading}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Wird gespeichert...</span>
              </>
            ) : (
              <span>Auftrag erstellen</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
