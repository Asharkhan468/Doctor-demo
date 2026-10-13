'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { Search, User, Stethoscope, FileText, X, ArrowRight } from 'lucide-react';

export function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const { patients, consultations, clinicalNotes } = useClinote();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredPatients = query
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.id.toLowerCase().includes(trimmed) ||
          p.medicalHistory.some((m) => m.toLowerCase().includes(trimmed))
      )
    : patients.slice(0, 3);

  const filteredConsultations = query
    ? consultations.filter((c) => {
        const patient = patients.find((p) => p.id === c.patientId);
        return (
          c.id.toLowerCase().includes(trimmed) ||
          c.chiefComplaint.toLowerCase().includes(trimmed) ||
          c.type.toLowerCase().includes(trimmed) ||
          (patient && patient.name.toLowerCase().includes(trimmed))
        );
      })
    : consultations.slice(0, 3);

  const filteredNotes = query
    ? clinicalNotes.filter((n) => {
        const patient = patients.find((p) => p.id === n.patientId);
        return (
          n.id.toLowerCase().includes(trimmed) ||
          n.title.toLowerCase().includes(trimmed) ||
          (patient && patient.name.toLowerCase().includes(trimmed))
        );
      })
    : clinicalNotes.slice(0, 3);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients, consultations, clinical notes by name or ID..."
            className="w-full py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Patients Section */}
          {filteredPatients.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-teal-600" />
                Patients
              </p>
              <div className="space-y-1">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelect(`/patients?selected=${patient.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-teal-50/60 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-teal-900">
                          {patient.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{patient.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {patient.medicalHistory.join(', ') || 'No known chronic conditions'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Consultations Section */}
          {filteredConsultations.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                Consultations
              </p>
              <div className="space-y-1">
                {filteredConsultations.map((c) => {
                  const patient = patients.find((p) => p.id === c.patientId);
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/consultations?selected=${c.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-teal-50/60 transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900 group-hover:text-teal-900">
                            {patient?.name || 'Unknown Patient'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{c.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {c.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.chiefComplaint}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {filteredNotes.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-teal-600" />
                Clinical Notes
              </p>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelect(`/notes?selected=${note.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-teal-50/60 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-teal-900">
                          {note.title}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{note.id}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-medium">
                          {note.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        Attending: {note.doctorName}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPatients.length === 0 &&
            filteredConsultations.length === 0 &&
            filteredNotes.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">No records found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-slate-400 mt-1">Try searching by patient surname, condition, or record ID</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or keyboard</span>
          <span>Clinote AI Demo Search</span>
        </div>
      </div>
    </div>
  );
}
