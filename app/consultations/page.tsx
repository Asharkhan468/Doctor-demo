'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { Consultation, ConsultationStatus } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Stethoscope,
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  User,
  FileText,
  ChevronRight,
  ExternalLink,
  Edit,
  ArrowRight,
} from 'lucide-react';

function ConsultationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');

  const { consultations, patients, clinicalNotes } = useClinote();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ConsultationStatus>(
    (statusParam as ConsultationStatus) || 'All'
  );
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const patient = patients.find((p) => p.id === c.patientId);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.chiefComplaint.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        (patient && patient.name.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [consultations, patients, searchQuery, statusFilter]);

  const handleOpenDetail = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailModalOpen(true);
  };

  const handleResume = (consultationId: string) => {
    router.push(`/consultations/new?consultationId=${consultationId}`);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Consultations Register</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {consultations.length} Encounters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily appointments, resume in-progress clinical desks, and access consultation history.
          </p>
        </div>

        <Link href="/consultations/new">
          <Button size="sm" className="gap-1.5 font-semibold">
            <Plus className="h-4 w-4" />
            New Consultation
          </Button>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, consultation ID, or diagnosis..."
            className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Filter:
          </span>
          {(['All', 'Scheduled', 'In Progress', 'Completed', 'Draft'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {filteredConsultations.length === 0 ? (
          <div className="py-16 text-center">
            <Stethoscope className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No consultations found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No matching consultations found for &ldquo;{searchQuery}&rdquo;.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 pl-5">Date & Time</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Encounter Type</th>
                  <th className="py-3 px-4">Chief Complaint</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Clinical Note</th>
                  <th className="py-3 px-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredConsultations.map((c) => {
                  const patient = patients.find((p) => p.id === c.patientId);
                  const linkedNote = clinicalNotes.find((n) => n.id === c.clinicalNoteId);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenDetail(c)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 pl-5 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-900">{formatDate(c.date)}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(c.time)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
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

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {linkedNote ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                              linkedNote.status === 'Finalized'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            <FileText className="h-3 w-3" />
                            {linkedNote.status}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">None</span>
                        )}
                      </td>

                      <td
                        className="py-3.5 px-4 pr-5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant={
                              c.status === 'In Progress' || c.status === 'Draft'
                                ? 'primary'
                                : 'outline'
                            }
                            size="sm"
                            className="h-7 text-xs px-2.5 font-medium"
                            onClick={() => handleResume(c.id)}
                          >
                            {c.status === 'In Progress' ? (
                              'Resume'
                            ) : c.status === 'Draft' ? (
                              'Continue'
                            ) : (
                              'Open Desk'
                            )}
                          </Button>
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
          <span>Showing {filteredConsultations.length} of {consultations.length} records</span>
          <span className="text-[11px] text-slate-400">Click any row to inspect clinical record</span>
        </div>
      </div>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Encounter Record — ${selectedConsultation.id}`}
          description={`${selectedConsultation.type} • ${formatDate(selectedConsultation.date)}`}
          maxWidth="3xl"
        >
          {(() => {
            const patient = patients.find((p) => p.id === selectedConsultation.patientId);
            const note = clinicalNotes.find((n) => n.id === selectedConsultation.clinicalNoteId);

            return (
              <div className="space-y-4">
                {/* Patient Summary Header */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{patient?.name}</span>
                      <span className="font-mono text-slate-500">{selectedConsultation.patientId}</span>
                      <StatusBadge status={selectedConsultation.status} />
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Date: {formatDate(selectedConsultation.date)} at {formatTime(selectedConsultation.time)}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleResume(selectedConsultation.id);
                    }}
                  >
                    Open in Consultation Desk
                  </Button>
                </div>

                {/* Structured Clinical Entries */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Chief Complaint:
                    </span>
                    <p className="text-slate-800">{selectedConsultation.chiefComplaint || 'Not provided.'}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      History of Present Illness (HPI):
                    </span>
                    <p className="text-slate-800">{selectedConsultation.historyOfPresentIllness || 'Not provided.'}</p>
                  </div>

                  {selectedConsultation.examinationFindings && (
                    <div className="p-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Physical Examination Findings & Vitals:
                      </span>
                      <p className="text-slate-800">{selectedConsultation.examinationFindings}</p>
                    </div>
                  )}

                  {selectedConsultation.assessment && (
                    <div className="p-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Assessment:
                      </span>
                      <p className="text-slate-800 whitespace-pre-wrap">{selectedConsultation.assessment}</p>
                    </div>
                  )}

                  {selectedConsultation.plan && (
                    <div className="p-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Plan & Management:
                      </span>
                      <p className="text-slate-800 whitespace-pre-wrap">{selectedConsultation.plan}</p>
                    </div>
                  )}
                </div>

                {/* Linked Clinical Note */}
                {note && (
                  <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-teal-900">{note.title}</span>
                        <StatusBadge status={note.status} />
                      </div>
                      <p className="text-teal-700 text-[11px] mt-0.5">
                        Generated by: {note.generatedBy} • {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <Link href={`/notes?selected=${note.id}`}>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Inspect Note
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

export default function ConsultationsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading consultations register...
        </div>
      }
    >
      <ConsultationsContent />
    </React.Suspense>
  );
}
