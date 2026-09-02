'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/components/ui/logo';
import { Menu, X, Phone, ArrowUpRight, Home, ChevronDown, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const NAV_BREAKPOINT = 1024;

const navLinks: { href: string; label: string; children: { href: string; label: string }[] }[] = [
  {
    href: '/#dienstleistungen',
    label: 'Dienstleistungen',
    children: [
      { href: '/#vorher-nachher', label: 'Vorher / Nachher' },
    ],
  },
  { href: '/hagelschaden', label: 'Hagelschaden', children: [] },
  { href: '/#occasionen', label: 'Occasionen', children: [] },
  {
    href: '/#kontakt',
    label: 'Kontakt',
    children: [
      { href: '/#termin', label: 'Termin buchen' },
      { href: '/karriere', label: 'Karriere' },
    ],
  },
];

// Flat list of every section link (parents + children) — used for scroll-spy,
// since the viewport can land on a nested section the top nav doesn't show directly.
const allLinks = navLinks.flatMap((link) => [link, ...link.children]);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  // Plain route links (no #section, e.g. /karriere) have no scroll position to spy on —
  // they're active whenever the current page matches, regardless of scroll.
  const [activeSection, setActiveSection] = useState(
    () => allLinks.find((link) => !link.href.includes('#') && link.href === pathname)?.href ?? ''
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!openDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-nav-item]')) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);
  // Set (with a timestamp) when a nav link is clicked, so the smooth-scroll animation's
  // in-between frames can't flicker the highlight back to the section being left.
  const clickLockRef = useRef<{ href: string; until: number } | null>(null);
  const CLICK_LOCK_MS = 1200;

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    clickLockRef.current = { href, until: Date.now() + CLICK_LOCK_MS };
  };

  // On the home page, scroll to top; on any other route, navigate home first.
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      router.push('/');
    }
  };

  // Header background + active section, from one scroll handler.
  // The DOM is queried on every tick, so sections that mount late (client-only
  // sections, the form's success branch) get picked up without re-registering.
  useEffect(() => {
    const routeMatch = allLinks.find((link) => !link.href.includes('#') && link.href === pathname);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // A plain route link stays active for the whole page — no #section to compare scroll against.
      if (routeMatch) {
        setActiveSection(routeMatch.href);
        return;
      }

      const lock = clickLockRef.current;
      if (lock && Date.now() < lock.until) {
        setActiveSection(lock.href);
        return;
      }

      // The last section whose top has passed the 40% line is the one being read.
      const line = window.innerHeight * 0.4;
      let current = '';
      let lastFoundHref = '';
      for (const link of allLinks) {
        const el = document.getElementById(link.href.split('#')[1]);
        if (!el) continue;
        lastFoundHref = link.href;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > 0) current = link.href;
      }

      // At the very bottom of the page there's no more room to scroll the last
      // section's top past the 40% line, so it would never register above — force it.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom && lastFoundHref) current = lastFoundHref;

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [pathname]);

  // Escape closes the menu
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${NAV_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Animation variants for the glass menu card (anchored under the header, not full-screen)
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -14,
      scale: 0.9,
      filter: 'blur(6px)',
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 320,
        damping: 24,
        staggerChildren: 0.055,
        delayChildren: 0.1,
      },
    },
  } as any;

  const linkVariants = {
    closed: { opacity: 0, x: 24, filter: 'blur(4px)' },
    open: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  } as any;

  // prefers-reduced-motion: keep the reveal, drop the travel
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { variants: menuVariants, initial: 'closed', animate: 'open', exit: 'closed' };
  const itemMotion = reduceMotion ? {} : { variants: linkVariants };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-50
          transition-[box-shadow,border-color] duration-300
          ${scrolled
            ? 'border-b border-slate-200/80 shadow-sm'
            : 'border-b border-transparent'}
        `}
      >
        {/* Temporary Red Background Test */}
        <div className="absolute inset-0 z-[-1] pointer-events-none select-none bg-red-600" />
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          maxWidth: '1280px',
          padding: '0.1rem clamp(1rem, 0.429rem + 2.857vw, 3rem)',
        }}
      >
        <div className="flex items-center gap-1">
          <Link href="/" aria-label="Startseite">
            <Logo />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center gap-2"
          style={{
            display: 'var(--nav-display, none)',
          }}
        >
          <style>{`@media(min-width:${NAV_BREAKPOINT}px){:root{--nav-display:flex}}`}</style>
          <a
            href="/"
            onClick={handleHomeClick}
            aria-label="Zum Seitenanfang"
            className="relative p-2.5 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-xl bg-red-500/25"
                animate={{ opacity: [0.15, 0.65, 0.15] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <Home className="relative w-6 h-6" />
          </a>
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => {
              const children = link.children;
              const isActive =
                activeSection === link.href || children.some((c) => c.href === activeSection);
              const isOpen = openDropdown === link.href;

              return (
                <li key={link.href} className="relative group" data-nav-item>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      // Touch has no hover, so the dropdown preview mouse users get for free
                      // never happens — first tap must reveal it instead of navigating away blind.
                      // Second tap (dropdown already open) commits to the link, like a mouse click.
                      const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
                      if (children.length > 0 && isTouch && !isOpen) {
                        e.preventDefault();
                        setOpenDropdown(link.href);
                        return;
                      }
                      handleNavClick(link.href);
                      setOpenDropdown(null);
                    }}
                    className={`relative flex items-center gap-1 px-2.5 xl:px-3 py-1 text-sm xl:text-base font-normal transition-colors rounded-lg ${
                      isActive
                        ? 'text-red-600 bg-white shadow-2xs'
                        : 'text-white hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {link.label}
                    {children.length > 0 && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`${link.label} Untermenü ${isOpen ? 'schliessen' : 'öffnen'}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdown(isOpen ? null : link.href);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenDropdown(isOpen ? null : link.href);
                          }
                        }}
                        className="p-2.5 -m-2.5 rounded"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </span>
                    )}
                  </a>

                  {children.length > 0 && (
                    <div className={`absolute left-0 top-full pt-2 z-50 ${isOpen ? 'block' : 'hidden group-hover:block group-focus-within:block'}`}>
                      <ul className="min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-lg p-1.5">
                        {children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              onClick={() => {
                                handleNavClick(child.href);
                                setOpenDropdown(null);
                              }}
                              className={`block px-3 py-2 rounded-lg text-sm font-normal transition-colors ${
                                activeSection === child.href
                                  ? 'text-red-600 bg-red-50'
                                  : 'text-slate-700 hover:text-red-600 hover:bg-slate-100'
                              }`}
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Call CTA */}
          <a
            href="tel:+41434228676"
            className="ml-2 xl:ml-4 flex items-center gap-1.5 xl:gap-2 bg-red-600 hover:bg-red-700 text-white font-normal text-xs xl:text-sm px-3 xl:px-4 py-2 rounded-xl transition-all shadow-sm shadow-red-900/10 shrink-0"
          >
            <Phone className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            <span>Jetzt anrufen</span>
          </a>
        </nav>

        {/* Mobile Home button + Mobile hamburger button */}
        <div className="flex items-center gap-1.5 lg:hidden relative z-50">
          <a
            href="/"
            onClick={handleHomeClick}
            aria-label="Startseite"
            className="p-2 text-white hover:bg-white/20 rounded-xl transition-all flex items-center justify-center"
          >
            <Home className="w-6 h-6 text-white" />
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`p-2.5 rounded-xl transition-colors ${
              menuOpen ? 'text-white bg-red-600 shadow-md shadow-red-900/25' : 'text-white hover:bg-white/20'
            }`}
            aria-label={menuOpen ? 'Menü schliessen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
          >
            <motion.span
              className="block"
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.span>
          </button>
        </div>
      </div>
    </header>

      {/* Buzlu Cam Mobil Menü Kartı */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Arka Plan Karartması (Overlay backdrop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{
                background:
                  'radial-gradient(120% 80% at 100% 0%, rgba(220,38,38,0.20) 0%, rgba(15,23,42,0.34) 55%, rgba(15,23,42,0.44) 100%)',
              }}
            />

            {/* Menü Paneli (Drawer container) */}
            <motion.div
              {...panelMotion}
              style={{
                transformOrigin: 'top right',
                // same horizontal padding as the header row, so the card lines up with the burger
                right: 'clamp(1rem, 0.429rem + 2.857vw, 3rem)',
                maxHeight: 'calc(100vh - 5.5rem)',
                background:
                  'linear-gradient(160deg, rgba(255,255,255,0.78) 0%, rgba(254,226,226,0.52) 45%, rgba(254,202,202,0.55) 100%)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                boxShadow:
                  '0 28px 70px -20px rgba(15,23,42,0.4), 0 14px 34px -14px rgba(220,38,38,0.65), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
              className="fixed top-[4.75rem] z-50 w-[min(88vw,340px)] overflow-y-auto rounded-[22px] border border-red-200/70 p-4 flex flex-col lg:hidden"
            >
              {/* Cam üzerinde ışık huzmesi */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[22px]"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 32%, rgba(255,255,255,0.5) 46%, transparent 62%)',
                }}
              />

              {/* Üst Kısım: Başlık & Kapat Butonu */}
              <motion.div {...itemMotion} className="relative flex items-center justify-between pl-1">
                <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  Navigation
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-white/70 hover:rotate-90 transition-all duration-300 cursor-pointer"
                  aria-label="Menü schliessen"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>

              {/* Büyük Tipografili Linkler (High contrast active indicator) */}
              <div className="relative flex flex-col gap-1 mt-3">
                {/* Startseite (Home) link */}
                <motion.div {...itemMotion}>
                  <a
                    href="/"
                    onClick={(e) => {
                      handleHomeClick(e);
                      setMenuOpen(false);
                    }}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[16px] font-normal tracking-tight transition-all duration-300 ${
                      pathname === '/' && activeSection === ''
                        ? 'text-white'
                        : 'text-black hover:text-red-600 hover:bg-white/60 hover:translate-x-1'
                    }`}
                    style={
                      pathname === '/' && activeSection === ''
                        ? {
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)',
                            boxShadow: '0 10px 22px -12px rgba(220,38,38,0.85)',
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-mono font-normal transition-colors ${
                        pathname === '/' && activeSection === ''
                          ? 'bg-white/25 text-white'
                          : 'bg-white/70 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                    </span>
                    <span className="flex-1">Startseite</span>
                    <ArrowUpRight
                      className={`w-[18px] h-[18px] shrink-0 transition-all duration-300 ${
                        pathname === '/' && activeSection === ''
                          ? 'opacity-100 translate-x-0 text-white'
                          : 'opacity-0 -translate-x-2 text-red-600 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </a>
                </motion.div>

                {navLinks.map((link, idx) => {
                  const isActive = activeSection === link.href;
                  const children = link.children;
                  return (
                    <motion.div key={link.label} {...itemMotion}>
                      <a
                        href={link.href}
                        onClick={() => {
                          handleNavClick(link.href);
                          setMenuOpen(false);
                        }}
                        aria-current={isActive ? 'true' : undefined}
                        className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[16px] font-normal tracking-tight transition-all duration-300 ${
                          isActive
                            ? 'text-white'
                            : 'text-black hover:text-red-600 hover:bg-white/60 hover:translate-x-1'
                        }`}
                        style={
                          isActive
                            ? {
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)',
                                boxShadow: '0 10px 22px -12px rgba(220,38,38,0.85)',
                              }
                            : undefined
                        }
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-mono font-normal transition-colors ${
                            isActive
                              ? 'bg-white/25 text-white'
                              : 'bg-white/70 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="flex-1">{link.label}</span>
                        <ArrowUpRight
                          className={`w-[18px] h-[18px] shrink-0 transition-all duration-300 ${
                            isActive
                              ? 'opacity-100 translate-x-0 text-white'
                              : 'opacity-0 -translate-x-2 text-red-600 group-hover:opacity-100 group-hover:translate-x-0'
                          }`}
                        />
                      </a>

                      {children.map((child) => {
                        const childActive = activeSection === child.href;
                        return (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={() => {
                              handleNavClick(child.href);
                              setMenuOpen(false);
                            }}
                            aria-current={childActive ? 'true' : undefined}
                            className={`flex items-center gap-2.5 rounded-xl pl-9 pr-3 py-2 -mt-1 text-sm font-normal transition-all duration-300 ${
                              childActive
                                ? 'text-red-600 bg-red-50'
                                : 'text-slate-500 hover:text-red-600 hover:bg-white/60'
                            }`}
                          >
                            <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                            <span>{child.label}</span>
                          </a>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </div>

              {/* Alt Kısım: CTA & Telefon Butonu */}
              <motion.div {...itemMotion} className="relative mt-4 pt-4 border-t border-slate-900/10">
                <a
                  href="tel:+41434228676"
                  className="group relative flex items-center justify-center gap-2 w-full py-3.5 overflow-hidden rounded-2xl bg-slate-900 text-white font-normal transition-transform duration-300 active:scale-[0.98]"
                  style={{ boxShadow: '0 10px 26px -12px rgba(15,23,42,0.8)' }}
                >
                  {/* hover parlaması */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/25 transition-all duration-700 group-hover:left-[150%]"
                  />
                  <Phone className="w-[18px] h-[18px] text-white" />
                  <span>Jetzt anrufen</span>
                </a>
                <p className="mt-2 text-center text-[11px] font-medium text-slate-500">
                  Mo–Fr 07:30–12:00, 13:15–18:00 · Sa 09:00–14:00
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
