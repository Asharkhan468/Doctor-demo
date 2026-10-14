'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinote } from '@/lib/context';
import {
  Consultation,
  ClinicalNote,
  ConsultationType,
  ClinicalNoteContent,
} from '@/lib/types';
import { DEMO_PRESET_CASES } from '@/lib/mock-data';
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
  Stethoscope,
  Copy,
  Save,
  CheckCircle2,
  RefreshCw,
  FileText,
  UserPlus,
  ShieldAlert,
  Info,
  Mic,
  Pause,
  Play,
  Square,
  Upload,
} from 'lucide-react';

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
const SUPPORTED_AUDIO_EXTENSIONS = new Set(['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']);

function formatSoapContent(content: ClinicalNoteContent): string {
  return [
    `SUBJECTIVE\n${content.subjective}`,
    `OBJECTIVE\n${content.objective}`,
    `ASSESSMENT\n${content.assessment}`,
    `PLAN\n${content.plan}`,
  ].join('\n\n');
}

function isClinicalNoteContent(value: unknown): value is ClinicalNoteContent {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'subjective' in value &&
    typeof value.subjective === 'string' &&
    'objective' in value &&
    typeof value.objective === 'string' &&
    'assessment' in value &&
    typeof value.assessment === 'string' &&
    'plan' in value &&
    typeof value.plan === 'string'
  );
}

function NewConsultationContent() {
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
  const [transcript, setTranscript] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const audioUrlRef = useRef('');
  const [transcriptionError, setTranscriptionError] = useState('');
  const [recordingError, setRecordingError] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [soapContent, setSoapContent] = useState<ClinicalNoteContent>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBytesRef = useRef(0);
  const audioTooLargeRef = useRef(false);
  const recordingStartedAtRef = useRef(0);
  const elapsedBeforeStartRef = useRef(0);
  const recordingStartPendingRef = useRef(false);

  const replaceAudioFile = (file: File | null) => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = file ? URL.createObjectURL(file) : '';
    setAudioUrl(audioUrlRef.current);
    setAudioFile(file);
  };

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  // Generated Note State
  const [currentNote, setCurrentNote] = useState<ClinicalNote | null>(null);
  const [existingConsultationId, setExistingConsultationId] = useState<string | null>(null);

  // Modals
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isFinalizeConfirmOpen, setIsFinalizeConfirmOpen] = useState(false);

  // Load existing consultation or patient if params present
  useEffect(() => {
    if (hasUnsavedChanges) return;
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
        setTranscript(match.transcript || '');

        const noteMatch = match.clinicalNoteId
          ? clinicalNotes.find((n) => n.id === match.clinicalNoteId)
          : undefined;
        setCurrentNote(noteMatch || null);
        setSoapContent(
          noteMatch?.content || { subjective: '', objective: '', assessment: '', plan: '' }
        );
      }
    } else if (patientIdParam) {
      setSelectedPatientId(patientIdParam);
    } else if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [consultationIdParam, patientIdParam, consultations, clinicalNotes, patients, hasUnsavedChanges]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        recorder.onstop = null;
        recorder.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    },
    []
  );

  useEffect(() => {
    if (recordingState !== 'recording') return;
    const timer = window.setInterval(() => {
      setRecordingSeconds(
        elapsedBeforeStartRef.current +
          Math.floor((Date.now() - recordingStartedAtRef.current) / 1000)
      );
    }, 250);
    return () => window.clearInterval(timer);
  }, [recordingState]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const confirmInternalNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.hasAttribute('download')) {
        return;
      }
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.href === window.location.href ||
        window.confirm('You have unsaved consultation changes. Leave without saving?')
      ) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    document.addEventListener('click', confirmInternalNavigation, true);
    return () => {
      window.removeEventListener('beforeunload', warnBeforeLeaving);
      document.removeEventListener('click', confirmInternalNavigation, true);
    };
  }, [hasUnsavedChanges]);

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
    setHasUnsavedChanges(true);

    showToast(`Loaded clinical preset scenario: "${preset.caseTitle}"`, 'info', 'Scenario Loaded');
  };

  const startRecording = async () => {
    if (recordingState !== 'idle' || recordingStartPendingRef.current) return;
    if (audioFile && !window.confirm('Replace the current recording and transcript with a new recording?')) {
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecordingError('Audio recording is not supported in this browser. Upload an audio file instead.');
      return;
    }

    setRecordingError('');
    recordingStartPendingRef.current = true;
    setTranscriptionError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setHasUnsavedChanges(true);
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((type) =>
        MediaRecorder.isTypeSupported(type)
      );
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32_000 })
        : new MediaRecorder(stream, { audioBitsPerSecond: 32_000 });
      recorderRef.current = recorder;
      audioChunksRef.current = [];
      audioBytesRef.current = 0;
      audioTooLargeRef.current = false;
      recorder.ondataavailable = (event) => {
        if (event.data.size === 0 || audioTooLargeRef.current) return;
        audioBytesRef.current += event.data.size;
        if (audioBytesRef.current > MAX_AUDIO_BYTES) {
          audioTooLargeRef.current = true;
          setRecordingError('Recording reached the 4 MB upload limit and was stopped.');
          if (recorder.state !== 'inactive') recorder.stop();
          return;
        }
        audioChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        setRecordingError('The browser encountered an audio recording error. Please try again.');
        if (recorder.state !== 'inactive') recorder.stop();
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const extension = type.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(audioChunksRef.current, { type });
        if (audioTooLargeRef.current || blob.size > MAX_AUDIO_BYTES) {
          setRecordingError('This recording exceeds 4 MB. Record a shorter consultation.');
        } else if (blob.size > 0) {
          replaceAudioFile(new File([blob], `consultation-${Date.now()}.${extension}`, { type }));
          setTranscript('');
          setSoapContent({ subjective: '', objective: '', assessment: '', plan: '' });
          setHasUnsavedChanges(true);
        } else {
          setRecordingError('No audio was captured. Check your microphone and try again.');
        }
        stream.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        setRecordingState('idle');
      };
      replaceAudioFile(null);
      setTranscript('');
      setRecordingSeconds(0);
      elapsedBeforeStartRef.current = 0;
      recordingStartedAtRef.current = Date.now();
      recorder.start(1000);
      setRecordingState('recording');
    } catch (error) {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setRecordingState('idle');
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setRecordingError('Microphone access was denied. Allow microphone access in your browser or upload audio.');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setRecordingError('No microphone was found. Connect a microphone or upload audio.');
      } else {
        setRecordingError('Could not start microphone recording. Check browser permissions and try again.');
      }
    } finally {
      recordingStartPendingRef.current = false;
    }
  };

  const pauseRecording = () => {
    const recorder = recorderRef.current;
    if (recorder?.state !== 'recording') return;
    const elapsed =
      elapsedBeforeStartRef.current +
      Math.floor((Date.now() - recordingStartedAtRef.current) / 1000);
    elapsedBeforeStartRef.current = elapsed;
    setRecordingSeconds(elapsed);
    recorder.pause();
    setRecordingState('paused');
  };

  const resumeRecording = () => {
    const recorder = recorderRef.current;
    if (recorder?.state !== 'paused') return;
    recordingStartedAtRef.current = Date.now();
    recorder.resume();
    setRecordingState('recording');
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      if (recorder.state === 'recording') {
        const elapsed =
          elapsedBeforeStartRef.current +
          Math.floor((Date.now() - recordingStartedAtRef.current) / 1000);
        elapsedBeforeStartRef.current = elapsed;
        setRecordingSeconds(elapsed);
      }
      recorder.stop();
    } else {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
      setRecordingState('idle');
    }
  };

  const handleAudioUpload = (file?: File) => {
    if (!file) return;
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!SUPPORTED_AUDIO_EXTENSIONS.has(extension)) {
      setRecordingError('Use an MP3, MP4, MPEG, MPGA, M4A, WAV, or WebM audio file.');
      return;
    }
    if (file.size === 0 || file.size > MAX_AUDIO_BYTES) {
    setRecordingError(file.size === 0 ? 'The selected audio file is empty.' : 'Audio files must be 4 MB or smaller.');
      return;
    }
    if (transcript.trim() && !window.confirm('Replace the current audio and transcript?')) return;
    setRecordingError('');
    setTranscriptionError('');
    setTranscript('');
    replaceAudioFile(file);
    setHasUnsavedChanges(true);
  };

  const handleTranscribe = async () => {
    if (!audioFile || isTranscribing) return;
    setIsTranscribing(true);
    setTranscriptionError('');
    try {
      const body = new FormData();
      body.set('audio', audioFile);
      const response = await fetch('/api/transcribe', { method: 'POST', body });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'error' in result &&
          typeof result.error === 'object' &&
          result.error !== null &&
          'message' in result.error &&
          typeof result.error.message === 'string'
            ? result.error.message
            : 'Transcription failed. Please try again.';
        throw new Error(message);
      }
      if (
        typeof result !== 'object' ||
        result === null ||
        !('transcript' in result) ||
        typeof result.transcript !== 'string' ||
        !result.transcript.trim()
      ) {
        throw new Error('The transcription service returned no transcript.');
      }
      setTranscript(result.transcript);
      setHasUnsavedChanges(true);
    } catch (error) {
      setTranscriptionError(
        error instanceof Error ? error.message : 'Transcription failed. Please try again.'
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateNote = async () => {
    if (!selectedPatient) {
      showToast('Please select a patient first.', 'warning', 'Validation');
      return;
    }

    if (!transcript.trim()) {
      showToast('Transcribe or enter a reviewed consultation transcript before generating a SOAP note.', 'warning', 'Transcript Required');
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setGenerationStep('Generating SOAP draft from the reviewed transcript...');
    setGenerationProgress(35);

    try {
      const response = await fetch('/api/soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === 'object' &&
          result !== null &&
          'error' in result &&
          typeof result.error === 'object' &&
          result.error !== null &&
          'message' in result.error &&
          typeof result.error.message === 'string'
            ? result.error.message
            : 'SOAP generation failed. Please try again.';
        throw new Error(message);
      }
      if (
        typeof result !== 'object' ||
        result === null ||
        !('content' in result) ||
        !isClinicalNoteContent(result.content)
      ) {
        throw new Error('The note-generation service returned an invalid SOAP note.');
      }
      const content = result.content;
      const noteId = currentNote ? currentNote.id : generateId('NOTE');
      const consId = existingConsultationId || generateId('CON');
      const now = new Date().toISOString();
      const formattedNote = formatSoapContent(content);

      const newNoteObj: ClinicalNote = {
        id: noteId,
        consultationId: consId,
        patientId: selectedPatient.id,
        title: `Consultation Note — ${selectedPatient.name} (${consultationType})`,
        content,
        fullFormattedNote: formattedNote,
        generatedBy: 'Clinote AI Assistant (Draft)',
        status: 'Draft',
        doctorName: settings.doctor.name,
        createdAt: currentNote ? currentNote.createdAt : now,
        updatedAt: now,
      };

      setGenerationProgress(100);
      setCurrentNote(newNoteObj);
      setSoapContent(content);

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
        transcript,
        status: 'In Progress',
        clinicalNoteId: noteId,
        createdAt: consultations.find((item) => item.id === consId)?.createdAt || now,
        updatedAt: now,
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

      setHasUnsavedChanges(false);
      showToast('SOAP draft generated from the reviewed transcript. Please verify every section.', 'success', 'Draft Ready');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'SOAP generation failed. Please try again.',
        'error',
        'Generation Failed'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!selectedPatient) return;
    const consId = existingConsultationId || generateId('CON');
    const now = new Date().toISOString();
    const noteId = currentNote?.id;
    const updatedNote = currentNote
      ? {
          ...currentNote,
          content: soapContent,
          fullFormattedNote: formatSoapContent(soapContent),
          status: hasUnsavedChanges ? 'Draft' as const : currentNote.status,
          updatedAt: now,
          reviewedAt: hasUnsavedChanges ? undefined : currentNote.reviewedAt,
          finalizedAt: hasUnsavedChanges ? undefined : currentNote.finalizedAt,
        }
      : null;

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
      transcript,
      status: currentNote ? 'In Progress' : 'Draft',
      clinicalNoteId: noteId,
      createdAt: consultations.find((item) => item.id === consId)?.createdAt || now,
      updatedAt: now,
    };

    if (!existingConsultationId) {
      setExistingConsultationId(consId);
      createConsultation(consObj);
    } else {
      editConsultation(consObj);
    }

    if (updatedNote) {
      editNote(updatedNote);
      setCurrentNote(updatedNote);
    }

    setExistingConsultationId(consId);
    setHasUnsavedChanges(false);
    showToast('Consultation and any SOAP draft were saved in this browser.', 'info', 'Draft Saved');
  };

  const handleMarkAsReviewed = () => {
    if (!currentNote || hasUnsavedChanges) return;
    const now = new Date().toISOString();
    const reviewed: ClinicalNote = {
      ...currentNote,
      content: soapContent,
      fullFormattedNote: formatSoapContent(soapContent),
      status: 'Reviewed',
      reviewedAt: now,
      updatedAt: now,
    };
    setCurrentNote(reviewed);
    editNote(reviewed);
    setHasUnsavedChanges(false);
    showToast('Clinical note marked as physician-reviewed.', 'success', 'Reviewed');
  };

  const handleConfirmFinalize = () => {
    if (!currentNote) return;
    const now = new Date().toISOString();
    const finalized: ClinicalNote = {
      ...currentNote,
      content: soapContent,
      fullFormattedNote: formatSoapContent(soapContent),
      status: 'Finalized',
      reviewedAt: currentNote.reviewedAt || now,
      finalizedAt: now,
      updatedAt: now,
    };
    editNote(finalized);
    setCurrentNote(finalized);
    if (selectedPatient) {
      const existing = consultations.find((item) => item.id === finalized.consultationId);
      const consultation: Consultation = {
        id: finalized.consultationId,
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
        transcript,
        status: 'Completed',
        clinicalNoteId: finalized.id,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
      if (existing) editConsultation(consultation);
      else createConsultation(consultation);
      setExistingConsultationId(consultation.id);
    }
    setHasUnsavedChanges(false);
    setIsFinalizeConfirmOpen(false);
  };

  const handleCopyNote = async () => {
    if (!currentNote) return;
    await navigator.clipboard.writeText(formatSoapContent(soapContent));
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
            {hasUnsavedChanges && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                Unsaved changes
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Record, Transcribe & Review Consultation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture real audio, correct the transcript, then review and approve an AI-generated SOAP draft.
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
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
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
                  onChange={(e) => {
                    setConsultationDate(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div>
                <Select
                  label="Encounter Type"
                  value={consultationType}
                  onChange={(e) => {
                    setConsultationType(e.target.value as ConsultationType);
                    setHasUnsavedChanges(true);
                  }}
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

          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">2</span>
                  Consultation Audio & Transcript
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Record with your microphone or upload an audio file (4 MB maximum).
                </p>
              </div>
              <span className={`text-xs font-semibold ${recordingState === 'recording' ? 'text-rose-700' : 'text-slate-500'}`}>
                {recordingState === 'recording'
                  ? 'Recording'
                  : recordingState === 'paused'
                    ? 'Recording paused'
                    : audioFile
                      ? 'Audio ready'
                      : 'Not recording'}
                {' · '}
                {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                {String(recordingSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {recordingState === 'idle' ? (
                <Button size="sm" onClick={startRecording}>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </Button>
              ) : recordingState === 'recording' ? (
                <Button variant="outline" size="sm" onClick={pauseRecording}>
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={resumeRecording}>
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
              )}
              {recordingState !== 'idle' && (
                <Button variant="danger" size="sm" onClick={stopRecording}>
                  <Square className="h-3.5 w-3.5" />
                  Stop Recording
                </Button>
              )}
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50">
                <Upload className="h-3.5 w-3.5" />
                Upload Audio
                <input
                  type="file"
                  accept=".mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm,audio/*"
                  className="sr-only"
                  disabled={recordingState !== 'idle' || isTranscribing}
                  onChange={(event) => {
                    handleAudioUpload(event.target.files?.[0]);
                    event.currentTarget.value = '';
                  }}
                />
              </label>
              <Button
                variant="teal"
                size="sm"
                onClick={handleTranscribe}
                disabled={!audioFile || recordingState !== 'idle' || isTranscribing}
                isLoading={isTranscribing}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isTranscribing ? 'Transcribing…' : 'Transcribe Audio'}
              </Button>
            </div>

            {recordingError && <p role="alert" className="text-xs text-rose-700">{recordingError}</p>}
            {transcriptionError && <p role="alert" className="text-xs text-rose-700">{transcriptionError}</p>}
            {audioFile && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  {audioFile.name} · {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                {audioUrl && <audio className="w-full" controls src={audioUrl}>Audio playback is not supported.</audio>}
              </div>
            )}
            <p className="text-[11px] text-slate-500">
              Audio is sent to the configured transcription provider. Use fictional patients and synthetic audio only.
              Microphone access requires localhost or HTTPS.
            </p>

            <Textarea
              label="Transcript — review and correct before generating"
              placeholder="Transcribe audio or enter a reviewed consultation transcript…"
              rows={6}
              maxLength={50_000}
              value={transcript}
              onChange={(event) => {
                setTranscript(event.target.value);
                setHasUnsavedChanges(true);
              }}
              helperText={`${transcript.length.toLocaleString()} / 50,000 characters. SOAP generation uses this text only.`}
            />
          </div>

          {/* Step 2: Record Consultation Information */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900">Additional Clinical Intake</h3>
              </div>
              <span className="text-xs text-slate-400">Optional supporting details</span>
            </div>

            {/* Chief Complaint */}
            <Textarea
              label="Chief Complaint"
              placeholder="Primary reason for encounter in patient's words or provider summary..."
              rows={2}
              value={chiefComplaint}
              onChange={(e) => {
                setChiefComplaint(e.target.value);
                setHasUnsavedChanges(true);
              }}
              required
            />

            {/* History of Present Illness */}
            <Textarea
              label="History of Present Illness (HPI)"
              placeholder="Chronology, onset, duration, character, aggravating/alleviating factors..."
              rows={3}
              value={historyOfPresentIllness}
              onChange={(e) => {
                setHistoryOfPresentIllness(e.target.value);
                setHasUnsavedChanges(true);
              }}
            />

            {/* Review of Systems */}
            <Input
              label="Review of Systems (ROS)"
              placeholder="e.g. Negative for chest pain, dyspnea; Positive for mild headache..."
              value={reviewOfSystems}
              onChange={(e) => {
                setReviewOfSystems(e.target.value);
                setHasUnsavedChanges(true);
              }}
            />

            {/* Examination Findings & Vitals */}
            <Textarea
              label="Physical Examination Findings & Vitals"
              placeholder="BP, HR, SpO2, Temp, General appearance, HEENT, Heart, Lungs, Abdomen, Neuro..."
              rows={3}
              value={examinationFindings}
              onChange={(e) => {
                setExaminationFindings(e.target.value);
                setHasUnsavedChanges(true);
              }}
            />

            {/* Assessment & Impression */}
            <Textarea
              label="Assessment / Clinical Impression"
              placeholder="1. Primary diagnosis or impression\n2. Secondary / differential considerations..."
              rows={2}
              value={assessment}
              onChange={(e) => {
                setAssessment(e.target.value);
                setHasUnsavedChanges(true);
              }}
            />

            {/* Plan & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Textarea
                label="Treatment Plan & Medications"
                placeholder="Diagnostic testing, medication orders, lifestyle therapy..."
                rows={3}
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setHasUnsavedChanges(true);
                }}
              />

              <Textarea
                label="Follow-up & Patient Instructions"
                placeholder="Next appointment timeframe, warning symptoms to monitor..."
                rows={3}
                value={followUpInstructions}
                onChange={(e) => {
                  setFollowUpInstructions(e.target.value);
                  setHasUnsavedChanges(true);
                }}
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
                disabled={!transcript.trim()}
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
                  Processing the reviewed transcript. AI output may be incomplete or incorrect; verify every section.
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
                    <span className="font-semibold">AI-generated draft • Clinician review required:</span>
                    {' '}Generated from the reviewed transcript. Verify the content before signing.
                  </div>
                </div>

                {/* Toolbar for the generated note */}
                <div className="flex items-center justify-between pt-1 pb-1 text-xs">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={handleGenerateNote}
                    disabled={!transcript.trim() || isGenerating}
                    title="Regenerate the note from the current reviewed transcript"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate
                  </Button>

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

                <div className="space-y-3">
                  {([
                    ['subjective', 'Subjective — patient-reported symptoms and history'],
                    ['objective', 'Objective — documented observations and findings'],
                    ['assessment', 'Assessment — clinician-documented impression'],
                    ['plan', 'Plan — documented treatment and follow-up'],
                  ] as const).map(([section, label]) => (
                    <Textarea
                      key={section}
                      label={label}
                      rows={section === 'subjective' ? 5 : 3}
                      value={soapContent[section]}
                      onChange={(event) => {
                        setSoapContent((previous) => ({
                          ...previous,
                          [section]: event.target.value,
                        }));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  ))}
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
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Last updated:</span>
                    <span>{new Date(currentNote.updatedAt).toLocaleString()}</span>
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

                  {currentNote.status !== 'Reviewed' && currentNote.status !== 'Finalized' && (
                    <Button
                      variant="teal"
                      size="sm"
                      onClick={handleMarkAsReviewed}
                        disabled={hasUnsavedChanges}
                        title={hasUnsavedChanges ? 'Save changes before marking as reviewed' : undefined}
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
                      disabled={hasUnsavedChanges}
                      title={hasUnsavedChanges ? 'Save your changes before approving this note' : undefined}
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
                    Record or upload audio and transcribe it, then review the transcript and click{' '}
                    <strong className="text-teal-700">Generate Draft Note</strong>.
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
              <li>Uses server-side transcription and real AI SOAP generation when credentials are configured.</li>
              <li>Missing clinical details are marked &ldquo;Not documented&rdquo;; all output requires review.</li>
              <li>Draft, reviewed, and approved notes are stored in this browser for demonstration only.</li>
              <li>Do not enter real patient information; this demo has no sign-in or secure shared database.</li>
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
        description="Approve this note as reviewed and final? Any later edits will return it to draft status and require approval again."
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
          setHasUnsavedChanges(true);
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
