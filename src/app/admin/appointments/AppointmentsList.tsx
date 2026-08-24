'use client';

import React, { useState } from 'react';
import { updateAppointmentStatus, deleteAppointment } from '../actions/appointments';
import { 
  Check, 
  X, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Car, 
  MessageSquare, 
  AlertCircle,
  Eye
} from 'lucide-react';

interface Appointment {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  vehicle_info: string;
  selected_services: string[];
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  image_urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface AppointmentsListProps {
  initialAppointments: Appointment[];
}

export default function AppointmentsList({ initialAppointments }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredAppointments = appointments.filter((appt) => {
    if (filter === 'all') return true;
    return appt.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.error) {
      alert(res.error);
    } else {
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Terminanfrage wirklich löschen?')) return;

    const res = await deleteAppointment(id);
    if (res.error) {
      alert(res.error);
    } else {
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-px">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`
              px-4 py-2.5 font-semibold text-xs border-b-2 capitalize whitespace-nowrap cursor-pointer transition-all
              ${filter === tab
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
            `}
          >
            {tab === 'all' && 'Alle'}
            {tab === 'pending' && 'Ausstehend'}
            {tab === 'approved' && 'Bestätigt'}
            {tab === 'rejected' && 'Abgelehnt'}
          </button>
        ))}
      </div>

      {/* Grid of Appointments */}
      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                      <User className="w-4.5 h-4.5 text-red-500 shrink-0" />
                      <span>{appt.customer_name}</span>
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-300 mt-1">
                      Erhalten am: {new Date(appt.created_at).toLocaleDateString('de-CH')}
                    </p>
                  </div>
                  <span className={`
                    text-xs px-2.5 py-1 rounded-full font-semibold border
                    ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900' : ''}
                    ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' : ''}
                    ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' : ''}
                  `}>
                    {appt.status === 'pending' && 'Ausstehend'}
                    {appt.status === 'approved' && 'Bestätigt'}
                    {appt.status === 'rejected' && 'Abgelehnt'}
                  </span>
                </div>

                {/* Contact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t border-slate-100 dark:border-slate-700 pt-3.5 text-slate-700 dark:text-slate-200">
                  <a href={`tel:${appt.phone}`} className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Phone className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{appt.phone}</span>
                  </a>
                  <a href={`mailto:${appt.email}`} className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Mail className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="truncate">{appt.email}</span>
                  </a>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{new Date(appt.preferred_date).toLocaleDateString('de-CH')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Clock className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{appt.preferred_time} Uhr</span>
                  </div>
                </div>

                {/* Vehicle & Services */}
                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-700 pt-3.5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                    <Car className="w-4.5 h-4.5 text-red-500 shrink-0" />
                    <span>{appt.vehicle_info}</span>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {appt.selected_services.map((srv) => (
                      <span key={srv} className="inline-block bg-slate-150 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1 rounded-full font-semibold border border-slate-200 dark:border-slate-600">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {appt.notes && (
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <MessageSquare className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="italic">{appt.notes}</p>
                  </div>
                )}

                {/* Damage Images */}
                {appt.image_urls && appt.image_urls.length > 0 && (
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-slate-400 dark:text-slate-350 uppercase tracking-wider">Schadenfotos</span>
                    <div className="flex gap-2 flex-wrap">
                      {appt.image_urls.map((url) => (
                        <div 
                          key={url} 
                          onClick={() => setSelectedImage(url)}
                          className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 cursor-zoom-in relative group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="Schaden" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
 
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700 mt-4">
                {appt.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleStatusChange(appt.id, 'rejected')}
                      className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                      <span>Ablehnen</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(appt.id, 'approved')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Bestätigen</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDelete(appt.id)}
                    className="w-full py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:border-red-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Termin löschen</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500">
          Keine Terminanfragen in dieser Kategorie.
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Schaden gross" className="object-contain max-h-[80vh] w-full" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
