"use client";

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Clock, MapPin, Phone, Mail, Car } from "lucide-react";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} style={props.style}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 2.025 13.91 1.002 11.998 1.002c-5.441 0-9.865 4.372-9.87 9.802-.002 1.8.48 3.55 1.396 5.095L2.516 21.9l6.131-1.746zm11.758-5.321c-.328-.164-1.942-.959-2.242-1.069-.3-.11-.519-.164-.737.164-.219.328-.847 1.069-1.039 1.288-.192.219-.384.246-.712.082-1.799-.899-3.036-1.579-4.048-3.328-.266-.46.266-.427.761-1.417.082-.164.041-.308-.021-.432-.062-.124-.519-1.25-.712-1.713-.188-.452-.378-.39-.519-.398-.135-.008-.29-.01-.446-.01-.156 0-.41.059-.624.292-.214.233-.817.798-.817 1.946 0 1.148.832 2.257.949 2.42.117.164 1.638 2.502 3.97 3.508.554.24 1.055.382 1.41.495.557.177 1.063.152 1.464.092.447-.067 1.942-.794 2.215-1.52.273-.726.273-1.348.192-1.48-.082-.132-.29-.214-.618-.378z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-zinc-200 bg-black shadow-sm dark:border-zinc-800 flex items-center justify-center">
                <img src="/assets/images/logo.png" alt="SazCar Logo" className="h-8 w-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-black dark:text-white uppercase">
                  SAZCAR GMBH
                </span>
              </div>
            </div>
            <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Opening Hours Column */}
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              <Clock className="h-5 w-5 text-orange-500" />
              {t.footer.hoursTitle}
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex justify-between border-b border-zinc-200/50 pb-1.5 dark:border-zinc-800/50">
                <span>{t.footer.hoursWeekdays.split(":")[0]}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {t.footer.hoursWeekdays.substring(t.footer.hoursWeekdays.indexOf(":") + 1)}
                </span>
              </li>
              <li className="flex justify-between border-b border-zinc-200/50 pb-1.5 dark:border-zinc-800/50">
                <span>{t.footer.hoursSaturday.split(":")[0]}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                  {t.footer.hoursSaturday.substring(t.footer.hoursSaturday.indexOf(":") + 1)}
                </span>
              </li>
              <li className="flex justify-between pb-1">
                <span>{t.footer.hoursSunday.split(":")[0]}</span>
                <span className="font-semibold text-red-500">
                  {t.footer.hoursSunday.substring(t.footer.hoursSunday.indexOf(":") + 1)}
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
              <MapPin className="h-5 w-5 text-orange-500" />
              {t.footer.contactTitle}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-600" />
                <span className="whitespace-pre-line">{t.footer.address}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-600" />
                <a href="tel:+41434228676" className="hover:text-orange-500 transition-colors">
                  043 422 86 76
                </a>
              </li>
              <li className="flex gap-2">
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-600" />
                <a href="https://wa.me/41764717981" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                  +41 76 471 79 81
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-600" />
                <a href="mailto:sazcargmbh@gmail.com" className="hover:text-orange-500 transition-colors">
                  sazcargmbh@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-600">
          <p>© {currentYear} SAZCAR GARAGE. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
};
