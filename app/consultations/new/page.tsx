'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClinote } from '@/lib/context';
import {
  Patient,
  Consultation,
  ClinicalNote,
  ConsultationType,
  ConsultationStatus,
  NoteStatus,
} from '@/lib/types';
import { DEMO_PRESET_CASES } from '@/lib/mock-data';
import { simulateAIGeneration } from '@/lib/note-generation-service';
import { calculateAge, generateId, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PatientFormModal } from '@/components/patients/patient-form-modal';
import {
  Sparkles,
  User,
  Stethoscope,
  Copy,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  FileText,
  UserPlus,
  ShieldAlert,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Info,
  Edit3,
} from 'lucide-react';

function NewConsultationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const consultationIdParam = searchParams.get('consultationId');
  const patientIdParam = searchParams.get('patientId');

  const {
    patients,
    consultations,
    clinicalNotes,
    settings,
    createConsultation,
    editConsultation,
    createNote,
    editNote,
    finalizeNote,
    createPatient,
    showToast,
  } = useClinote();

  // Selected patient state
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [consultationDate, setConsultationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [consultationTime, setConsultationTime] = useState<string>('10:00');
  const [consultationType, setConsultationType] = useState<ConsultationType>('Follow-up');

  // Clinical inputs
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfPresentIllness, setHistoryOfPresentIllness] = useState('');
  const [reviewOfSystems, setReviewOfSystems] = useState('');
  const [examinationFindings, setExaminationFindings] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generated Note State
  const [currentNote, setCurrentNote] = useState<ClinicalNote | null>(null);
  const [noteEditMode, setNoteEditMode] = useState(false);
  const [editableFullNote, setEditableFullNote] = useState('');
  const [existingConsultationId, setExistingConsultationId] = useState<string | null>(null);

  // Modals
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isFinalizeConfirmOpen, setIsFinalizeConfirmOpen] = useState(false);

  // Load existing consultation or patient if params present
  useEffect(() => {
    if (consultationIdParam) {
      const match = consultations.find((c) => c.id === consultationIdParam);
      if (match) {
        setExistingConsultationId(match.id);
        setSelectedPatientId(match.patientId);
        setConsultationDate(match.date);
        setConsultationTime(match.time);
        setConsultationType(match.type);
        setChiefComplaint(match.chiefComplaint || '');
        setHistoryOfPresentIllness(match.historyOfPresentIllness || '');
        setReviewOfSystems(match.reviewOfSystems || '');
        setExaminationFindings(match.examinationFindings || '');
        setAssessment(match.assessment || '');
        setPlan(match.plan || '');
        setFollowUpInstructions(match.followUpInstructions || '');
        setAdditionalNotes(match.additionalNotes || '');

        // If it already has a note
        if (match.clinicalNoteId) {
          const noteMatch = clinicalNotes.find((n) => n.id === match.clinicalNoteId);
          if (noteMatch) {
            setCurrentNote(noteMatch);
            setEditableFullNote(noteMatch.fullFormattedNote);
          }
        }
      }
    } else if (patientIdParam) {
      setSelectedPatientId(patientIdParam);
    } else if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [consultationIdParam, patientIdParam, consultations, clinicalNotes, patients]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Load Demo Presets for frictionless Fiverr presentation
  const handleLoadPreset = (presetId: string) => {
    const preset = DEMO_PRESET_CASES.find((p) => p.id === presetId);
    if (!preset) return;

    // Try finding matching patient or switch to first
    const matchedPatient = patients.find((p) => p.name === preset.patientName) || selectedPatient;
    if (matchedPatient) {
      setSelectedPatientId(matchedPatient.id);
    }

    setConsultationType(preset.type);
    setChiefComplaint(preset.chiefComplaint);
    setHistoryOfPresentIllness(preset.historyOfPresentIllness);
    setReviewOfSystems(preset.reviewOfSystems);
    setExaminationFindings(preset.examinationFindings);
    setAssessment(preset.assessment);
    setPlan(preset.plan);
    setFollowUpInstructions(preset.followUpInstructions);

    showToast(`Loaded clinical preset scenario: "${preset.caseTitle}"`, 'info', 'Scenario Loaded');
  };

  // Step 3: AI Note Generation
  const handleGenerateNote = async () => {
    if (!selectedPatient) {
      showToast('Please select a patient first.', 'warning', 'Validation');
      return;
    }

    if (!chiefComplaint.trim() && !examinationFindings.trim()) {
      showToast('Please enter at least a Chief Complaint or Examination findings before generating.', 'warning', 'Missing Details');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Initiating clinical transformer...');
    setGenerationProgress(10);

    try {
      const result = await simulateAIGeneration(
        {
          patient: selectedPatient,
          doctor: settings.doctor,
          consultationType,
          date: consultationDate,
          chiefComplaint,
          historyOfPresentIllness,
          reviewOfSystems,
          examinationFindings,
          assessment,
          plan,
          followUpInstructions,
          additionalNotes,
        },
        (step, pct) => {
          setGenerationStep(step);
          setGenerationProgress(pct);
        }
      );

      const noteId = currentNote ? currentNote.id : generateId('NOTE');
      const consId = existingConsultationId || generateId('CON');

      const newNoteObj: ClinicalNote = {
        id: noteId,
        consultationId: consId,
        patientId: selectedPatient.id,
        title: result.title,
        content: result.content,
        fullFormattedNote: result.fullFormattedNote,
        generatedBy: 'Clinote AI Assistant (Draft)',
        status: currentNote?.status === 'Finalized' ? 'Finalized' : 'Draft',
        doctorName: settings.doctor.name,
        createdAt: currentNote ? currentNote.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCurrentNote(newNoteObj);
      setEditableFullNote(result.fullFormattedNote);

      // Auto-save consultation record in draft/in-progress
      const consObj: Consultation = {
        id: consId,
        patientId: selectedPatient.id,
        date: consultationDate,
        time: consultationTime,
        type: consultationType,
        chiefComplaint,
        historyOfPresentIllness,
        reviewOfSystems,
        examinationFindings,
        assessment,
        plan,
        followUpInstructions,
        additionalNotes,
        status: 'In Progress',
        clinicalNoteId: noteId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!existingConsultationId) {
        setExistingConsultationId(consId);
        createConsultation(consObj);
      } else {
        editConsultation(consObj);
      }

      if (!currentNote) {
        createNote(newNoteObj);
      } else {
        editNote(newNoteObj);
      }

      showToast('Structured AI draft generated successfully.', 'success', 'Draft Ready');
    } catch (e) {
      console.error(e);
      showToast('Error generating clinical draft.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save draft without finalizing
  const handleSaveDraft = () => {
    if (!selectedPatient) return;
    const consId = existingConsultationId || generateId('CON');
    const noteId = currentNote ? currentNote.id : generateId('NOTE');

    const updatedNote: ClinicalNote = currentNote || {
      id: noteId,
      consultationId: consId,
      patientId: selectedPatient.id,
      title: `Consultation Note — ${selectedPatient.name} (${consultationType})`,
      content: {
        subjective: `Chief Complaint: ${chiefComplaint}\nHPI: ${historyOfPresentIllness}`,
        objective: examinationFindings,
        assessment,
        plan,
      },
      fullFormattedNote: editableFullNote || chiefComplaint,
      generatedBy: 'Doctor Manual',
      status: 'Draft',
      doctorName: settings.doctor.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (noteEditMode) {
      updatedNote.fullFormattedNote = editableFullNote;
    }

    const consObj: Consultation = {
      id: consId,
      patientId: selectedPatient.id,
      date: consultationDate,
      time: consultationTime,
      type: consultationType,
      chiefComplaint,
      historyOfPresentIllness,
      reviewOfSystems,
      examinationFindings,
      assessment,
      plan,
      followUpInstructions,
      additionalNotes,
      status: 'Draft',
      clinicalNoteId: noteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!existingConsultationId) {
      setExistingConsultationId(consId);
      createConsultation(consObj);
    } else {
      editConsultation(consObj);
    }

    if (!currentNote) {
      createNote(updatedNote);
    } else {
      editNote(updatedNote);
    }

    setCurrentNote(updatedNote);
    setNoteEditMode(false);
    showToast('Consultation draft saved to records.', 'info', 'Draft Saved');
  };

  // Mark as Reviewed
  const handleMarkAsReviewed = () => {
    if (!currentNote) return;
    const reviewed: ClinicalNote = {
      ...currentNote,
      fullFormattedNote: editableFullNote,
      status: 'Reviewed',
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentNote(reviewed);
    editNote(reviewed);
    setNoteEditMode(false);
    showToast('Clinical note marked as physician-reviewed.', 'success', 'Reviewed');
  };

  // Finalize Note confirmation trigger
  const handleConfirmFinalize = () => {
    if (!currentNote) return;
    finalizeNote(currentNote.id);
    setCurrentNote({
      ...currentNote,
      status: 'Finalized',
      finalizedAt: new Date().toISOString(),
    });
    setIsFinalizeConfirmOpen(false);
    setNoteEditMode(false);
  };

  // Copy to clipboard
  const handleCopyNote = () => {
    if (!editableFullNote) return;
    navigator.clipboard.writeText(editableFullNote);
    showToast('Clinical note text copied to clipboard.', 'info', 'Copied');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
              <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
              Consultation Workspace
            </span>
            {existingConsultationId && (
              <span className="font-mono text-xs text-slate-500">ID: {existingConsultationId}</span>
            )}
            {currentNote && <StatusBadge status={currentNote.status} />}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Clinical Intake & AI Documentation Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture patient observations, record examination findings, and generate verifiable SOAP clinical notes.
          </p>
        </div>

        {/* Demo Preset Case Quick Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            1-Click Demo Scenarios:
          </span>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handleLoadPreset(e.target.value);
            }}
            className="text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="" disabled>
              ⚡ Load Preset Clinical Case...
            </option>
            {DEMO_PRESET_CASES.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.caseTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Intake (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Patient Selection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900">Patient Selection & Encounter Type</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => setIsNewPatientModalOpen(true)}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Quick-Add Patient
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs h-9.5 rounded-lg border border-slate-300 px-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  label="Encounter Date"
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                />
              </div>

              <div>
                <Select
                  label="Encounter Type"
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Initial Consultation">Initial Consultation</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Urgent Care">Urgent Care</option>
                  <option value="Telehealth">Telehealth</option>
                  <option value="Annual Wellness">Annual Wellness</option>
                </Select>
              </div>
            </div>

            {/* Selected Patient Mini Clinical Banner */}
            {selectedPatient && (
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{selectedPatient.name}</span>
                    <span className="text-slate-500">
                      ({calculateAge(selectedPatient.dateOfBirth)} yo {selectedPatient.gender})
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{selectedPatient.id}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    History: {selectedPatient.medicalHistory.join(', ') || 'None'}
                  </p>
                </div>

                {/* Prominent Allergy Status */}
                <div className="shrink-0 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Allergies: {selectedPatient.allergies.join(', ') || 'NKDA'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Record Consultation Information */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">Clinical Examination & Findings</h3>
              </div>
              <span className="text-xs text-slate-400">Physician Documentation</span>
            </div>

            {/* Chief Complaint */}
            <Textarea
              label="Chief Complaint"
              placeholder="Primary reason for encounter in patient's words or provider summary..."
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              required
            />

            {/* History of Present Illness */}
            <Textarea
              label="History of Present Illness (HPI)"
              placeholder="Chronology, onset, duration, character, aggravating/alleviating factors..."
              rows={3}
              value={historyOfPresentIllness}
              onChange={(e) => setHistoryOfPresentIllness(e.target.value)}
            />

            {/* Review of Systems */}
            <Input
              label="Review of Systems (ROS)"
              placeholder="e.g. Negative for chest pain, dyspnea; Positive for mild headache..."
              value={reviewOfSystems}
              onChange={(e) => setReviewOfSystems(e.target.value)}
            />

            {/* Examination Findings & Vitals */}
            <Textarea
              label="Physical Examination Findings & Vitals"
              placeholder="BP, HR, SpO2, Temp, General appearance, HEENT, Heart, Lungs, Abdomen, Neuro..."
              rows={3}
              value={examinationFindings}
              onChange={(e) => setExaminationFindings(e.target.value)}
            />

            {/* Assessment & Impression */}
            <Textarea
              label="Assessment / Clinical Impression"
              placeholder="1. Primary diagnosis or impression\n2. Secondary / differential considerations..."
              rows={2}
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
            />

            {/* Plan & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Textarea
                label="Treatment Plan & Medications"
                placeholder="Diagnostic testing, medication orders, lifestyle therapy..."
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              />

              <Textarea
                label="Follow-up & Patient Instructions"
                placeholder="Next appointment timeframe, warning symptoms to monitor..."
                rows={3}
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
              />
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="text-xs font-medium"
              >
                <Save className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                Save Encounter Draft
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerateNote}
                isLoading={isGenerating}
                className="gap-2 font-bold shadow-md shadow-teal-600/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate Draft Note</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Note Synthesis & Document Review Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-teal-500/10 text-teal-700 flex items-center justify-center font-bold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI-Assisted Clinical Note
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {currentNote ? currentNote.status : 'Ready to synthesize'}
                  </p>
                </div>
              </div>

              {currentNote && (
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={currentNote.status} />
                </div>
              )}
            </div>

            {/* Loading AI State */}
            {isGenerating && (
              <div className="p-8 text-center space-y-4 bg-teal-50/30">
                <div className="relative inline-flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin" />
                  <Sparkles className="h-5 w-5 text-teal-600 absolute" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Synthesizing Clinical Record...</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium">{generationStep}</p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                  <div
                    className="bg-teal-600 h-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Parsing provider entries into SOAP compliance. No unverified hallucinations.
                </p>
              </div>
            )}

            {/* Note Display / Document Viewer */}
            {!isGenerating && currentNote ? (
              <div className="p-4 space-y-3.5">
                {/* Audit & Legal Banner */}
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-2 text-[11px] leading-tight">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.2" />
                  <div>
                    <span className="font-semibold">AI-Assisted Draft • Clinical Review Required:</span>
                    {' '}Synthesized strictly from provider inputs. Must be verified and signed by the attending physician.
                  </div>
                </div>

                {/* Toolbar for the generated note */}
                <div className="flex items-center justify-between pt-1 pb-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant={noteEditMode ? 'primary' : 'outline'}
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => setNoteEditMode(!noteEditMode)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      {noteEditMode ? 'Done Editing' : 'Edit Note'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={handleGenerateNote}
                      title="Regenerate structured note"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-slate-600"
                    onClick={handleCopyNote}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>

                {/* Document preview panel (Document-style) */}
                <div className="border border-slate-200 rounded-lg bg-slate-50/50 p-4 font-mono text-xs text-slate-800 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                  {noteEditMode ? (
                    <textarea
                      value={editableFullNote}
                      onChange={(e) => setEditableFullNote(e.target.value)}
                      className="w-full h-96 p-2 bg-white border border-teal-300 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                  ) : (
                    editableFullNote
                  )}
                </div>

                {/* Signature status */}
                <div className="p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Attending Physician:</span>
                    <span>{settings.doctor.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Status:</span>
                    <span className="font-bold text-teal-800">{currentNote.status}</span>
                  </div>
                  {currentNote.reviewedAt && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Reviewed:</span>
                      <span>{formatDate(currentNote.reviewedAt)}</span>
                    </div>
                  )}
                  {currentNote.finalizedAt && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                      <span>Finalized & Locked:</span>
                      <span>{formatDate(currentNote.finalizedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Finalization and review action buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    className="text-xs"
                  >
                    Save Draft
                  </Button>

                  {currentNote.status === 'Draft' && (
                    <Button
                      variant="teal"
                      size="sm"
                      onClick={handleMarkAsReviewed}
                      className="text-xs font-semibold"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Mark as Reviewed
                    </Button>
                  )}

                  {currentNote.status !== 'Finalized' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsFinalizeConfirmOpen(true)}
                      className="text-xs font-bold"
                    >
                      Finalize Note
                    </Button>
                  )}
                </div>
              </div>
            ) : !isGenerating && (
              <div className="p-8 text-center space-y-3">
                <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-200">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No Note Generated Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Fill in the clinical intake fields on the left (or click &ldquo;Load Preset Clinical Case&rdquo; above),
                    then click <strong className="text-teal-700">Generate Draft Note</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Clinote AI Verification & Compliance card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-teal-600" />
              SaaS Assistant Capabilities
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
              <li>Auto-formats Chief Complaint, HPI, ROS, Objective, and Plan.</li>
              <li>Flags missing sections explicitly as &ldquo;Not provided&rdquo;.</li>
              <li>Keeps full audit trail of Draft, Reviewed, and Finalized states.</li>
              <li>Ready to connect to real LLM or local Ollama endpoints.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Finalizing Note */}
      <ConfirmDialog
        isOpen={isFinalizeConfirmOpen}
        onClose={() => setIsFinalizeConfirmOpen(false)}
        onConfirm={handleConfirmFinalize}
        title="Confirm Clinical Finalization"
        description="Are you sure you want to finalize and lock this clinical note? Once finalized, the note will be stamped with Dr. Sarah Morgan's electronic signature and stored into the patient's permanent record."
        confirmText="Finalize & Sign Note"
        cancelText="Cancel"
        variant="primary"
      />

      {/* Quick Add Patient Modal */}
      <PatientFormModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onSave={(newPatient) => {
          createPatient(newPatient);
          setSelectedPatientId(newPatient.id);
        }}
      />
    </div>
  );
}

export default function NewConsultationPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading consultation workspace...
        </div>
      }
    >
      <NewConsultationContent />
    </React.Suspense>
  );
}
