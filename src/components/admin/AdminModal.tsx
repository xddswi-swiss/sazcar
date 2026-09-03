'use client';

import React from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  maxWidth?: string;
  children: React.ReactNode;
}

// Shared shell for the admin CRUD modals (cars/jobs/promotions) — was the
// same overlay+card+header+form markup copy-pasted in each management page.
export default function AdminModal({ title, onClose, onSubmit, maxWidth = '600px', children }: AdminModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-h-[90vh] flex flex-col" style={{ maxWidth }}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {children}
        </form>
      </div>
    </div>
  );
}
