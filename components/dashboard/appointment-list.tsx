'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import {
  Clock,
  User,
  ArrowRight,
  FileEdit,
  ExternalLink,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export function AppointmentList() {
  const router = useRouter();
  const { consultations, patients } = useClinote();
  const [filter, setFilter] = useState<'All' | 'Scheduled' | 'In Progress' | 'Completed' | 'Draft'>('All');

  // Filter consultations for today or recent
  const todayConsultations = consultations
    .filter((c) => filter === 'All' || c.status === filter)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Header & Filter Tabs */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Today&apos;s Consultation Schedule</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {todayConsultations.length} appointments
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tuesday, October 13, 2026 • MetroHealth Internal Medicine Clinic
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Scheduled', 'In Progress', 'Completed', 'Draft'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table list */}
      {todayConsultations.length === 0 ? (
        <div className="py-12 text-center">
          <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">No consultations in this filter</p>
          <p className="text-xs text-slate-400 mt-0.5">All scheduled encounters are accounted for.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 pl-5">Time</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Encounter Type</th>
                <th className="py-3 px-4">Chief Complaint</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {todayConsultations.map((c) => {
                const patient = patients.find((p) => p.id === c.patientId);

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/consultations/new?consultationId=${c.id}`)}
                  >
                    <td className="py-3.5 px-4 pl-5 whitespace-nowrap font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatTime(c.time)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center justify-center text-[10px] shrink-0">
                          {patient?.name
                            ? patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : 'PT'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {patient?.name || 'Unknown Patient'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{c.patientId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                        {c.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-600">
                      <p className="truncate line-clamp-1">{c.chiefComplaint}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3.5 px-4 pr-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/consultations/new?consultationId=${c.id}`}>
                          <Button
                            variant={c.status === 'In Progress' || c.status === 'Draft' ? 'primary' : 'outline'}
                            size="sm"
                            className="text-xs h-7 px-2.5 font-medium"
                          >
                            {c.status === 'In Progress' ? (
                              'Resume Desk'
                            ) : c.status === 'Draft' ? (
                              'Continue Draft'
                            ) : c.status === 'Completed' ? (
                              'View Note'
                            ) : (
                              'Start Encounter'
                            )}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {todayConsultations.length} appointments</span>
        <Link
          href="/consultations"
          className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
        >
          <span>View all consultations</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
