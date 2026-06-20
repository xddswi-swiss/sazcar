"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Car } from "lucide-react";
import { Language } from "@/data/translations";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.estimate, href: "#estimate" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "de", label: "DE", flag: "🇨🇭" },
    { code: "tr", label: "TR", flag: "🇹🇷" },
    { code: "en", label: "EN", flag: "🇬🇧" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-700 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 dark:border-zinc-800 dark:bg-zinc-950/85 transition-colors overflow-visible">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-6 overflow-visible relative">
        
        {/* Logo Area */}
        <a href="#home" className="relative z-50 flex items-center group">
          <div className="absolute top-[-12px] md:top-[-16px] left-0 z-50 h-24 w-24 md:h-32 md:w-32 overflow-hidden rounded-b-2xl bg-zinc-950 border-b-4 border-x border-orange-500 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105 flex items-center justify-center p-2.5">
            <img src="/assets/images/logo.png" alt="SazCar Garage" className="h-full w-full object-contain" />
          </div>
          {/* Spacer to push menu items */}
          <div className="w-24 md:w-32 h-1" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm xl:text-base font-extrabold uppercase tracking-wider text-white hover:text-orange-200 dark:text-zinc-300 dark:hover:text-orange-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Side Tools */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 xl:gap-2 rounded-lg border border-white/20 bg-white/10 p-1 dark:border-zinc-850 dark:bg-zinc-900">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`flex items-center gap-1 rounded px-2 xl:px-2.5 py-1 text-[10px] xl:text-xs font-bold transition-all ${
                  language === lang.code
                    ? "bg-white text-orange-600 dark:bg-gradient-to-r dark:from-orange-500 dark:to-red-600 dark:text-white shadow-sm"
                    : "text-white hover:bg-white/10 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          {/* Theme Toggle (Electric Switch) */}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-white hover:bg-white/10 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-6 pt-24 pb-6 dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
          <nav className="flex flex-col gap-4 mb-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold uppercase tracking-wider text-zinc-800 hover:text-orange-500 dark:text-zinc-200 dark:hover:text-orange-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
            {/* Mobile Language Switcher */}
            <div className="flex gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLangChange(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                    language === lang.code
                      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
