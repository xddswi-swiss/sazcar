'use client';

import React, { useState, useTransition } from 'react';
import { saveCar, deleteCar, toggleCarActive } from '../actions/cars';
import { uploadImage } from '@/app/actions/upload';
import AdminModal from '@/components/admin/AdminModal';
import { ADMIN_INPUT_CLASS } from '@/lib/adminStyles';
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
  subtitle?: string | null;
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
  ribbon_tier?: string | null;
  warranty_tier?: string | null;
  badges?: string[] | null;
  power?: string | null;
  consumption?: string | null;
  drive_type?: string | null;
  body_type?: string | null;
  accident_free?: boolean | null;
  optional_equipment?: string[] | null;
  standard_equipment?: string[] | null;
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

const MASTER_SWISS_EQUIPMENT = [
  'Adaptive LED-Scheinwerfer',
  'Aktive Geschwindigkeitsregelung mit Stop&Go Funktion',
  'Alcantara Innenausstattung',
  'Android Auto',
  'Apple CarPlay',
  'Aussenspiegel elektrisch anklappbar',
  'Aussenspiegelkappen schwarz',
  'Bordsteinautomatik für Beifahreraussenspiegel',
  'Driving Assistant Pack',
  'Fernlichtassistent',
  'Harman/Kardon Surround Sound System',
  'Head-Up Display',
  'Heckklappenbetätigung automatisch',
  'Keyless Entry / Komfortzugang',
  'Lenkradheizung',
  'Lordosenstütze für Fahrer und Beifahrer',
  'M Heckspoiler',
  'M Leichtmetallräder 19"',
  'M Sportbremse',
  'M Sportfahrwerk',
  'M Sportsitze für Fahrer und Beifahrer',
  'Navigation Live Cockpit Professional',
  'Panoramadach Glas',
  'Park Distance Control (PDC) vorn und hinten',
  'Parking Assistant (Rückfahrkamera)',
  'Regensensor',
  'Sitzheizung für Fahrer und Beifahrer',
  'Spurwechselwarnung',
  'Standheizung',
  'Totwinkel-Assistent'
];

export default function CarsManagement({ initialCars }: CarsManagementProps) {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [customBadgeInput, setCustomBadgeInput] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  // Hybrid Equipment States
  const [optionalEquipment, setOptionalEquipment] = useState<string[]>([]);
  const [standardEquipment, setStandardEquipment] = useState<string[]>([]);
  const [optionalSearch, setOptionalSearch] = useState('');
  const [standardSearch, setStandardSearch] = useState('');
  const [pasteOptionalText, setPasteOptionalText] = useState('');
  const [pasteStandardText, setPasteStandardText] = useState('');
  const [equipmentInputMode, setEquipmentInputMode] = useState<'search' | 'paste'>('search');

  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(search.toLowerCase()) ||
    car.brand.toLowerCase().includes(search.toLowerCase()) ||
    car.model.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCar(null);
    setImageUrls([]);
    setSelectedBadges(['Ab MFK', 'Mit Garantie', 'Kein Unfallfahrzeug', '8 fach bereift']);
    setOptionalEquipment([
      'Adaptive LED-Scheinwerfer',
      'Driving Assistant Pack',
      'Harman/Kardon Surround Sound System',
      'M Sportsitze für Fahrer und Beifahrer'
    ]);
    setStandardEquipment([
      'Active Guard Plus',
      'Antiblockiersystem ABS',
      'Auto Start/Stopp-Funktion',
      'Bordcomputer',
      'Regensensor'
    ]);
    setPasteOptionalText('');
    setPasteStandardText('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setImageUrls(car.image_urls || []);
    setSelectedBadges(car.badges || []);
    setOptionalEquipment(car.optional_equipment || []);
    setStandardEquipment(car.standard_equipment || []);
    setPasteOptionalText(car.optional_equipment?.join('\n') || '');
    setPasteStandardText(car.standard_equipment?.join('\n') || '');
    setError(null);
    setIsModalOpen(true);
  };

  const toggleBadge = (badgeName: string) => {
    setSelectedBadges((prev) => 
      prev.includes(badgeName) ? prev.filter((b) => b !== badgeName) : [...prev, badgeName]
    );
  };

  const addCustomBadge = () => {
    const trimmed = customBadgeInput.trim();
    if (trimmed && !selectedBadges.includes(trimmed)) {
      setSelectedBadges((prev) => [...prev, trimmed]);
      setCustomBadgeInput('');
    }
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
    formData.append('badges', JSON.stringify(selectedBadges));

    // Handle equipment lists (Search vs Paste mode)
    let finalOptional = optionalEquipment;
    let finalStandard = standardEquipment;

    if (equipmentInputMode === 'paste') {
      finalOptional = pasteOptionalText.split('\n').map(s => s.trim()).filter(Boolean);
      finalStandard = pasteStandardText.split('\n').map(s => s.trim()).filter(Boolean);
    }

    formData.append('optional_equipment', JSON.stringify(finalOptional));
    formData.append('standard_equipment', JSON.stringify(finalStandard));

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
        <AdminModal
          title={editingCar ? 'Fahrzeug bearbeiten' : 'Fahrzeug neu erfassen'}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          maxWidth="600px"
        >
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
                  className={ADMIN_INPUT_CLASS}
                  placeholder="z.B. VW Golf 2.0 R 4Motion DSG"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Kurzbeschreibung / Untertitel</span>
                  <span className="text-[10px] text-slate-400 font-normal">(wird direkt unter dem Titel angezeigt)</span>
                </label>
                <input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  defaultValue={editingCar?.subtitle || ''}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="z.B. *8-fach alubereift*M-Sportsitze*Harman/Kardon*AC Schnitzer Tieferlegung*"
                />
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
                    className={ADMIN_INPUT_CLASS}
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
                    className={ADMIN_INPUT_CLASS}
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
                    className={ADMIN_INPUT_CLASS}
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
                    className={ADMIN_INPUT_CLASS}
                  >
                    <option value="Benzin">Benzin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Elektro">Elektro</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
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
                    className={ADMIN_INPUT_CLASS}
                  >
                    <option value="Automat">Automat</option>
                    <option value="Handschaltung">Handschaltung (Manuel)</option>
                    <option value="Halbautomatisch">Halbautomatisch</option>
                  </select>
                </div>
              </div>

              {/* Power, Consumption, Drive Type, Body Type Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="power" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Leistung (PS / kW)
                  </label>
                  <input
                    id="power"
                    name="power"
                    type="text"
                    defaultValue={editingCar?.power || ''}
                    className={ADMIN_INPUT_CLASS}
                    placeholder="z.B. 300 PS (221 kW)"
                  />
                </div>

                <div>
                  <label htmlFor="consumption" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Verbrauch (l/100 km)
                  </label>
                  <input
                    id="consumption"
                    name="consumption"
                    type="text"
                    defaultValue={editingCar?.consumption || ''}
                    className={ADMIN_INPUT_CLASS}
                    placeholder="z.B. 7.6 l/100 km"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="drive_type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Antrieb (Drive Type)
                  </label>
                  <select
                    id="drive_type"
                    name="drive_type"
                    defaultValue={editingCar?.drive_type || 'Allrad'}
                    className={ADMIN_INPUT_CLASS}
                  >
                    <option value="Allrad">Allrad (4x4 / 4Motion / xDrive)</option>
                    <option value="Vorderrad">Vorderrad (Frontantrieb)</option>
                    <option value="Hinterrad">Hinterrad (Heckantrieb)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="body_type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Aufbautyp / Karosserie
                  </label>
                  <select
                    id="body_type"
                    name="body_type"
                    defaultValue={editingCar?.body_type || 'Limousine'}
                    className={ADMIN_INPUT_CLASS}
                  >
                    <option value="Limousine">Limousine</option>
                    <option value="Kombi">Kombi</option>
                    <option value="SUV / Geländewagen">SUV / Geländewagen</option>
                    <option value="Coupé">Coupé</option>
                    <option value="Cabriolet">Cabriolet</option>
                    <option value="Compact / Hatchback">Compact / Hatchback</option>
                    <option value="Kleinwagen">Kleinwagen</option>
                  </select>
                </div>
              </div>

              {/* Hybrid Equipment Input Section (Searchable Combobox vs Multi-Line Paste) */}
              <div className="p-4 bg-slate-100/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    Fahrzeug-Ausstattung (Donanım Listesi Girişi):
                  </label>
                  
                  {/* Mode Switcher Buttons */}
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEquipmentInputMode('search')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        equipmentInputMode === 'search'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      🔍 Aramalı Seçim (Combobox)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEquipmentInputMode('paste')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        equipmentInputMode === 'paste'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      📋 Kopyala-Yapıştır
                    </button>
                  </div>
                </div>

                {equipmentInputMode === 'search' ? (
                  <div className="space-y-4">
                    {/* 1. OPTIONALE AUSSTATTUNG SEARCHABLE COMBOBOX */}
                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-amber-600 dark:text-amber-400">
                        Optionale Ausstattung (Opsiyonel Donanım):
                      </span>
                      
                      {/* Live Search Input */}
                      <input
                        type="text"
                        value={optionalSearch}
                        onChange={(e) => setOptionalSearch(e.target.value)}
                        placeholder="Arama yapın (Örn: 'a' veya 'as' yazın)..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />

                      {/* Filtered Master Suggestions */}
                      {optionalSearch.trim() && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-h-32 overflow-y-auto">
                          {MASTER_SWISS_EQUIPMENT
                            .filter(item => item.toLowerCase().includes(optionalSearch.toLowerCase()) && !optionalEquipment.includes(item))
                            .map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setOptionalEquipment(prev => [...prev, item]);
                                  setOptionalSearch('');
                                }}
                                className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs rounded-lg font-medium border border-amber-200/80 cursor-pointer"
                              >
                                + {item}
                              </button>
                            ))}
                        </div>
                      )}

                      {/* Selected Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {optionalEquipment.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg font-medium">
                            {item}
                            <button
                              type="button"
                              onClick={() => setOptionalEquipment(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 2. SERIENMÄSSIGE AUSSTATTUNG SEARCHABLE COMBOBOX */}
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Serienmässige Ausstattung (Seri / Standart Donanım):
                      </span>
                      
                      {/* Live Search Input */}
                      <input
                        type="text"
                        value={standardSearch}
                        onChange={(e) => setStandardSearch(e.target.value)}
                        placeholder="Arama yapın (Örn: 'a' veya 'as' yazın)..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />

                      {/* Filtered Master Suggestions */}
                      {standardSearch.trim() && (
                        <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 max-h-32 overflow-y-auto">
                          {MASTER_SWISS_EQUIPMENT
                            .filter(item => item.toLowerCase().includes(standardSearch.toLowerCase()) && !standardEquipment.includes(item))
                            .map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setStandardEquipment(prev => [...prev, item]);
                                  setStandardSearch('');
                                }}
                                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs rounded-lg font-medium border border-slate-300/80 cursor-pointer"
                              >
                                + {item}
                              </button>
                            ))}
                        </div>
                      )}

                      {/* Selected Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {standardEquipment.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs rounded-lg font-medium">
                            {item}
                            <button
                              type="button"
                              onClick={() => setStandardEquipment(prev => prev.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PASTE MULTI-LINE TEXTAREA MODE */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                        Optionale (Her Satıra 1 Özellik):
                      </label>
                      <textarea
                        rows={6}
                        value={pasteOptionalText}
                        onChange={(e) => setPasteOptionalText(e.target.value)}
                        placeholder="AutoScout'tan kopyaladığınız opsiyonel donanım listesini yapıştırın..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Serienmässige (Her Satıra 1 Özellik):
                      </label>
                      <textarea
                        rows={6}
                        value={pasteStandardText}
                        onChange={(e) => setPasteStandardText(e.target.value)}
                        placeholder="AutoScout'tan kopyaladığınız standart donanım listesini yapıştırın..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Select Badges Checkboxes */}
              <div className="p-3 bg-slate-100/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Fahrzeug-Badges (Çoklu Seçim Checkbox):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Ab MFK', 'Mit Garantie', 'Kein Unfallfahrzeug', '8 fach bereift'].map((badge) => (
                    <label
                      key={badge}
                      onClick={() => toggleBadge(badge)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer select-none transition-all ${
                        selectedBadges.includes(badge)
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 font-bold'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBadges.includes(badge)}
                        onChange={() => {}} // Handled by toggleBadge parent click
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                      <span>{badge}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Badges List & Add Input */}
                {selectedBadges.filter(b => !['Ab MFK', 'Mit Garantie', 'Kein Unfallfahrzeug', '8 fach bereift'].includes(b)).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedBadges.filter(b => !['Ab MFK', 'Mit Garantie', 'Kein Unfallfahrzeug', '8 fach bereift'].includes(b)).map(b => (
                      <span key={b} className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs flex items-center gap-1 font-semibold">
                        {b}
                        <button type="button" onClick={() => toggleBadge(b)} className="hover:text-red-900">×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customBadgeInput}
                    onChange={(e) => setCustomBadgeInput(e.target.value)}
                    placeholder="Spezielle Badge (z.B. Frisch ab MFK)"
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addCustomBadge}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700"
                  >
                    + Hinzufügen
                  </button>
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
                  className={ADMIN_INPUT_CLASS}
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
        </AdminModal>
      )}
    </div>
  );
}
