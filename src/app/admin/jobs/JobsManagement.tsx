'use client';

import React, { useState, useTransition } from 'react';
import { saveJob, deleteJob, toggleJobActive, reorderJob } from '../actions/jobs';
import {
  DEPARTMENT_LABELS,
  PENSUM_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  DEFAULT_JOB_CONTENT,
  jobAdTitle,
  type JobOpening,
  type Department,
  type Pensum,
  type EmploymentType,
} from '@/content/jobs';
import { Plus, Trash2, Edit2, Eye, EyeOff, Loader2, X, AlertCircle, ArrowUp, ArrowDown, Briefcase } from 'lucide-react';
import AdminModal from '@/components/admin/AdminModal';
import { ADMIN_INPUT_CLASS } from '@/lib/adminStyles';

function ListField({
  label,
  name,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              name={name}
              value={item}
              onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              title="Entfernen"
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Hinzufügen</span>
      </button>
    </div>
  );
}

export default function JobsManagement({ initialJobs }: { initialJobs: JobOpening[] }) {
  const [jobs, setJobs] = useState<JobOpening[]>(
    [...initialJobs].sort((a, b) => a.sort_order - b.sort_order)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  // true once the admin edits content manually — stops department switches from overwriting their edits
  const [contentTouched, setContentTouched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingJob(null);
    setDescription('');
    setTasks([]);
    setRequirements([]);
    setContentTouched(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job: JobOpening) => {
    setEditingJob(job);
    setDescription(job.description ?? '');
    setTasks(job.tasks ?? []);
    setRequirements(job.requirements ?? []);
    setContentTouched(true);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDepartmentChange = (dept: Department) => {
    if (contentTouched) return;
    const defaults = DEFAULT_JOB_CONTENT[dept];
    setDescription(defaults?.description ?? '');
    setTasks(defaults?.tasks ?? []);
    setRequirements(defaults?.requirements ?? []);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (editingJob) {
      formData.append('id', editingJob.id);
    }

    startTransition(async () => {
      const res = await saveJob(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Stelle wirklich löschen?')) return;

    const res = await deleteJob(id);
    if (res.error) {
      alert(res.error);
    } else {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= jobs.length) return;

    const current = jobs[index];
    const target = jobs[targetIndex];

    const reordered = [...jobs];
    reordered[index] = { ...target, sort_order: current.sort_order };
    reordered[targetIndex] = { ...current, sort_order: target.sort_order };
    reordered.sort((a, b) => a.sort_order - b.sort_order);
    setJobs(reordered);

    const res = await reorderJob(current.id, current.sort_order, target.id, target.sort_order);
    if (res.error) alert(res.error);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const res = await toggleJobActive(id, newStatus);
    if (res.error) {
      alert(res.error);
    } else {
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, is_active: newStatus } : j)));
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
          <span>Stelle erstellen</span>
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-xs p-4 flex flex-col justify-between transition-all
                ${job.is_active ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800 opacity-60'}
              `}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 dark:bg-red-950/20">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                      ${job.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}
                    `}
                  >
                    {job.is_active ? 'Live auf der Website' : 'Inaktiv'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{jobAdTitle(job)}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                  {job.hours_per_week ? ` · ${job.hours_per_week} Std./Woche` : ''}
                </p>
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
                  disabled={index === jobs.length - 1}
                  title="Nach unten"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(job.id, job.is_active)}
                  title={job.is_active ? 'Inaktiv setzen' : 'Aktiv setzen'}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {job.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditModal(job)}
                  title="Bearbeiten"
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  title="Löschen"
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500">
          Keine Stellen erfasst.
        </div>
      )}

      {isModalOpen && (
        <AdminModal
          title={editingJob ? 'Stelle bearbeiten' : 'Neue Stelle erstellen'}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          maxWidth="500px"
        >
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 text-red-700 border border-red-100 text-xs dark:bg-red-950/20 dark:text-red-400 dark:border-red-900">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="department" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Bereich *
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  defaultValue={editingJob?.department ?? ''}
                  onChange={(e) => handleDepartmentChange(e.target.value as Department)}
                  className={ADMIN_INPUT_CLASS}
                >
                  <option value="" disabled>Bitte wählen …</option>
                  {(Object.keys(DEPARTMENT_LABELS) as Department[]).map((key) => (
                    <option key={key} value={key}>{DEPARTMENT_LABELS[key]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pensum" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pensum *
                  </label>
                  <select
                    id="pensum"
                    name="pensum"
                    required
                    defaultValue={editingJob?.pensum ?? 'vollzeit'}
                    className={ADMIN_INPUT_CLASS}
                  >
                    {(Object.keys(PENSUM_LABELS) as Pensum[]).map((key) => (
                      <option key={key} value={key}>{PENSUM_LABELS[key]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="hours_per_week" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stunden/Woche
                  </label>
                  <input
                    id="hours_per_week"
                    name="hours_per_week"
                    type="number"
                    step="0.5"
                    min="0"
                    defaultValue={editingJob?.hours_per_week ?? ''}
                    className={ADMIN_INPUT_CLASS}
                    placeholder="z.B. 42"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="employment_type" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Einsatzart *
                </label>
                <select
                  id="employment_type"
                  name="employment_type"
                  required
                  defaultValue={editingJob?.employment_type ?? 'festanstellung'}
                  className={ADMIN_INPUT_CLASS}
                >
                  {(Object.keys(EMPLOYMENT_TYPE_LABELS) as EmploymentType[]).map((key) => (
                    <option key={key} value={key}>{EMPLOYMENT_TYPE_LABELS[key]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setContentTouched(true);
                  }}
                  placeholder="Kurze Beschreibung der Tätigkeit …"
                  className={`${ADMIN_INPUT_CLASS} resize-none`}
                />
              </div>

              <ListField
                label="Typische Aufgaben"
                name="tasks"
                items={tasks}
                onChange={(v) => {
                  setTasks(v);
                  setContentTouched(true);
                }}
                placeholder="z.B. Service- und Inspektionsarbeiten"
              />

              <ListField
                label="Anforderungen & Erwartungen"
                name="requirements"
                items={requirements}
                onChange={(v) => {
                  setRequirements(v);
                  setContentTouched(true);
                }}
                placeholder="z.B. Führerschein Kategorie B"
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={editingJob?.is_active ?? true}
                  className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500/30"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stelle aktiv</span>
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
