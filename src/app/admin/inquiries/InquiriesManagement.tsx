'use client';

import React, { useState } from 'react';
import { updateInquiryStatus, deleteInquiry } from '../actions/inquiries';
import { 
  Search, 
  Trash2, 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Car,
  MessageSquare
} from 'lucide-react';

interface Inquiry {
  id: string;
  car_id: string | null;
  car_title: string;
  car_price: string | number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_message: string | null;
  status: 'pending' | 'contacted' | 'completed' | string;
  created_at: string;
}

interface InquiriesManagementProps {
  initialInquiries: Inquiry[];
}

export default function InquiriesManagement({ initialInquiries }: InquiriesManagementProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = 
      inquiry.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      inquiry.customer_phone.includes(search) ||
      inquiry.car_title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateInquiryStatus(id, newStatus);
    if (res.error) {
      alert(res.error);
    } else {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Anfrage wirklich löschen?')) return;

    const res = await deleteInquiry(id);
    if (res.error) {
      alert(res.error);
    } else {
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Erledigt
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Kontaktiert
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200">
            <Clock className="w-3.5 h-3.5" /> Neu (Offen)
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Name, E-Mail, Auto suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-900 dark:text-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'pending', 'contacted', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                filterStatus === st
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900'
              }`}
            >
              {st === 'all' && 'Alle'}
              {st === 'pending' && 'Offen'}
              {st === 'contacted' && 'Kontaktiert'}
              {st === 'completed' && 'Erledigt'}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiry List */}
      {filteredInquiries.length > 0 ? (
        <div className="space-y-3">
          {filteredInquiries.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Vehicle Badge & Customer Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-normal border border-amber-200">
                      <Car className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Anfrage für: {item.car_title} ({typeof item.car_price === 'number' ? `CHF ${item.car_price.toLocaleString()}` : item.car_price})
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <User className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{item.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <a href={`tel:${item.customer_phone}`} className="hover:underline text-red-600">
                        {item.customer_phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <a href={`mailto:${item.customer_email}`} className="hover:underline text-red-600">
                        {item.customer_email}
                      </a>
                    </div>
                  </div>

                  {item.customer_message && (
                    <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="italic">"{item.customer_message}"</span>
                    </div>
                  )}
                </div>

                {/* Actions & Status Selector */}
                <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('de-CH')}
                    </span>

                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="pending">Status: Offen</option>
                      <option value="contacted">Status: Kontaktiert</option>
                      <option value="completed">Status: Erledigt</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Löschen"
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500">
          Keine Fahrzeug-Anfragen vorhanden.
        </div>
      )}
    </div>
  );
}
