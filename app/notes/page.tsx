'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { ClinicalNote, NoteStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  FileText,
  Search,
  Copy,
  Edit3,
  CheckCircle2,
  Sparkles,
  Download,
  Save,
} from 'lucide-react';

function ClinicalNotesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get('selected');
  const statusParam = searchParams.get('status');

  const { clinicalNotes, patients, consultations, editNote, finalizeNote, showToast } = useClinote();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | NoteStatus>(
    (statusParam as NoteStatus) || 'All'
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  // Auto-select note if param exists or pick first note
  useEffect(() => {
    if (selectedParam) {
      const match = clinicalNotes.find((n) => n.id === selectedParam);
      if (match) {
        setSelectedNoteId(match.id);
        setEditedContent(match.fullFormattedNote);
      }
    } else if (!selectedNoteId && clinicalNotes.length > 0) {
      setSelectedNoteId(clinicalNotes[0].id);
      setEditedContent(clinicalNotes[0].fullFormattedNote);
    }
  }, [selectedParam, clinicalNotes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    return clinicalNotes.filter((note) => {
      const matchesStatus = statusFilter === 'All' || note.status === statusFilter;
      const patient = patients.find((p) => p.id === note.patientId);
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        note.id.toLowerCase().includes(q) ||
        note.title.toLowerCase().includes(q) ||
        note.fullFormattedNote.toLowerCase().includes(q) ||
        (patient && patient.name.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [clinicalNotes, patients, searchQuery, statusFilter]);

  const selectedNote = useMemo(() => {
    return clinicalNotes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || null;
  }, [clinicalNotes, selectedNoteId, filteredNotes]);

  const selectedPatient = useMemo(() => {
    return selectedNote ? patients.find((p) => p.id === selectedNote.patientId) : null;
  }, [selectedNote, patients]);

  const selectedConsultation = useMemo(() => {
    return selectedNote ? consultations.find((c) => c.id === selectedNote.consultationId) : null;
  }, [selectedNote, consultations]);

  const handleSelectNote = (note: ClinicalNote) => {
    setSelectedNoteId(note.id);
    setEditedContent(note.fullFormattedNote);
    setIsEditing(false);
  };

  const handleSaveEdits = () => {
    if (!selectedNote) return;
    const hasChanged = editedContent !== selectedNote.fullFormattedNote;
    const updated: ClinicalNote = {
      ...selectedNote,
      fullFormattedNote: editedContent,
      status: hasChanged ? 'Draft' : selectedNote.status,
      reviewedAt: hasChanged ? undefined : selectedNote.reviewedAt,
      finalizedAt: hasChanged ? undefined : selectedNote.finalizedAt,
      updatedAt: new Date().toISOString(),
    };
    editNote(updated);
    setIsEditing(false);
    showToast(
      hasChanged
        ? 'Changes saved. The note is now a draft and must be reviewed again.'
        : 'Clinical note saved.',
      'info',
      'Saved'
    );
  };

  const handleCopy = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(editedContent || selectedNote.fullFormattedNote);
    showToast('Clinical note copied to clipboard.', 'info', 'Copied');
  };

  const handleDownload = () => {
    if (!selectedNote) return;
    const element = document.createElement('a');
    const file = new Blob([editedContent || selectedNote.fullFormattedNote], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedNote.id}_${selectedNote.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Clinical note downloaded as text file.', 'success', 'Downloaded');
  };

  const handleConfirmFinalize = () => {
    if (!selectedNote) return;
    finalizeNote(selectedNote.id);
    setIsFinalizeModalOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Clinical Notes Library</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {clinicalNotes.length} Documented Notes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, review, sign, and export standardized SOAP documentation for all clinic consultations.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => router.push('/consultations/new')}
          className="gap-1.5 font-semibold"
        >
          <Sparkles className="h-4 w-4" />
          Create Note with AI
        </Button>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Notes List & Filter (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by patient or title..."
                className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {(['All', 'Draft', 'Reviewed', 'Finalized'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
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

          {/* Notes Cards List */}
          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No clinical notes match this query.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const patient = patients.find((p) => p.id === note.patientId);
                const isSelected = selectedNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-500/80 ring-1 ring-teal-500/30 shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {patient?.name || 'Unknown'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{note.id}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">{note.title}</p>
                      </div>
                      <StatusBadge status={note.status} />
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                      {note.content.subjective.split('\n')[0] || note.fullFormattedNote.slice(0, 90)}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-teal-600" />
                        {note.generatedBy}
                      </span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Formal Document Viewer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedNote ? (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              {/* Document Action Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedNote.status} />
                  <span className="text-xs text-slate-500">
                    ID: <strong className="font-mono text-slate-700">{selectedNote.id}</strong>
                  </span>
                </div>

                {/* Document Actions */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={isEditing ? 'primary' : 'outline'}
                    size="sm"
                    className="h-8 text-xs px-2.5"
                    onClick={() => {
                      if (selectedConsultation) {
                        router.push(`/consultations/new?consultationId=${selectedConsultation.id}`);
                      } else if (isEditing) handleSaveEdits();
                      else setIsEditing(true);
                    }}
                  >
                    {selectedConsultation ? (
                      <>
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Edit SOAP
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="h-3.5 w-3.5 mr-1" />
                        Save Edits
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Edit Note
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-2.5"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-2.5"
                    onClick={handleDownload}
                    title="Download as text document"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>

                  {selectedNote.status !== 'Finalized' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-8 text-xs px-3 font-semibold"
                      onClick={() => setIsFinalizeModalOpen(true)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Sign & Finalize
                    </Button>
                  )}
                </div>
              </div>

              {/* Patient Banner */}
              {selectedPatient && (
                <div className="px-5 py-3.5 bg-slate-100/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{selectedPatient.name}</span>
                    <span className="text-slate-500 font-mono">({selectedPatient.id})</span>
                    <span>•</span>
                    <span className="text-slate-600">DOB: {selectedPatient.dateOfBirth}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedConsultation && (
                      <span className="text-slate-500">
                        Encounter: {selectedConsultation.type} ({formatDate(selectedConsultation.date)})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Status Notice */}
              <div
                className={`px-5 py-2.5 border-b text-xs flex items-center gap-2 ${
                  selectedNote.status === 'Finalized'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-amber-50 border-amber-100 text-amber-800'
                }`}
              >
                {selectedNote.status === 'Finalized' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Approved in this demo:</strong> Marked finalized by{' '}
                      {selectedNote.doctorName} on{' '}
                      {selectedNote.finalizedAt ? formatDate(selectedNote.finalizedAt) : 'the recorded date'}.
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>AI-Assisted Clinical Draft ({selectedNote.status}):</strong> Attending physician
                      review is mandatory before final sign-off.
                    </span>
                  </>
                )}
              </div>

              {/* Document Text Body */}
              <div className="p-6">
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Editing document body in raw markdown/SOAP format</span>
                      <button
                        onClick={() => {
                          setEditedContent(selectedNote.fullFormattedNote);
                          setIsEditing(false);
                        }}
                        className="text-slate-400 hover:text-slate-700 underline text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      rows={22}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-4 rounded-xl border border-teal-400 bg-white font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 leading-relaxed resize-y"
                    />
                  </div>
                ) : (
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {editedContent || selectedNote.fullFormattedNote}
                  </div>
                )}
              </div>

              {/* Document Footer / Audit Stamp */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>Created: {formatDate(selectedNote.createdAt)}</span>
                {selectedNote.finalizedAt && (
                  <span className="text-emerald-700 font-semibold">
                    Sign-off: {formatDate(selectedNote.finalizedAt)}
                  </span>
                )}
                <span>Clinote AI Clinical Audit System</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <FileText className="h-10 w-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Select a clinical note</p>
              <p className="text-xs mt-1">Choose a note from the left panel to review its contents.</p>
            </div>
          )}
        </div>
      </div>

      {/* Finalize Confirmation Modal */}
      <ConfirmDialog
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        onConfirm={handleConfirmFinalize}
        title="Sign & Finalize Clinical Note"
        description="Confirm that you reviewed the Subjective, Objective, Assessment, and Plan sections and want to mark this note approved in the demo."
        confirmText="Confirm & Sign Note"
        cancelText="Keep as Draft"
        variant="primary"
      />
    </div>
  );
}

export default function ClinicalNotesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading clinical notes library...
        </div>
      }
    >
      <ClinicalNotesContent />
    </React.Suspense>
  );
}
