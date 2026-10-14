'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Patient,
  Consultation,
  ClinicalNote,
  UserSettings,
} from './types';
import {
  getPatients,
  savePatient,
  deletePatient,
  getConsultations,
  saveConsultation,
  deleteConsultation,
  getClinicalNotes,
  saveClinicalNote,
  deleteClinicalNote,
  getSettings,
  saveSettings,
  resetToDefaultData,
  subscribeToDataChanges,
} from './storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
}

interface ClinoteContextType {
  patients: Patient[];
  consultations: Consultation[];
  clinicalNotes: ClinicalNote[];
  settings: UserSettings;
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
  // Patient actions
  createPatient: (patient: Patient) => void;
  editPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  // Consultation actions
  createConsultation: (consultation: Consultation) => void;
  editConsultation: (consultation: Consultation) => void;
  removeConsultation: (id: string) => void;
  // Note actions
  createNote: (note: ClinicalNote) => void;
  editNote: (note: ClinicalNote) => void;
  finalizeNote: (id: string) => void;
  removeNote: (id: string) => void;
  // Settings actions
  editSettings: (settings: UserSettings) => void;
  resetAllData: () => void;
}

const ClinoteContext = createContext<ClinoteContextType | undefined>(undefined);

export function ClinoteProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshData = useCallback(() => {
    setPatients(getPatients());
    setConsultations(getConsultations());
    setClinicalNotes(getClinicalNotes());
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    refreshData();
    setIsLoading(false);
    const unsubscribe = subscribeToDataChanges(refreshData);
    return () => unsubscribe();
  }, [refreshData]);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'success', title?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Patients
  const createPatient = useCallback(
    (patient: Patient) => {
      savePatient(patient);
      showToast(`Patient ${patient.name} (${patient.id}) successfully created.`, 'success', 'Patient Added');
    },
    [showToast]
  );

  const editPatient = useCallback(
    (patient: Patient) => {
      savePatient(patient);
      showToast(`Patient profile for ${patient.name} updated.`, 'success', 'Profile Updated');
    },
    [showToast]
  );

  const removePatient = useCallback(
    (id: string) => {
      const p = patients.find((item) => item.id === id);
      deletePatient(id);
      showToast(`Patient ${p?.name || id} removed from records.`, 'info', 'Patient Removed');
    },
    [patients, showToast]
  );

  // Consultations
  const createConsultation = useCallback(
    (consultation: Consultation) => {
      saveConsultation(consultation);
      showToast(`Consultation record ${consultation.id} started.`, 'success', 'Consultation Saved');
    },
    [showToast]
  );

  const editConsultation = useCallback(
    (consultation: Consultation) => {
      saveConsultation(consultation);
      showToast(`Consultation ${consultation.id} changes saved.`, 'info', 'Changes Saved');
    },
    [showToast]
  );

  const removeConsultation = useCallback(
    (id: string) => {
      deleteConsultation(id);
      showToast(`Consultation ${id} removed.`, 'info', 'Consultation Removed');
    },
    [showToast]
  );

  // Notes
  const createNote = useCallback(
    (note: ClinicalNote) => {
      saveClinicalNote(note);
      showToast(`Clinical note draft generated and saved.`, 'success', 'Note Created');
    },
    [showToast]
  );

  const editNote = useCallback(
    (note: ClinicalNote) => {
      saveClinicalNote(note);
      showToast(`Clinical note ${note.id} updated.`, 'info', 'Note Updated');
    },
    [showToast]
  );

  const finalizeNote = useCallback(
    (id: string) => {
      const note = clinicalNotes.find((n) => n.id === id);
      if (note) {
        const finalized: ClinicalNote = {
          ...note,
          status: 'Finalized',
          finalizedAt: new Date().toISOString(),
          reviewedAt: note.reviewedAt || new Date().toISOString(),
        };
        saveClinicalNote(finalized);

        // Also update consultation status if linked
        if (note.consultationId) {
          const cons = consultations.find((c) => c.id === note.consultationId);
          if (cons) {
            saveConsultation({ ...cons, status: 'Completed', clinicalNoteId: note.id });
          }
        }

        showToast(
          `Note ${note.id} was marked approved in this browser demo.`,
          'success',
          'Clinical Note Finalized'
        );
      }
    },
    [clinicalNotes, consultations, showToast]
  );

  const removeNote = useCallback(
    (id: string) => {
      deleteClinicalNote(id);
      showToast(`Clinical note ${id} deleted.`, 'info', 'Note Removed');
    },
    [showToast]
  );

  // Settings
  const editSettings = useCallback(
    (newSettings: UserSettings) => {
      saveSettings(newSettings);
      showToast('Clinote preferences and profile updated successfully.', 'success', 'Settings Saved');
    },
    [showToast]
  );

  const resetAllData = useCallback(() => {
    resetToDefaultData();
    showToast('Demo dataset has been restored to default state.', 'info', 'Demo Reset');
  }, [showToast]);

  return (
    <ClinoteContext.Provider
      value={{
        patients,
        consultations,
        clinicalNotes,
        settings,
        isLoading,
        toasts,
        showToast,
        removeToast,
        createPatient,
        editPatient,
        removePatient,
        createConsultation,
        editConsultation,
        removeConsultation,
        createNote,
        editNote,
        finalizeNote,
        removeNote,
        editSettings,
        resetAllData,
      }}
    >
      {children}
    </ClinoteContext.Provider>
  );
}

export function useClinote() {
  const context = useContext(ClinoteContext);
  if (!context) {
    throw new Error('useClinote must be used within a ClinoteProvider');
  }
  return context;
}
