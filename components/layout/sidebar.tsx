'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClinote } from '@/lib/context';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const { patients, consultations, clinicalNotes, settings } = useClinote();

  const draftNotesCount = clinicalNotes.filter((n) => n.status === 'Draft' || n.status === 'Reviewed').length;
  const activeConsultationsCount = consultations.filter((c) => c.status === 'Scheduled' || c.status === 'In Progress').length;

  const navItems = [
    {
      title: 'Overview',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/' || pathname === '/dashboard',
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
      badge: patients.length,
      active: pathname.startsWith('/patients'),
    },
    {
      title: 'Consultations',
      href: '/consultations',
      icon: Stethoscope,
      badge: activeConsultationsCount > 0 ? activeConsultationsCount : undefined,
      active: pathname.startsWith('/consultations'),
    },
    {
      title: 'Clinical Notes',
      href: '/notes',
      icon: FileText,
      badge: draftNotesCount > 0 ? `${draftNotesCount} review` : undefined,
      badgeColor: 'amber',
      active: pathname.startsWith('/notes'),
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      active: pathname.startsWith('/settings'),
    },
  ];

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-slate-900 text-slate-100 transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-slate-800',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand / Logo Header */}
        <div className="flex flex-col px-6 pt-6 pb-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20 font-bold group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">Clinote</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal tracking-tight">Clinical Assistant</p>
            </div>
          </Link>
          <div className="mt-3.5 px-2.5 py-1.5 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="truncate">Less paperwork. More care.</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group',
                  item.active
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5 transition-colors',
                      item.active ? 'text-white' : 'text-slate-400 group-hover:text-teal-300'
                    )}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      item.active
                        ? 'bg-teal-800 text-teal-100'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Safety Notice Badge */}
        <div className="px-4 py-2 mx-3 mb-3 rounded-lg bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-tight">
            Commercial SaaS Demo. Synthetic clinical records.
          </p>
        </div>

        {/* Doctor User Profile Card at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <Link
            href="/settings"
            onClick={handleNavClick}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/80 transition-colors group"
          >
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-teal-800/80 border border-teal-600/50 flex items-center justify-center text-teal-200 font-bold text-xs">
                SM
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate group-hover:text-teal-200">
                {settings.doctor.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{settings.doctor.specialty}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  );
}
