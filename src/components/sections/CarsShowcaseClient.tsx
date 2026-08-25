'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Fuel, Gauge, Calendar, Mail, ArrowUpRight } from 'lucide-react';

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
}

interface CarsShowcaseClientProps {
  cars: Car[];
}

export default function CarsShowcaseClient({ cars }: CarsShowcaseClientProps) {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openDetail = (car: Car) => {
    setSelectedCar(car);
    setSelectedImageIndex(0);
  };

  return (
    <section
      id="occasionen"
      className="relative w-full overflow-hidden bg-white text-slate-800"
      style={{
        padding: 'clamp(4rem, 3rem + 4vw, 7.5rem) clamp(1rem, 0.429rem + 2.857vw, 3rem)',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        {/* Section Header */}
        <div className="text-left" style={{ marginBottom: 'clamp(2.5rem, 2rem + 2vw, 4.5rem)' }}>
          <span
            className="inline-block bg-red-50 text-red-600 border border-red-100 font-bold uppercase tracking-widest rounded-full"
            style={{
              fontSize: 'clamp(0.625rem, 0.6rem + 0.1vw, 0.75rem)',
              padding: '0.375rem 1rem',
              marginBottom: 'clamp(0.75rem, 0.5rem + 0.5vw, 1.25rem)',
            }}
          >
            Fahrzeuge zu verkaufen
          </span>
          <h2
            className="font-black tracking-tight text-slate-900"
            style={{ fontSize: 'clamp(1.75rem, 1.393rem + 1.786vw, 3rem)' }}
          >
            Aktuelle Occasionen
          </h2>
          <p
            className="text-slate-600"
            style={{
              fontSize: 'clamp(0.875rem, 0.83rem + 0.22vw, 1.0625rem)',
              maxWidth: '500px',
              marginTop: 'clamp(0.5rem, 0.375rem + 0.3vw, 1rem)',
              lineHeight: 1.6,
            }}
          >
            Geprüfte Premium-Gebrauchtwagen mit umfassender Qualitätsgarantie.
          </p>
        </div>

        {/* Car Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(1rem, 0.75rem + 0.625vw, 1.5rem)' }}
        >
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
              className="group bg-white/45 backdrop-blur-lg border border-slate-200/80 hover:border-red-400 hover:bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 cursor-pointer flex flex-col justify-between"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              onClick={() => openDetail(car)}
            >
              {/* Image Container */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {car.image_urls && car.image_urls.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={car.image_urls[0]}
                    alt={car.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Keine Bilder verfügbar
                  </div>
                )}
              </div>

              {/* Details Content */}
              <div style={{ padding: 'clamp(1.25rem, 1rem + 0.5vw, 1.5rem)' }}>
                <h3
                  className="font-bold text-slate-900 tracking-tight line-clamp-1 group-hover:text-red-650 transition-colors"
                  style={{ fontSize: 'clamp(0.9375rem, 0.9rem + 0.12vw, 1.125rem)' }}
                >
                  {car.title}
                </h3>

                <div
                  className="flex items-center flex-wrap text-slate-500 font-semibold"
                  style={{
                    gap: 'clamp(0.5rem, 0.375rem + 0.3vw, 0.75rem)',
                    marginTop: '0.5rem',
                    fontSize: 'clamp(0.75rem, 0.73rem + 0.08vw, 0.8125rem)',
                  }}
                >
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-red-600" /> {car.year}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <Gauge className="w-3.5 h-3.5 text-red-600" /> {car.mileage.toLocaleString('de-CH')} km
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <Fuel className="w-3.5 h-3.5 text-red-600" /> {car.fuel_type}
                  </span>
                </div>

                {/* Pricing & CTA */}
                <div
                  className="flex items-center justify-between border-t border-slate-100"
                  style={{ marginTop: '1.25rem', paddingTop: '1rem' }}
                >
                  <span
                    className="font-black text-slate-900"
                    style={{ fontSize: 'clamp(1.125rem, 1rem + 0.3vw, 1.375rem)' }}
                  >
                    CHF {car.price.toLocaleString('de-CH')}.-
                  </span>
                  <span
                    className="text-red-600 font-bold flex items-center gap-1 transition-all text-xs"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs"
          style={{ padding: 'clamp(1rem, 0.5rem + 1vw, 2rem)' }}
          onClick={() => setSelectedCar(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-2xl w-full overflow-hidden flex flex-col"
            style={{ maxWidth: '750px', maxHeight: '85svh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 tracking-tight" style={{ fontSize: 'clamp(1rem, 0.95rem + 0.2vw, 1.25rem)' }}>
                {selectedCar.title}
              </h3>
              <button
                onClick={() => setSelectedCar(null)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Image Slideshow */}
              {selectedCar.image_urls && selectedCar.image_urls.length > 0 && (
                <div>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedCar.image_urls[selectedImageIndex]}
                      alt={selectedCar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedCar.image_urls.length > 1 && (
                    <div className="flex gap-2.5 mt-2.5 overflow-x-auto pb-1.5">
                      {selectedCar.image_urls.map((url, idx) => (
                        <button
                          key={url}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-colors cursor-pointer ${
                            idx === selectedImageIndex
                              ? 'border-red-500'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Marke', value: selectedCar.brand },
                  { label: 'Modell', value: selectedCar.model },
                  { label: 'Jahrgang', value: String(selectedCar.year) },
                  { label: 'Kilometer', value: `${selectedCar.mileage.toLocaleString('de-CH')} km` },
                  { label: 'Treibstoff', value: selectedCar.fuel_type },
                  { label: 'Getriebe', value: selectedCar.transmission },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white/40 backdrop-blur-md border border-slate-200/80 p-3 rounded-2xl">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                    <span className="block font-bold text-slate-900 text-sm mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Price Banner */}
              <div className="bg-red-50 border border-red-150 p-5 rounded-2xl text-center">
                <span className="block text-xs font-bold text-red-600 uppercase tracking-wider">Verkaufspreis</span>
                <span className="block font-black text-red-600 mt-1" style={{ fontSize: 'clamp(1.5rem, 1.25rem + 0.6vw, 2rem)' }}>
                  CHF {selectedCar.price.toLocaleString('de-CH')}.-
                </span>
              </div>

              {/* Description */}
              {selectedCar.description && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">Details & Beschreibung</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {selectedCar.description}
                  </p>
                </div>
              )}
            </div>

            {/* Email Contact Action */}
            <div className="p-5 border-t border-slate-200 bg-slate-50">
              <a
                href={`mailto:sazcargmbh@gmail.com?subject=Interesse an: ${selectedCar.title}`}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Interesse bekunden / Termin vereinbaren</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
