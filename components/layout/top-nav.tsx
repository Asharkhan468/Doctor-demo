'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClinote } from '@/lib/context';
import {
  Menu,
  Search,
  Plus,
  Database,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from './global-search';
import { NotificationsPopover } from './notifications-popover';
import { Modal } from '@/components/ui/modal';

export function TopNav({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const pathname = usePathname();
  const { settings } = useClinote();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDemoInfoOpen, setIsDemoInfoOpen] = useState(false);

  // Derive title from pathname
  let pageTitle = 'Dashboard Overview';
  let pageSubtitle = 'Clinical activity, consultations schedule, and draft notes';

  if (pathname.startsWith('/patients')) {
    pageTitle = 'Patient Management';
    pageSubtitle = 'Directory of active patients, health records, and clinical histories';
  } else if (pathname === '/consultations/new') {
    pageTitle = 'New Clinical Consultation';
    pageSubtitle = 'Patient examination, subjective intake, and AI note synthesis';
  } else if (pathname.startsWith('/consultations')) {
    pageTitle = 'Consultations';
    pageSubtitle = 'Encounter logs, appointment tracking, and clinical reviews';
  } else if (pathname.startsWith('/notes')) {
    pageTitle = 'Clinical Notes Library';
    pageSubtitle = 'SOAP consultation documentation, drafts, and signed medical records';
  } else if (pathname.startsWith('/settings')) {
    pageTitle = 'Application Settings';
    pageSubtitle = 'Provider credentials, documentation templates, and demo data control';
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
        {/* Left Side: Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-500 leading-tight hidden md:block">{pageSubtitle}</p>
          </div>
          <div className="sm:hidden font-semibold text-slate-900 text-sm">{pageTitle}</div>
        </div>

        {/* Right Side: Global Search, Demo Badge, Notifications, and New Consultation CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
            title="Search records (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Search patients, notes...</span>
            <kbd className="hidden lg:inline-flex items-center rounded border border-slate-300 bg-white px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Demo Mode Badge */}
          <button
            onClick={() => setIsDemoInfoOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200 rounded-full hover:bg-teal-100 transition-colors"
          >
            <Database className="h-3 w-3 text-teal-600" />
            <span>Demo Mode</span>
            <Info className="h-3 w-3 text-teal-600" />
          </button>

          {/* Notifications Popover */}
          <NotificationsPopover />

          {/* New Consultation CTA Button */}
          <Link href="/consultations/new">
            <Button size="sm" className="gap-1.5 font-semibold shadow-xs">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Consultation</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Demo Information Modal */}
      <Modal
        isOpen={isDemoInfoOpen}
        onClose={() => setIsDemoInfoOpen(false)}
        title="Clinote AI — Commercial SaaS Prototype"
        maxWidth="md"
      >
        <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-teal-900">
            <p className="font-semibold text-xs mb-1">Local Browser Persistence & Synthetic Data</p>
            <p>
              This live demonstration operates entirely within your browser storage without requiring external
              API keys or cloud EHR infrastructure. All patient records, appointments, and medical histories
              are strictly synthetic.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Demo AI Note Synthesis</h4>
            <p>
              The clinical draft generator utilizes an isolated deterministic service layer simulating
              clinical transformers. It structures provider entries into standard SOAP documentation without
              unverified medical hallucinations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-1">Configurable Architecture</h4>
            <p>
              Built with Next.js App Router, Tailwind CSS, TypeScript, and clean service abstractions ready for
              future backend APIs, PostgreSQL, HIPAA-compliant cloud storage, and real LLM endpoints.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Clinote AI • Fiverr Demo</span>
            <Button size="sm" variant="secondary" onClick={() => setIsDemoInfoOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
