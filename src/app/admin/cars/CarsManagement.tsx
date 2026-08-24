'use client';

import React, { useState, useTransition } from 'react';
import { saveCar, deleteCar, toggleCarActive } from '../actions/cars';
import { uploadImage } from '@/app/actions/upload';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff, 
  Loader2, 
  X, 
  AlertCircle, 
  Camera 
} from 'lucide-react';

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  fuel_type: string;
  transmission: string;
  description: string | null;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
}

interface CarsManagementProps {
  initialCars: Car[];
}

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

export default function CarsManagement({ initialCars }: CarsManagementProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(search.toLowerCase()) ||
    car.brand.toLowerCase().includes(search.toLowerCase()) ||
    car.model.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCar(null);
    setImageUrls([]);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setImageUrls(car.image_urls || []);
    setError(null);
    setIsModalOpen(true);
  };

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
          setImageUrls((prev) => [...prev, res.url]);
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
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (editingCar) {
      formData.append('id', editingCar.id);
    }
    formData.append('image_urls', JSON.stringify(imageUrls));

    startTransition(async () => {
      const res = await saveCar(formData);
      if (res.error) {
        setError(res.error);
      } else {
        // Simple client updates for responsive feel
        setIsModalOpen(false);
        // Refresh local component state
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie dieses Fahrzeug wirklich löschen?')) return;

    const res = await deleteCar(id);
    if (res.error) {
      alert(res.error);
    } else {
      setCars((prev) => prev.filter(car => car.id !== id));
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const res = await toggleCarActive(id, newStatus);
    if (res.error) {
      alert(res.error);
    } else {
      setCars((prev) => prev.map(car => car.id === id ? { ...car, is_active: newStatus } : car));
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Fahrzeug suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
          />
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Fahrzeug erfassen</span>
        </button>
      </div>

      {/* Grid List */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCars.map((car) => (
            <div 
              key={car.id} 
              className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all
                ${car.is_active ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800 opacity-60'}
              `}
            >
              {/* Image Section */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                {car.image_urls && car.image_urls.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={car.image_urls[0]} 
                    alt={car.title} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                    Keine Bilder
                  </div>
                )}
                
                {/* Active Tag */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm
                  ${car.is_active 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' 
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-850 dark:text-slate-400 dark:border-slate-700'}
                `}>
                  {car.is_active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              {/* Info Section */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{car.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {car.year} • {car.mileage.toLocaleString()} km • {car.fuel_type} • {car.transmission}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    CHF {car.price.toLocaleString()}.-
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(car.id, car.is_active)}
                      title={car.is_active ? 'Inaktiv setzen' : 'Aktiv setzen'}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {car.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(car)}
                      title="Bearbeiten"
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      title="Löschen"
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500">
          Keine Fahrzeuge erfasst.
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {editingCar ? 'Fahrzeug bearbeiten' : 'Fahrzeug neu erfassen'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 text-red-700 border border-red-100 text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Inseratetitel *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  defaultValue={editingCar?.title || ''}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  placeholder="z.B. VW Golf 2.0 R 4Motion DSG"
                />
              </div>

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
                    defaultValue={editingCar?.brand || ''}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                    placeholder="z.B. VW"
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
                    defaultValue={editingCar?.model || ''}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                    placeholder="z.B. Golf R"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jahrgang *
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="number"
                    required
                    defaultValue={editingCar?.year || new Date().getFullYear()}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="mileage" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kilometer *
                  </label>
                  <input
                    id="mileage"
                    name="mileage"
                    type="number"
                    required
                    defaultValue={editingCar?.mileage || 0}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preis (CHF) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    defaultValue={editingCar?.price || 0}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fuel_type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Treibstoff *
                  </label>
                  <select
                    id="fuel_type"
                    name="fuel_type"
                    required
                    defaultValue={editingCar?.fuel_type || 'Benzin'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  >
                    <option value="Benzin">Benzin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Elektro">Elektro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transmission" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Getriebe *
                  </label>
                  <select
                    id="transmission"
                    name="transmission"
                    required
                    defaultValue={editingCar?.transmission || 'Automat'}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  >
                    <option value="Automat">Automat</option>
                    <option value="Schaltgetriebe">Schaltgetriebe</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fahrzeugbeschreibung
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={editingCar?.description || ''}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
                  placeholder="Details zur Ausstattung, Zustand, MFK etc."
                />
              </div>

              {/* Photos upload */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Fahrzeugbilder
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Fahrzeug" className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {uploading ? (
                    <div className="aspect-square flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                    </div>
                  ) : (
                    <label className="aspect-square flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-red-500 dark:border-slate-600 dark:hover:border-red-500 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5" />
                      <span className="text-[9px] mt-1 font-semibold">Bilder hochladen</span>
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

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Abbrechen
                </button>
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
                    <span>Speichern</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
