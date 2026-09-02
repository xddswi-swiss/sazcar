'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from './actions/auth';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Gauge,
  Tag,
  Briefcase,
  Inbox
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If we are on the login page, don't show the admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { href: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects/new', name: 'Neuer Auftrag', icon: ClipboardList },
    { href: '/admin/appointments', name: 'Termine', icon: CalendarCheck },
    { href: '/admin/cars', name: 'Occasionen', icon: Car },
    { href: '/admin/inquiries', name: 'Auto-Anfragen', icon: Inbox },
    { href: '/admin/promotions', name: 'Aktionen', icon: Tag },
    { href: '/admin/jobs', name: 'Stellenangebote', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-red-600">
            <Gauge className="w-6 h-6" />
            <span>GARAGE ADMIN</span>
          </Link>
          <button 
            type="button"
            className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/10' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Abmelden</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white capitalize">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
