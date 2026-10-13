'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopNav } from './top-nav';
import { ToastContainer } from '@/components/ui/toast';
import { ClinoteProvider } from '@/lib/context';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ClinoteProvider>
      <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased selection:bg-teal-500/20 selection:text-teal-900">
        {/* Desktop & Mobile Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex flex-col lg:pl-64 min-h-screen">
          <TopNav onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>

        {/* Floating Toast Notification Container */}
        <ToastContainer />
      </div>
    </ClinoteProvider>
  );
}
