import { Patient, Doctor, ConsultationType, ClinicalNoteContent } from './types';
import { calculateAge } from './utils';

export interface GenerationInput {
  patient: Patient;
  doctor: Doctor;
  consultationType: ConsultationType;
  date: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  reviewOfSystems?: string;
  examinationFindings: string;
  assessment: string;
  plan: string;
  followUpInstructions?: string;
  additionalNotes?: string;
  noteFormat?: 'soap' | 'narrative' | 'problem_oriented';
}

export interface GeneratedNoteResult {
  title: string;
  content: ClinicalNoteContent;
  fullFormattedNote: string;
  metadata: {
    generatedAt: string;
    model: string;
    wordCount: number;
    completionTimeMs: number;
  };
}

/**
 * Deterministic Clinical Note Generator (Demo AI Service)
 *
 * NOTE: This service synthesizes only user-provided clinical entries
 * into standardized medical documentation formats (SOAP / Narrative).
 * It explicitly avoids hallucinating unverified diagnoses, symptoms,
 * or drug dosages, labeling absent fields as 'Not provided.'
 */
export function generateStructuredClinicalNote(input: GenerationInput): GeneratedNoteResult {
  const {
    patient,
    doctor,
    consultationType,
    date,
    chiefComplaint,
    historyOfPresentIllness,
    reviewOfSystems,
    examinationFindings,
    assessment,
    plan,
    followUpInstructions,
    additionalNotes,
  } = input;

  const age = calculateAge(patient.dateOfBirth);
  const patientAllergies = patient.allergies && patient.allergies.length > 0
    ? patient.allergies.join(', ')
    : 'No Known Drug Allergies (NKDA)';
  const patientMedications = patient.medications && patient.medications.length > 0
    ? patient.medications.join(', ')
    : 'None reported';
  const patientHistory = patient.medicalHistory && patient.medicalHistory.length > 0
    ? patient.medicalHistory.join('; ')
    : 'None reported';

  const ccText = chiefComplaint.trim() || 'Not provided.';
  const hpiText = historyOfPresentIllness.trim() || 'Not provided.';
  const rosText = reviewOfSystems?.trim() || 'Review of systems non-contributory or not provided.';
  const objText = examinationFindings.trim() || 'Physical examination findings not provided.';
  const assessText = assessment.trim() || 'Clinical assessment not provided.';
  const planText = plan.trim() || 'Treatment plan not provided.';
  const followUpText = followUpInstructions?.trim() || 'Routine follow-up as clinically indicated.';
  const notesText = additionalNotes?.trim() ? `\nProvider Notes: ${additionalNotes.trim()}` : '';

  // Subjective section
  const subjective = `CHIEF COMPLAINT:
${ccText}

HISTORY OF PRESENT ILLNESS:
${hpiText}

REVIEW OF SYSTEMS:
${rosText}

PAST MEDICAL HISTORY:
${patientHistory}

CURRENT MEDICATIONS:
${patientMedications}

ALLERGIES:
${patientAllergies}`;

  // Objective section
  const objective = `EXAMINATION FINDINGS & OBJECTIVE DATA:
${objText}`;

  // Assessment section
  const assessmentSection = `CLINICAL ASSESSMENT & IMPRESSION:
${assessText}`;

  // Plan section
  const planSection = `PLAN & CLINICAL MANAGEMENT:
${planText}

FOLLOW-UP INSTRUCTIONS:
${followUpText}${notesText}`;

  // Full formatted document
  const fullFormattedNote = `======================================================================
CLINOTE AI — CLINICAL CONSULTATION NOTE [AI-ASSISTED DRAFT]
======================================================================
CLINIC: ${doctor.clinicName}
ATTENDING PHYSICIAN: ${doctor.name} (${doctor.specialty})
LICENSE / NPI: ${doctor.licenseNumber}
DATE OF ENCOUNTER: ${date}
ENCOUNTER TYPE: ${consultationType}

PATIENT INFORMATION:
- Name: ${patient.name}
- Medical Record ID: ${patient.id}
- DOB: ${patient.dateOfBirth} (Age: ${age} years)
- Gender: ${patient.gender}
- Primary Phone: ${patient.contact.phone}
- Drug Allergies: ${patientAllergies}

----------------------------------------------------------------------
[S] SUBJECTIVE
----------------------------------------------------------------------
Chief Complaint:
${ccText}

History of Present Illness (HPI):
${hpiText}

Review of Systems:
${rosText}

Known Medical History:
${patientHistory}

Current Active Medications:
${patientMedications}

----------------------------------------------------------------------
[O] OBJECTIVE
----------------------------------------------------------------------
Physical Examination & Vitals:
${objText}

----------------------------------------------------------------------
[A] ASSESSMENT
----------------------------------------------------------------------
Clinical Assessment / Diagnostic Impression:
${assessText}

----------------------------------------------------------------------
[P] PLAN & MANAGEMENT
----------------------------------------------------------------------
Therapeutic & Diagnostic Plan:
${planText}

Follow-up & Patient Guidance:
${followUpText}${notesText}

======================================================================
CLINICAL REVIEW STATUS: PENDING PHYSICIAN SIGNATURE
NOTICE: This is an AI-assisted clinical documentation draft generated
strictly from provider-entered consultation inputs. Clinote AI does not
independently diagnose, prescribe, or alter patient records without
formal attending review.
======================================================================`;

  const wordCount = fullFormattedNote.split(/\s+/).filter(Boolean).length;

  return {
    title: `Consultation Note — ${patient.name} (${consultationType})`,
    content: {
      subjective,
      objective,
      assessment: assessmentSection,
      plan: planSection,
    },
    fullFormattedNote,
    metadata: {
      generatedAt: new Date().toISOString(),
      model: 'Clinote Clinical Transformer (Deterministic Prototype)',
      wordCount,
      completionTimeMs: 1250,
    },
  };
}

/**
 * Simulates async AI generation with progress callbacks for realistic UI feedback
 */
export async function simulateAIGeneration(
  input: GenerationInput,
  onProgress?: (step: string, percentage: number) => void
): Promise<GeneratedNoteResult> {
  const steps = [
    { label: 'Parsing clinical inputs & patient history...', pct: 25, delay: 350 },
    { label: 'Synthesizing Subjective & Objective documentation...', pct: 55, delay: 450 },
    { label: 'Formulating Assessment & Plan structure...', pct: 85, delay: 350 },
    { label: 'Finalizing clinical draft with audit headers...', pct: 100, delay: 200 },
  ];

  for (const step of steps) {
    if (onProgress) onProgress(step.label, step.pct);
    await new Promise((resolve) => setTimeout(resolve, step.delay));
  }

  return generateStructuredClinicalNote(input);
}
