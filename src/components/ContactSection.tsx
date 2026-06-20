"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Phone, Mail, MapPin, Clock, ArrowUpRight, Copy, Check } from "lucide-react";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.025 13.91 1.002 11.998 1.002c-5.441 0-9.865 4.372-9.87 9.802-.002 1.8.48 3.55 1.396 5.095L2.516 21.9l6.131-1.746zm11.758-5.321c-.328-.164-1.942-.959-2.242-1.069-.3-.11-.519-.164-.737.164-.219.328-.847 1.069-1.039 1.288-.192.219-.384.246-.712.082-1.799-.899-3.036-1.579-4.048-3.328-.266-.46.266-.427.761-1.417.082-.164.041-.308-.021-.432-.062-.124-.519-1.25-.712-1.713-.188-.452-.378-.39-.519-.398-.135-.008-.29-.01-.446-.01-.156 0-.41.059-.624.292-.214.233-.817.798-.817 1.946 0 1.148.832 2.257.949 2.42.117.164 1.638 2.502 3.97 3.508.554.24 1.055.382 1.41.495.557.177 1.063.152 1.464.092.447-.067 1.942-.794 2.215-1.52.273-.726.273-1.348.192-1.48-.082-.132-.29-.214-.618-.378z" />
  </svg>
);

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const addressText = "SAZCAR GMBH, Unterdorfstrasse 14, 8165 Schöfflisdorf ZH";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapQuery = encodeURIComponent(addressText);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contact" className="relative px-6 py-20 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200/50 dark:border-zinc-850/50 transition-colors">
      {/* Background glow accents */}
      <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-orange-500/5 blur-[100px] dark:bg-orange-500/10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-red-600/5 blur-[120px] dark:bg-red-600/15 pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-orange-500 dark:border-orange-500/40">
            {t.nav.contact}
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-black uppercase tracking-wider text-zinc-950 dark:text-white">
            {t.contact.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Side (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Address Card */}
            <div className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm hover:border-orange-500/40 dark:hover:border-orange-500/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-500">
                  <MapPin className="h-4 w-4" />
                  {t.contact.addressLabel}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                  title="Copy address"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-base font-bold text-zinc-900 dark:text-white leading-relaxed">
                SAZCAR GMBH
                <br />
                Unterdorfstrasse 14
                <br />
                8165 Schöfflisdorf ZH
              </div>
            </div>

            {/* Quick Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Phone Card */}
              <a
                href="tel:+41434228676"
                className="group flex flex-col gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm hover:border-orange-500/40 dark:hover:border-orange-500/30 hover:scale-[1.01] transition-all duration-200"
              >
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-500">
                  <Phone className="h-4 w-4" />
                  {t.contact.phoneLabel}
                </span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  043 422 86 76
                </span>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/41764717981"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm hover:border-green-500/40 dark:hover:border-green-500/30 hover:scale-[1.01] transition-all duration-200"
              >
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-500">
                  <WhatsAppIcon className="h-4 w-4" />
                  {t.contact.whatsappLabel}
                </span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-green-500 transition-colors">
                  +41 76 471 79 81
                </span>
              </a>

              {/* Email Card (span 2 on small screen or flex) */}
              <a
                href="mailto:info@sazcar.ch"
                className="sm:col-span-2 group flex flex-col gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm hover:border-orange-500/40 dark:hover:border-orange-500/30 hover:scale-[1.01] transition-all duration-200"
              >
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-500">
                  <Mail className="h-4 w-4" />
                  {t.contact.emailLabel}
                </span>
                <span className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors break-all">
                  info@sazcar.ch
                </span>
              </a>

            </div>

            {/* Opening Hours Card */}
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-500">
                <Clock className="h-4 w-4" />
                {t.contact.hoursLabel}
              </span>
              <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800/50">
                  <span>{t.footer.hoursWeekdays.split(":")[0]}</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">
                    {t.footer.hoursWeekdays.substring(t.footer.hoursWeekdays.indexOf(":") + 1).trim()}
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800/50">
                  <span>{t.footer.hoursSaturday.split(":")[0]}</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-200">
                    {t.footer.hoursSaturday.substring(t.footer.hoursSaturday.indexOf(":") + 1).trim()}
                  </span>
                </li>
                <li className="flex justify-between pb-1">
                  <span>{t.footer.hoursSunday.split(":")[0]}</span>
                  <span className="font-bold text-red-500 dark:text-red-400">
                    {t.footer.hoursSunday.substring(t.footer.hoursSunday.indexOf(":") + 1).trim()}
                  </span>
                </li>
              </ul>
            </div>

            {/* Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 py-4.5 px-6 text-base font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
            >
              <MapPin className="h-5 w-5" />
              <span>{t.contact.directionsBtn.split("(")[0].trim()}</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>

          </div>

          {/* Map Side (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-grow min-h-[350px] lg:min-h-[450px] h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md group hover:border-orange-500/30 transition-all duration-300">
              
              {/* Google Map iframe */}
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full grayscale-[15%] dark:grayscale-[50%] contrast-[110%] group-hover:grayscale-0 group-hover:scale-[1.01] transition-all duration-500"
                title="SazCar Garage Location Map"
              />
              
              {/* Floating Overlay Badge (directions quick link) */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-zinc-950/85 backdrop-blur-md px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white border border-zinc-800 shadow-lg hover:bg-orange-500 hover:border-orange-400 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <MapPin className="h-4.5 w-4.5 text-orange-500 group-hover:text-white" />
                <span>Google Maps</span>
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
