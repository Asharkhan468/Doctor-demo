'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileCheck2,
  FileEdit,
  UserPlus,
  Stethoscope,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Copy,
} from 'lucide-react';

export function RecentActivityAndDrafts() {
  const router = useRouter();
  const { clinicalNotes, patients, consultations, finalizeNote, showToast } = useClinote();

  // Pending notes awaiting review or draft
  const pendingNotes = clinicalNotes
    .filter((n) => n.status === 'Draft' || n.status === 'Reviewed')
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Draft Clinical Notes Awaiting Review */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <FileEdit className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Notes Awaiting Review</h4>
                <p className="text-[11px] text-slate-500">Requires attending physician sign-off</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {pendingNotes.length} pending
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {pendingNotes.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                All clinical notes are signed and finalized.
              </div>
            ) : (
              pendingNotes.map((note) => {
                const patient = patients.find((p) => p.id === note.patientId);
                const consultation = consultations.find((c) => c.id === note.consultationId);

                return (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-teal-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{patient?.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{note.id}</span>
                          <StatusBadge status={note.status} />
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {consultation?.chiefComplaint || note.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-teal-600" />
                        AI Draft Generated
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => router.push(`/notes?selected=${note.id}`)}
                        >
                          Review Note
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          onClick={() => finalizeNote(note.id)}
                        >
                          Sign & Finalize
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href="/notes"
            className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
          >
            <span>Open notes library</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-slate-400 text-[11px]">SOAP Documentation</span>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Recent Clinical Activity</h4>
                <p className="text-[11px] text-slate-500">Live timeline of practice encounters</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">Live feed</span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-800">
                  <span className="font-semibold text-slate-900">Dr. Sarah Morgan</span> signed and
                  finalized note for <span className="font-medium text-slate-900">Eleanor Vance</span> (CON-501).
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Today at 9:25 AM • Essential Hypertension Follow-up</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Stethoscope className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-800">
                  Consultation in-progress with <span className="font-medium text-slate-900">Sophia Rodriguez</span>.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Today at 9:45 AM • Urgent Care - Acute Bronchitis</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <UserPlus className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-800">
                  New patient registered: <span className="font-medium text-slate-900">Robert Taylor</span> (PAT-1088).
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Oct 11, 2026 • Initial Care Intake</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-800">
                  AI clinical transformer synthesized draft note for <span className="font-medium text-slate-900">James O&apos;Connor</span>.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Today at 1:42 PM • Osteoarthritis & CAD checkup</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            href="/patients"
            className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
          >
            <span>View all patients</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-slate-400 text-[11px]">Audit Logging Active</span>
        </div>
      </div>
    </div>
  );
}
