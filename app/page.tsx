'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { StatCards } from '@/components/dashboard/stat-cards';
import { AppointmentList } from '@/components/dashboard/appointment-list';
import { RecentActivityAndDrafts } from '@/components/dashboard/recent-activity';
import { PatientFormModal } from '@/components/patients/patient-form-modal';
import { Button } from '@/components/ui/button';
import {
  Plus,
  UserPlus,
  FileText,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { settings, createPatient } = useClinote();
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Time-based greeting with stable hydration
  const [greeting, setGreeting] = useState('Good morning');

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const doctorLastName = settings.doctor.name.split(' ').pop() || 'Morgan';

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Practice Dashboard
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="h-3 w-3 text-slate-400" />
              {settings.doctor.clinicName}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1.5">
            {greeting}, Dr. {doctorLastName}.
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            You have consultations scheduled today and pending clinical drafts awaiting your sign-off.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPatientModalOpen(true)}
            className="text-xs h-9 font-medium"
          >
            <UserPlus className="h-4 w-4 mr-1.5 text-slate-500" />
            Add Patient
          </Button>

          <Link href="/notes?status=Draft">
            <Button variant="outline" size="sm" className="text-xs h-9 font-medium">
              <FileText className="h-4 w-4 mr-1.5 text-slate-500" />
              Review Drafts
            </Button>
          </Link>

          <Link href="/consultations/new">
            <Button size="sm" className="text-xs h-9 font-semibold gap-1.5 shadow-sm">
              <Plus className="h-4 w-4" />
              Start Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <StatCards />

      {/* Today's Schedule Table */}
      <AppointmentList />

      {/* Two-Column: Notes Awaiting Review & Recent Activity */}
      <RecentActivityAndDrafts />

      {/* Modal: Quick Add Patient */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={(newPatient) => createPatient(newPatient)}
      />
    </div>
  );
}
