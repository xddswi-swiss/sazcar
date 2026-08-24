'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteProject, toggleProjectPublish } from '../actions/projects';
import { 
  ChevronRight, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2,
  Wrench
} from 'lucide-react';

interface Project {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  services_done: string[] | null;
  before_image_urls: string[] | null;
  after_image_urls: string[] | null;
  status: string;
  is_published: boolean;
  created_at: string;
}

interface ProjectsListProps {
  initialProjects: Project[];
}

export default function ProjectsList({ initialProjects }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Auftrag wirklich löschen?')) return;
    
    setLoadingId(id);
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.error) {
        alert(res.error);
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
      setLoadingId(null);
    });
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    setLoadingId(id);
    startTransition(async () => {
      const res = await toggleProjectPublish(id, currentPublished);
      if (res.error) {
        alert(res.error);
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_published: !currentPublished } : p))
        );
      }
      setLoadingId(null);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-red-600" />
          <span>Aktive & Fertige Aufträge</span>
        </h3>
        <Link 
          href="/admin/projects/new" 
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
        >
          <span>Neuer Auftrag</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {projects && projects.length > 0 ?
          projects.map((proj) => (
            <div key={proj.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{proj.brand} {proj.model}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kontrollschild: {proj.license_plate}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {proj.services_done?.map((srv: string) => (
                    <span key={srv} className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <span className={`
                  text-xs px-2.5 py-1 rounded-full font-semibold border
                  ${proj.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900' : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900'}
                `}>
                  {proj.status === 'in_progress' ? 'In Arbeit' : 'Abgeschlossen'}
                </span>

                {/* Loading indicator for this specific item */}
                {loadingId === proj.id && isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                ) : (
                  <div className="flex items-center gap-1">
                    {/* If completed, show public visibility toggle & delete button */}
                    {proj.status === 'completed' ? (
                      <>
                        <button
                          onClick={() => handleTogglePublish(proj.id, proj.is_published)}
                          title={proj.is_published ? 'Vom Netz nehmen (Verbergen)' : 'Auf Website veröffentlichen'}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-750 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {proj.is_published ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          title="Löschen"
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      // If in progress, show complete button
                      <Link
                        href={`/admin/projects/${proj.id}/complete`}
                        title="Auftrag abschließen"
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        : (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Keine Aufträge vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
