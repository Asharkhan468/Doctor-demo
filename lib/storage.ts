import { Patient, Consultation, ClinicalNote, UserSettings } from './types';
import {
  INITIAL_PATIENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_SETTINGS,
} from './mock-data';

const STORAGE_KEYS = {
  PATIENTS: 'clinote_patients_v1',
  CONSULTATIONS: 'clinote_consultations_v1',
  NOTES: 'clinote_notes_v1',
  SETTINGS: 'clinote_settings_v1',
} as const;

const EVENT_NAME = 'clinote-data-update';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function notifySubscribers() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

// Ensure initial mock data exists
export function initializeStorage(): void {
  if (!isBrowser()) return;

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_CLINICAL_NOTES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
}

// Patients
export function getPatients(): Patient[] {
  if (!isBrowser()) return INITIAL_PATIENTS;
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : INITIAL_PATIENTS;
  } catch (e) {
    console.error('Error reading patients from storage', e);
    return INITIAL_PATIENTS;
  }
}

export function getPatientById(id: string): Patient | undefined {
  const patients = getPatients();
  return patients.find((p) => p.id === id);
}

export function savePatient(patient: Patient): void {
  if (!isBrowser()) return;
  const patients = getPatients();
  const index = patients.findIndex((p) => p.id === patient.id);
  let updated: Patient[];
  if (index >= 0) {
    updated = [...patients];
    updated[index] = patient;
  } else {
    updated = [patient, ...patients];
  }
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updated));
  notifySubscribers();
}

export function deletePatient(id: string): void {
  if (!isBrowser()) return;
  const patients = getPatients().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  notifySubscribers();
}

// Consultations
export function getConsultations(): Consultation[] {
  if (!isBrowser()) return INITIAL_CONSULTATIONS;
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return data ? JSON.parse(data) : INITIAL_CONSULTATIONS;
  } catch (e) {
    console.error('Error reading consultations from storage', e);
    return INITIAL_CONSULTATIONS;
  }
}

export function getConsultationById(id: string): Consultation | undefined {
  const consultations = getConsultations();
  return consultations.find((c) => c.id === id);
}

export function saveConsultation(consultation: Consultation): void {
  if (!isBrowser()) return;
  const consultations = getConsultations();
  const index = consultations.findIndex((c) => c.id === consultation.id);
  let updated: Consultation[];
  if (index >= 0) {
    updated = [...consultations];
    updated[index] = consultation;
  } else {
    updated = [consultation, ...consultations];
  }
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updated));
  notifySubscribers();
}

export function deleteConsultation(id: string): void {
  if (!isBrowser()) return;
  const consultations = getConsultations().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  notifySubscribers();
}

// Clinical Notes
export function getClinicalNotes(): ClinicalNote[] {
  if (!isBrowser()) return INITIAL_CLINICAL_NOTES;
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : INITIAL_CLINICAL_NOTES;
  } catch (e) {
    console.error('Error reading clinical notes from storage', e);
    return INITIAL_CLINICAL_NOTES;
  }
}

export function getClinicalNoteById(id: string): ClinicalNote | undefined {
  const notes = getClinicalNotes();
  return notes.find((n) => n.id === id);
}

export function saveClinicalNote(note: ClinicalNote): void {
  if (!isBrowser()) return;
  const notes = getClinicalNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  let updated: ClinicalNote[];
  if (index >= 0) {
    updated = [...notes];
    updated[index] = note;
  } else {
    updated = [note, ...notes];
  }
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));

  // If associated with consultation, link it
  if (note.consultationId) {
    const consultation = getConsultationById(note.consultationId);
    if (consultation && consultation.clinicalNoteId !== note.id) {
      saveConsultation({ ...consultation, clinicalNoteId: note.id });
    }
  }

  notifySubscribers();
}

export function deleteClinicalNote(id: string): void {
  if (!isBrowser()) return;
  const notes = getClinicalNotes().filter((n) => n.id !== id);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  notifySubscribers();
}

// Settings
export function getSettings(): UserSettings {
  if (!isBrowser()) return INITIAL_SETTINGS;
  initializeStorage();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch (e) {
    console.error('Error reading settings from storage', e);
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notifySubscribers();
}

// Reset Demo Data
export function resetToDefaultData(): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_CLINICAL_NOTES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  notifySubscribers();
}

// Storage update subscription
export function subscribeToDataChanges(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
