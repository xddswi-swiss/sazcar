'use client';

import React, { useState, useTransition } from 'react';
import { savePromotion, deletePromotion, togglePromotionActive, reorderPromotion } from '../actions/promotions';
import { uploadImage } from '@/app/actions/upload';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  X,
  AlertCircle,
  Snowflake,
  Sun,
  Sparkles,
  Wrench,
  Tag,
  ArrowUp,
  ArrowDown,
  ImageIcon,
} from 'lucide-react';
import AdminModal from '@/components/admin/AdminModal';
import { ADMIN_INPUT_CLASS } from '@/lib/adminStyles';

type BadgeType = 'winter_tires' | 'summer_tires' | 'detailing' | 'service' | 'custom';

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  original_price: number | null;
  discounted_price: number | null;
  discount_percent: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  badge_type: BadgeType;
  sort_order: number;
  image_url: string | null;
  created_at: string;
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
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
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
    };
  });
}

const badgeIcons: Record<BadgeType, typeof Tag> = {
  winter_tires: Snowflake,
  summer_tires: Sun,
  detailing: Sparkles,
  service: Wrench,
  custom: Tag,
};

const badgeLabels: Record<BadgeType, string> = {
  winter_tires: 'Winterreifen',
  summer_tires: 'Sommerreifen',
  detailing: 'Aufbereitung',
  service: 'Service',
  custom: 'Individuell',
};

interface QuickTemplate {
  title: string;
  description: string;
  badge_type: BadgeType;
}

const templateGroups: { category: string; items: QuickTemplate[] }[] = [
  {
    category: 'Reifenverkauf & Räder-Service',
    items: [
      { title: 'Neureifen-Aktion', description: '4 für 3 Komplettsatz', badge_type: 'custom' },
      { title: 'Reifenkauf-Aktion', description: 'Gratis Montage & Auswuchten', badge_type: 'custom' },
      { title: 'Premium Winterreifen-Verkauf', description: 'Aktionspreise', badge_type: 'winter_tires' },
      { title: 'Komplettrad-Aktion', description: 'Alufelgen & Reifen', badge_type: 'custom' },
      { title: 'Winterreifen-Aktion', description: 'Wechsel & Einlagerung', badge_type: 'winter_tires' },
      { title: 'Sommerreifen-Wechsel', description: 'Inkl. Auswuchten', badge_type: 'summer_tires' },
      { title: 'Räder-Hotel', description: 'Einlagerung & Reinigung', badge_type: 'custom' },
    ],
  },
  {
    category: 'Service & MFK',
    items: [
      { title: 'MFK-Vorbereitung & Bereitstellung', description: '', badge_type: 'service' },
      { title: 'Grosser Frühlings- / Herbst-Service', description: '', badge_type: 'service' },
      { title: 'Ölwechsel & Filter-Service', description: '', badge_type: 'service' },
      { title: 'Bremsen-Check & Bremsbelagwechsel', description: '', badge_type: 'service' },
      { title: 'Kostenlose Fahrzeugdiagnose & System-Check', description: '', badge_type: 'service' },
    ],
  },
  {
    category: 'Saisonale Checks & Wartung',
    items: [
      { title: 'Winter-Check', description: 'Batterie, Frostschutz, Licht', badge_type: 'service' },
      { title: 'Ferien- / Sommer-Check', description: '', badge_type: 'service' },
      { title: 'Klima-Service & Desinfektion', description: '', badge_type: 'service' },
      { title: 'Batterie-Tausch Aktion', description: '', badge_type: 'service' },
    ],
  },
  {
    category: 'Carrosserie & Aufbereitung',
    items: [
      { title: 'Fahrzeug-Aufbereitung', description: 'Innen & Aussen', badge_type: 'detailing' },
      { title: 'Lackpolitur & Keramik-Versiegelung', description: '', badge_type: 'detailing' },
      { title: 'Dellen- & Hagelschaden-Reparatur', description: 'Spot-Repair', badge_type: 'detailing' },
      { title: 'Scheibenreparatur & Steinschlag-Service', description: '', badge_type: 'detailing' },
    ],
  },
];

const flatTemplates: QuickTemplate[] = templateGroups.flatMap((group) => group.items);

function isCurrentlyRunning(promo: Promotion): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return promo.is_active && promo.start_date <= today && promo.end_date >= today;
}

export default function PromotionsManagement({ initialPromotions }: { initialPromotions: Promotion[] }) {
  const [promotions, setPromotions] = useState<Promotion[]>(
    [...initialPromotions].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBadgeType, setFormBadgeType] = useState<BadgeType>('custom');
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openAddModal = () => {
    setEditingPromo(null);
    setFormTitle('');
    setFormDescription('');
    setFormBadgeType('custom');
    setFormImageUrl(null);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormTitle(promo.title);
    setFormDescription(promo.description || '');
    setFormBadgeType(promo.badge_type);
    setFormImageUrl(promo.image_url);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressed);
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        setFormImageUrl(res.url);
      } else {
        setError(res.error || 'Fehler beim Hochladen des Bildes.');
      }
    } catch (err) {
      console.error(err);
      setError('Fehler bei der Bildverarbeitung.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const applyTemplate = (tpl: QuickTemplate) => {
    setFormTitle(tpl.title);
    setFormDescription(tpl.description);
    setFormBadgeType(tpl.badge_type);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (editingPromo) {
      formData.append('id', editingPromo.id);
    }
    if (formImageUrl) {
      formData.append('image_url', formImageUrl);
    }

    startTransition(async () => {
      const res = await savePromotion(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Aktion wirklich löschen?')) return;

    const res = await deletePromotion(id);
    if (res.error) {
      alert(res.error);
    } else {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promotions.length) return;

    const current = promotions[index];
    const target = promotions[targetIndex];

    const reordered = [...promotions];
    reordered[index] = { ...target, sort_order: current.sort_order };
    reordered[targetIndex] = { ...current, sort_order: target.sort_order };
    reordered.sort((a, b) => a.sort_order - b.sort_order);
    setPromotions(reordered);

    const res = await reorderPromotion(current.id, current.sort_order, target.id, target.sort_order);
    if (res.error) alert(res.error);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const res = await togglePromotionActive(id, newStatus);
    if (res.error) {
      alert(res.error);
    } else {
      setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: newStatus } : p)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Aktion erstellen</span>
        </button>
      </div>

      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((promo, index) => {
            const Icon = badgeIcons[promo.badge_type];
            const running = isCurrentlyRunning(promo);
            return (
              <div
                key={promo.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-xs p-4 flex flex-col justify-between transition-all
                  ${promo.is_active ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800 opacity-60'}
                `}
              >
                <div>
                  {promo.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={promo.image_url} alt="" className="w-full h-24 object-cover rounded-xl mb-3" />
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 dark:bg-red-950/20">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                        ${running
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                      `}
                    >
                      {running ? 'Live auf der Website' : promo.is_active ? 'Ausserhalb Zeitraum' : 'Inaktiv'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{promo.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{badgeLabels[promo.badge_type]}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {promo.start_date} – {promo.end_date}
                  </p>
                  {(promo.discounted_price != null && promo.original_price != null) ? (
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                      CHF {promo.discounted_price}.– <span className="line-through font-normal text-slate-400">CHF {promo.original_price}.–</span>
                    </p>
                  ) : promo.discount_percent != null ? (
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">{promo.discount_percent}% Rabatt</p>
                  ) : null}
                </div>

                <div className="flex items-center justify-end gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Nach oben"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === promotions.length - 1}
                    title="Nach unten"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(promo.id, promo.is_active)}
                    title={promo.is_active ? 'Inaktiv setzen' : 'Aktiv setzen'}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {promo.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(promo)}
                    title="Bearbeiten"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    title="Löschen"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500">
          Keine Aktionen erfasst.
        </div>
      )}

      {isModalOpen && (
        <AdminModal
          title={editingPromo ? 'Aktion bearbeiten' : 'Neue Aktion erstellen'}
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

              {!editingPromo && (
                <div>
                  <label htmlFor="quick_template" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Schnellvorlage
                  </label>
                  <select
                    id="quick_template"
                    defaultValue=""
                    onChange={(e) => {
                      const idx = e.target.value;
                      if (idx === '') return;
                      applyTemplate(flatTemplates[Number(idx)]);
                      e.target.value = '';
                    }}
                    className={ADMIN_INPUT_CLASS}
                  >
                    <option value="">Vorlage wählen …</option>
                    {templateGroups.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.items.map((tpl) => (
                          <option key={`${group.category}-${tpl.title}`} value={flatTemplates.indexOf(tpl)}>
                            {tpl.title}{tpl.description ? ` — ${tpl.description}` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Titel *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="z.B. Winterreifen-Aktion"
                />
              </div>

              <div>
                <label htmlFor="badge_type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategorie *
                </label>
                <select
                  id="badge_type"
                  name="badge_type"
                  required
                  value={formBadgeType}
                  onChange={(e) => setFormBadgeType(e.target.value as BadgeType)}
                  className={ADMIN_INPUT_CLASS}
                >
                  {(Object.keys(badgeLabels) as BadgeType[]).map((key) => (
                    <option key={key} value={key}>{badgeLabels[key]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Beschreibung
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={ADMIN_INPUT_CLASS}
                  placeholder="Wird angezeigt, wenn kein Preis/Prozent gesetzt ist"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bild (optional)
                </label>
                {formImageUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formImageUrl} alt="" className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl(null)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900/90 text-white rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 w-full h-24 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-400">
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-xs font-semibold">Bild hochladen</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="original_price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preis vorher (CHF)
                  </label>
                  <input
                    id="original_price"
                    name="original_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingPromo?.original_price ?? ''}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="discounted_price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preis jetzt (CHF)
                  </label>
                  <input
                    id="discounted_price"
                    name="discounted_price"
                    type="number"
                    step="0.01"
                    defaultValue={editingPromo?.discounted_price ?? ''}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="discount_percent" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Rabatt (%)
                  </label>
                  <input
                    id="discount_percent"
                    name="discount_percent"
                    type="number"
                    defaultValue={editingPromo?.discount_percent ?? ''}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">
                Entweder Preis vorher/jetzt oder Rabatt-% angeben — sonst wird die Beschreibung angezeigt.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Startdatum *
                  </label>
                  <input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    defaultValue={editingPromo?.start_date || new Date().toISOString().slice(0, 10)}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enddatum *
                  </label>
                  <input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    defaultValue={editingPromo?.end_date || ''}
                    className={ADMIN_INPUT_CLASS}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={editingPromo?.is_active ?? true}
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500/30"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aktion aktiv</span>
              </label>

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
                  disabled={isPending}
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
