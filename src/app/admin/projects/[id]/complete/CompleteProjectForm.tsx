'use client';

import React, { useState, useTransition } from 'react';
import { completeProject } from '@/app/admin/actions/projects';
import { uploadImage } from '@/app/actions/upload';
import { Camera, Trash2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Client-side image compression
async function compressImage(file: File, maxW = 1200, maxH = 1200, quality = 0.8): Promise<File> {
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

const AVAILABLE_SERVICES = [
  'Karosserie & Spenglerarbeiten',
  'Autolackierung & Malerei',
  'Autoservice & Reparatur',
  'MFK-Vorbereitung & Vorführung',
  'Reifenservice',
  'Scheiben- & Glasschaden'
];

interface CompleteProjectFormProps {
  project: {
    id: string;
    brand: string;
    model: string;
    license_plate: string;
    before_image_urls?: string[];
  };
}

export default function CompleteProjectForm({ project }: CompleteProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPublished, setIsPublished] = useState(true); // Default to publishing upon completion

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file);

        const formData = new FormData();
        formData.append('file', compressed);

        const res = await uploadImage(formData);
        if (res.success && res.url) {
          setAfterImages((prev) => [...prev, res.url]);
        } else {
          setError(res.error || 'Fehler beim Hochladen der Bilder.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Bildverarbeitung.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setAfterImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setError('Bitte wählen Sie mindestens einen durchgeführten Service aus.');
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append('services_done', JSON.stringify(selectedServices));
    formData.append('after_images', JSON.stringify(afterImages));
    formData.append('is_published', isPublished ? 'true' : 'false');

    startTransition(async () => {
      const result = await completeProject(project.id, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Auftrag abschliessen</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fahrzeug: <span className="font-semibold text-slate-800 dark:text-slate-200">{project.brand} {project.model}</span> ({project.license_plate})
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 mb-5 rounded-xl bg-red-50 text-red-700 border border-red-100 text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Show before images if available */}
      {project.before_image_urls && project.before_image_urls.length > 0 && (
        <div className="mb-5">
          <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Vorher-Bilder
          </span>
          <div className="grid grid-cols-4 gap-2">
            {project.before_image_urls.map((url) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Vorher" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Services Multi Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Durchgeführte Arbeiten (Mehrfachauswahl) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AVAILABLE_SERVICES.map((service) => {
              const isChecked = selectedServices.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => handleServiceToggle(service)}
                  className={`
                    flex items-center justify-start px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer
                    ${isChecked
                      ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-950/20 dark:border-red-500 dark:text-red-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}
                  `}
                >
                  <span className={`w-3.5 h-3.5 rounded border mr-2 flex items-center justify-center shrink-0
                    ${isChecked ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300 dark:border-slate-600'}
                  `}>
                    {isChecked && '✓'}
                  </span>
                  <span>{service}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* After Images upload */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Zustand nach Reparatur (Nachher-Bilder)
          </span>

          <div className="grid grid-cols-3 gap-3">
            {afterImages.map((url, index) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Nachher" className="object-cover w-full h-full" />
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

        {/* Publish checkbox */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-600"
            />
            <div>
              <span className="block text-xs font-semibold text-slate-900 dark:text-white">
                Direkt auf der Website veröffentlich (Vorher/Nachher Vitrine)
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Macht dieses Projekt für Website-Besucher sichtbar.
              </span>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
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
              <span>Auftrag abschliessen</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
