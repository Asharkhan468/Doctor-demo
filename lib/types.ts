export type ConsultationStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Draft';
export type NoteStatus = 'Draft' | 'Reviewed' | 'Finalized';
export type PatientStatus = 'Active' | 'Inactive' | 'New';
export type ConsultationType =
  | 'Initial Consultation'
  | 'Follow-up'
  | 'Routine Checkup'
  | 'Urgent Care'
  | 'Telehealth'
  | 'Annual Wellness';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinicName: string;
  email: string;
  phone: string;
  licenseNumber: string;
}

export interface PatientContact {
  phone: string;
  email: string;
  emergencyContact?: string;
  address?: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  contact: PatientContact;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  additionalNotes?: string;
  status: PatientStatus;
  createdAt: string;
  lastVisit?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: ConsultationType;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems?: string;
  examinationFindings: string;
  assessment: string;
  plan: string;
  followUpInstructions?: string;
  additionalNotes?: string;
  status: ConsultationStatus;
  clinicalNoteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicalNoteContent {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface ClinicalNote {
  id: string;
  consultationId: string;
  patientId: string;
  title: string;
  content: ClinicalNoteContent;
  fullFormattedNote: string;
  generatedBy: 'Clinote AI Assistant (Draft)' | 'Doctor Manual';
  status: NoteStatus;
  doctorName: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  finalizedAt?: string;
}

export interface UserSettings {
  doctor: Doctor;
  noteFormat: 'soap' | 'narrative' | 'problem_oriented';
  density: 'comfortable' | 'compact';
  defaultFollowUpDays: number;
  autoSaveDrafts: boolean;
}

export interface DemoPresetCase {
  id: string;
  caseTitle: string;
  patientName: string;
  type: ConsultationType;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems: string;
  examinationFindings: string;
  assessment: string;
  plan: string;
  followUpInstructions: string;
}
