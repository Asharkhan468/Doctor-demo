import { Doctor, Patient, Consultation, ClinicalNote, UserSettings, DemoPresetCase } from './types';

export const INITIAL_DOCTOR: Doctor = {
  id: 'doc-001',
  name: 'Dr. Sarah Morgan, MD',
  specialty: 'Internal Medicine & Preventive Care',
  clinicName: 'MetroHealth Physicians Group',
  email: 's.morgan@metrohealth-demo.org',
  phone: '+1 (555) 234-8900',
  licenseNumber: 'MD-884920-IL',
};

export const INITIAL_SETTINGS: UserSettings = {
  doctor: INITIAL_DOCTOR,
  noteFormat: 'soap',
  density: 'comfortable',
  defaultFollowUpDays: 14,
  autoSaveDrafts: true,
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-1081',
    name: 'Eleanor Vance',
    dateOfBirth: '1970-04-12',
    gender: 'Female',
    contact: {
      phone: '+1 (555) 349-1029',
      email: 'eleanor.vance@example-med.com',
      emergencyContact: 'Robert Vance (Spouse) - +1 (555) 349-1030',
      address: '742 Evergreen Terrace, Springfield',
    },
    medicalHistory: ['Essential Hypertension (diagnosed 2018)', 'Hyperlipidemia', 'Osteopenia'],
    allergies: ['Penicillin (Hives / Rash)', 'Sulfa drugs (Mild nausea)'],
    medications: ['Lisinopril 10mg PO daily', 'Atorvastatin 20mg PO at bedtime', 'Vitamin D3 2000 IU daily'],
    additionalNotes: 'Monitors BP at home weekly. Consistent with medication adherence.',
    status: 'Active',
    createdAt: '2025-11-10T09:00:00Z',
    lastVisit: '2026-10-10',
  },
  {
    id: 'PAT-1082',
    name: 'Marcus Chen',
    dateOfBirth: '1986-09-24',
    gender: 'Male',
    contact: {
      phone: '+1 (555) 812-4491',
      email: 'marcus.chen@example-med.com',
      emergencyContact: 'Lily Chen (Sister) - +1 (555) 812-4492',
      address: '128 Willow Creek Lane, Apt 4B',
    },
    medicalHistory: ['Type 2 Diabetes Mellitus (HbA1c 7.4%)', 'Seasonal Allergic Rhinitis'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    medications: ['Metformin 500mg PO BID with meals', 'Cetirizine 10mg PRN'],
    additionalNotes: 'Working on low-glycemic dietary modifications. Reports occasional foot tingling to evaluate.',
    status: 'Active',
    createdAt: '2026-01-15T11:20:00Z',
    lastVisit: '2026-10-12',
  },
  {
    id: 'PAT-1083',
    name: 'Sophia Rodriguez',
    dateOfBirth: '1995-12-03',
    gender: 'Female',
    contact: {
      phone: '+1 (555) 762-9904',
      email: 'sophia.rodriguez@example-med.com',
      emergencyContact: 'Carlos Rodriguez (Father) - +1 (555) 762-9905',
      address: '410 Maple Avenue, Suite 12',
    },
    medicalHistory: ['Mild Intermittent Asthma', 'Anxiety Disorder'],
    allergies: ['Aspirin (Bronchospasm / Wheezing)'],
    medications: ['Albuterol HFA Inhaler 90mcg 2 puffs PRN', 'Sertraline 50mg PO daily'],
    additionalNotes: 'Recent acute upper respiratory symptoms for 10 days.',
    status: 'Active',
    createdAt: '2026-03-02T14:15:00Z',
    lastVisit: '2026-10-13',
  },
  {
    id: 'PAT-1084',
    name: "James O'Connor",
    dateOfBirth: '1957-06-18',
    gender: 'Male',
    contact: {
      phone: '+1 (555) 438-6620',
      email: 'james.oconnor@example-med.com',
      emergencyContact: 'Patricia O\'Connor (Wife) - +1 (555) 438-6621',
      address: '904 Oak Ridge Road',
    },
    medicalHistory: ['Coronary Artery Disease (Stent placed 2021)', 'Bilateral Knee Osteoarthritis', 'GERD'],
    allergies: ['Codeine (Severe nausea & dizziness)'],
    medications: ['Metoprolol Succinate 25mg daily', 'Aspirin 81mg daily', 'Omeprazole 20mg daily'],
    additionalNotes: 'Cardiology follow-up pending next month. Routine primary care visit today.',
    status: 'Active',
    createdAt: '2025-08-19T08:30:00Z',
    lastVisit: '2026-09-28',
  },
  {
    id: 'PAT-1085',
    name: 'Amina Patel',
    dateOfBirth: '1982-08-30',
    gender: 'Female',
    contact: {
      phone: '+1 (555) 902-1134',
      email: 'amina.patel@example-med.com',
      emergencyContact: 'Tariq Patel (Brother) - +1 (555) 902-1135',
      address: '334 Birchwood Blvd',
    },
    medicalHistory: ['Primary Hypothyroidism', 'Migraine with Visual Aura'],
    allergies: ['Erythromycin (GI cramping)'],
    medications: ['Levothyroxine 75mcg PO daily on empty stomach', 'Sumatriptan 50mg PRN at migraine onset'],
    additionalNotes: 'Thyroid labs drawn last week; TSH within normal limits at 1.8 mIU/L.',
    status: 'Active',
    createdAt: '2025-10-04T10:00:00Z',
    lastVisit: '2026-10-05',
  },
  {
    id: 'PAT-1086',
    name: 'David Kim',
    dateOfBirth: '1973-11-15',
    gender: 'Male',
    contact: {
      phone: '+1 (555) 674-2983',
      email: 'david.kim@example-med.com',
      emergencyContact: 'Grace Kim (Spouse) - +1 (555) 674-2984',
      address: '512 Pinecrest Drive',
    },
    medicalHistory: ['Gastroesophageal Reflux Disease (GERD)', 'Chronic Lumbar Strain'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    medications: ['Famotidine 20mg PRN', 'Meloxicam 7.5mg PRN for joint flare-ups'],
    additionalNotes: 'Participates in physical therapy for lumbar spine stability.',
    status: 'Active',
    createdAt: '2026-02-18T13:45:00Z',
    lastVisit: '2026-09-14',
  },
  {
    id: 'PAT-1087',
    name: 'Linda Washington',
    dateOfBirth: '1961-03-29',
    gender: 'Female',
    contact: {
      phone: '+1 (555) 238-7164',
      email: 'linda.washington@example-med.com',
      emergencyContact: 'Angela Washington (Daughter) - +1 (555) 238-7165',
      address: '88 Meadowbrook Trail',
    },
    medicalHistory: ['Postmenopausal Osteoporosis', 'Mild Controlled Asthma'],
    allergies: ['Ciprofloxacin (Tendinitis sensation)'],
    medications: ['Alendronate 70mg PO once weekly', 'Calcium Citrate + Vit D supplement'],
    additionalNotes: 'DEXA scan scheduled for next quarter.',
    status: 'Active',
    createdAt: '2025-12-01T15:00:00Z',
    lastVisit: '2026-08-30',
  },
  {
    id: 'PAT-1088',
    name: 'Robert Taylor',
    dateOfBirth: '1991-07-08',
    gender: 'Male',
    contact: {
      phone: '+1 (555) 543-9812',
      email: 'robert.taylor@example-med.com',
      emergencyContact: 'Hannah Taylor (Spouse) - +1 (555) 543-9813',
      address: '201 Cedar Ridge Way',
    },
    medicalHistory: ['Generalized Anxiety Disorder', 'Sleep-Onset Insomnia'],
    allergies: ['Latex (Skin contact rash)'],
    medications: ['Buspirone 10mg PO BID', 'Melatonin 3mg PRN at bedtime'],
    additionalNotes: 'Engaged in cognitive behavioral therapy with community therapist.',
    status: 'New',
    createdAt: '2026-10-01T09:30:00Z',
    lastVisit: '2026-10-01',
  },
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'CON-501',
    patientId: 'PAT-1081',
    date: '2026-10-13',
    time: '09:00',
    type: 'Follow-up',
    chiefComplaint: 'Quarterly blood pressure check and routine medication refill review.',
    historyOfPresentIllness: 'Patient reports feeling well overall. Denies chest discomfort, shortness of breath, headache, or visual disturbances. Home blood pressure log shows average readings of 126/82 mmHg over the past 3 weeks.',
    reviewOfSystems: 'Negative for chest pain, palpitations, orthopnea, or ankle swelling.',
    examinationFindings: 'BP: 124/80 mmHg right arm sitting. HR: 68 bpm regular. SpO2: 99% room air. Heart sounds S1/S2 normal without murmurs. Lungs clear to auscultation bilaterally. No peripheral edema.',
    assessment: '1. Essential Hypertension - well controlled on current regimen.\n2. Hyperlipidemia - stable.',
    plan: 'Continue Lisinopril 10mg daily and Atorvastatin 20mg at bedtime. Recheck basic metabolic panel and lipid panel in 6 months. Maintain current low-sodium DASH dietary habits.',
    followUpInstructions: 'Return in 6 months or sooner if home BP exceeds 140/90 mmHg.',
    status: 'Completed',
    clinicalNoteId: 'NOTE-901',
    createdAt: '2026-10-13T09:00:00Z',
    updatedAt: '2026-10-13T09:25:00Z',
  },
  {
    id: 'CON-502',
    patientId: 'PAT-1083',
    date: '2026-10-13',
    time: '09:45',
    type: 'Urgent Care',
    chiefComplaint: 'Persistent productive cough and nasal congestion for 10 days.',
    historyOfPresentIllness: 'Symptoms began as a mild sore throat, evolving into rhinorrhea and productive cough with clear-to-whitish sputum. Mild low-grade subjective fever on day 2 (resolved). Denies hemoptysis, pleuritic chest pain, or wheezing.',
    reviewOfSystems: 'Positive for cough, rhinorrhea, mild post-nasal drip. Negative for shortness of breath or high fevers.',
    examinationFindings: 'Temp: 98.4 F. BP: 118/74 mmHg. HR: 74 bpm. RR: 16/min. SpO2: 98% room air. Pharynx mildly erythematous without exudate. Tympanic membranes clear. Lungs: normal breath sounds bilaterally, no wheezing, rhonchi, or rales.',
    assessment: 'Acute viral bronchitis / upper respiratory tract infection. Asthmatic component stable with no bronchospasm.',
    plan: '1. Supportive care: oral hydration, warm steam inhalations.\n2. Dextromethorphan/guaifenesin for daytime cough symptomatic relief.\n3. Continue Albuterol HFA PRN if cough triggers chest tightness.\n4. Reassurance regarding viral etiology; antibiotics not indicated at this time.',
    followUpInstructions: 'Return if fever spikes above 101 F, shortness of breath develops, or symptoms do not improve after 7 more days.',
    status: 'In Progress',
    clinicalNoteId: 'NOTE-902',
    createdAt: '2026-10-13T09:45:00Z',
    updatedAt: '2026-10-13T10:05:00Z',
  },
  {
    id: 'CON-503',
    patientId: 'PAT-1082',
    date: '2026-10-13',
    time: '11:00',
    type: 'Follow-up',
    chiefComplaint: 'Diabetes management review and discussion of recent fasting blood sugars.',
    historyOfPresentIllness: 'Fasting blood glucose readings range between 125-140 mg/dL. Reports slight distal numbness in bilateral toes over past 2 months, worse at rest. No open sores or ulcers on feet.',
    reviewOfSystems: 'Positive for mild distal paresthesias in bilateral toes. Negative for polydipsia, polyuria, or weight changes.',
    examinationFindings: 'BP: 128/82 mmHg. HR: 72 bpm. BMI: 27.4 kg/m2. Feet: normal monofilament sensation in 8/10 points bilaterally, intact dorsalis pedis pulses 2+ bilaterally, no ulcerations or calluses.',
    assessment: '1. Type 2 Diabetes Mellitus - suboptimally controlled; HbA1c 7.4%.\n2. Early mild diabetic sensory polyneuropathy, bilateral lower extremities.',
    plan: 'Increase Metformin to 1000mg PO BID with meals. Order repeat HbA1c in 3 months. Referred to certified diabetes nutrition specialist. Instructed on daily diabetic foot inspection protocols.',
    followUpInstructions: 'Follow-up in 3 months with updated lab work.',
    status: 'Scheduled',
    createdAt: '2026-10-13T08:00:00Z',
    updatedAt: '2026-10-13T08:00:00Z',
  },
  {
    id: 'CON-504',
    patientId: 'PAT-1084',
    date: '2026-10-13',
    time: '13:30',
    type: 'Routine Checkup',
    chiefComplaint: 'Bilateral knee stiffness and evaluation of cardiac wellness.',
    historyOfPresentIllness: 'Morning stiffness in both knees lasting roughly 20 minutes, exacerbated by prolonged walking or descending stairs. Cardiac symptoms remain quiescent with no angina or exertional dyspnea.',
    reviewOfSystems: 'Negative for chest pressure, orthopnea, syncope. Positive for knee crepitus without warmth or redness.',
    examinationFindings: 'BP: 122/76 mmHg. HR: 64 bpm. Regular rate and rhythm. Knees: mild bilateral crepitus on passive flexion, no effusion, range of motion 0-125 degrees bilaterally.',
    assessment: '1. Bilateral primary knee osteoarthritis - mild to moderate symptomatic.\n2. Stable CAD s/p remote stent.',
    plan: 'Trial topical Diclofenac 1% gel TID for knee discomfort as needed. Recommended low-impact aquatic therapy exercises. Continue cardiac regimen unchanged.',
    followUpInstructions: 'Routine follow-up in 4 months.',
    status: 'Draft',
    clinicalNoteId: 'NOTE-903',
    createdAt: '2026-10-13T13:30:00Z',
    updatedAt: '2026-10-13T13:45:00Z',
  },
  {
    id: 'CON-505',
    patientId: 'PAT-1085',
    date: '2026-10-13',
    time: '14:30',
    type: 'Follow-up',
    chiefComplaint: 'Migraine frequency evaluation and thyroid lab discussion.',
    historyOfPresentIllness: 'Experiencing 2-3 migraine episodes per month, typically preceded by scintillating scotoma visual aura. Sumatriptan provides effective relief within 90 minutes when taken early.',
    reviewOfSystems: 'Negative for neck stiffness, focal weakness, or dysphagia. Positive for photophobia during headache.',
    examinationFindings: 'BP: 116/72 mmHg. HR: 66 bpm. Neurologic exam non-focal. Cranial nerves II-XII intact. Thyroid gland non-tender without palpable nodules.',
    assessment: '1. Migraine with aura - responsive to triptan abortive therapy.\n2. Primary hypothyroidism - euthyroid on current levothyroxine dosage.',
    plan: 'Continue Sumatriptan 50mg PRN at aura onset (maximum 200mg/24hr). Maintain Levothyroxine 75mcg daily. Keep headache diary to monitor monthly frequency.',
    followUpInstructions: 'Return in 6 months for annual thyroid panel and headache review.',
    status: 'Scheduled',
    createdAt: '2026-10-13T08:15:00Z',
    updatedAt: '2026-10-13T08:15:00Z',
  },
  {
    id: 'CON-506',
    patientId: 'PAT-1086',
    date: '2026-10-13',
    time: '15:15',
    type: 'Telehealth',
    chiefComplaint: 'Virtual check-in for GERD symptoms and dietary adjustments.',
    historyOfPresentIllness: 'Occasional nighttime acid regurgitation 2 nights per week, especially following meals consumed after 8 PM. No dysphagia, odynophagia, or unintentional weight loss.',
    reviewOfSystems: 'Negative for chest pain, vomiting, melena. Positive for retrosternal burning.',
    examinationFindings: 'Telehealth visit: Patient appears in no acute distress, speaking in full sentences comfortably. Abdominal exam deferred.',
    assessment: 'Gastroesophageal reflux disease (GERD) - mild, nocturnal symptoms with dietary trigger component.',
    plan: 'Lifestyle counseling provided: elevate head of bed 6 inches, avoid eating within 3 hours of sleep, limit trigger foods. Switch Famotidine to 20mg BID before morning and evening meals.',
    followUpInstructions: 'Message via portal in 4 weeks. In-person clinic visit if heartburn persists or alarms symptoms occur.',
    status: 'Scheduled',
    createdAt: '2026-10-13T08:30:00Z',
    updatedAt: '2026-10-13T08:30:00Z',
  },
  {
    id: 'CON-507',
    patientId: 'PAT-1087',
    date: '2026-10-12',
    time: '14:00',
    type: 'Annual Wellness',
    chiefComplaint: 'Annual preventive wellness exam and bone density counseling.',
    historyOfPresentIllness: 'Patient reports good stamina with 30-minute daily walking routine. Takes Alendronate weekly with full glass of water without GI side effects. No falls or fractures in the past year.',
    reviewOfSystems: 'Negative for weight loss, cough, back pain, or vision changes.',
    examinationFindings: 'BP: 120/78 mmHg. HR: 70 bpm. Height: 64 inches (unchanged from prior year). Cardiac and pulmonary exams unremarkable. Spine non-tender without kyphosis.',
    assessment: '1. Postmenopausal Osteoporosis - stable on bisphosphonate therapy.\n2. Preventive wellness visit - age-appropriate screenings up to date.',
    plan: 'Order repeat DEXA scan for bone mineral density tracking. Continue Alendronate 70mg weekly with proper upright precautions. Continue daily Calcium and Vitamin D supplementation.',
    followUpInstructions: 'Review DEXA results when completed in 4 weeks.',
    status: 'Completed',
    clinicalNoteId: 'NOTE-904',
    createdAt: '2026-10-12T14:00:00Z',
    updatedAt: '2026-10-12T14:35:00Z',
  },
  {
    id: 'CON-508',
    patientId: 'PAT-1088',
    date: '2026-10-11',
    time: '10:30',
    type: 'Initial Consultation',
    chiefComplaint: 'Establish primary care and discuss ongoing management of anxiety and sleep difficulties.',
    historyOfPresentIllness: 'New patient to clinic. Reports generalized worry regarding work demands for past 8 months. Sleep latency approximately 60-90 minutes. Denies panic attacks, depression, or suicidal ideation.',
    reviewOfSystems: 'Positive for restless sleep and muscle tension. Negative for palpitations, weight changes, or shortness of breath.',
    examinationFindings: 'BP: 126/80 mmHg. HR: 76 bpm. Alert, oriented x 4. Affect anxious but cooperative. Clear speech. Systemic examination within normal limits.',
    assessment: 'Generalized anxiety disorder with associated sleep onset insomnia.',
    plan: '1. Continue Buspirone 10mg BID.\n2. Sleep hygiene education: consistent bedtime, blue-light avoidance.\n3. Baseline routine labs ordered (CBC, CMP, TSH).\n4. Continue outpatient counseling.',
    followUpInstructions: 'Return in 4 weeks to review lab results and clinical response.',
    status: 'Completed',
    clinicalNoteId: 'NOTE-905',
    createdAt: '2026-10-11T10:30:00Z',
    updatedAt: '2026-10-11T11:15:00Z',
  },
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'NOTE-901',
    consultationId: 'CON-501',
    patientId: 'PAT-1081',
    title: 'Clinical Consultation Note — Eleanor Vance',
    content: {
      subjective: 'Chief Complaint: Quarterly blood pressure check and routine medication refill review.\nHistory of Present Illness: Patient reports feeling well overall. Denies chest discomfort, shortness of breath, headache, or visual disturbances. Home blood pressure log shows average readings of 126/82 mmHg over the past 3 weeks.\nMedical History: Essential Hypertension (diagnosed 2018), Hyperlipidemia, Osteopenia.\nAllergies: Penicillin (Hives / Rash), Sulfa drugs (Mild nausea).\nCurrent Medications: Lisinopril 10mg PO daily, Atorvastatin 20mg PO at bedtime, Vitamin D3 2000 IU daily.',
      objective: 'Physical Examination Findings & Vitals:\nBP: 124/80 mmHg right arm sitting. HR: 68 bpm regular. SpO2: 99% room air.\nGeneral: Alert, well-groomed, pleasant female in no acute distress.\nCardiovascular: S1/S2 present, regular rate and rhythm. No murmurs, rubs, or gallops.\nPulmonary: Clear to auscultation bilaterally. No wheezes, rhonchi, or rales.\nExtremities: No peripheral edema in lower extremities.',
      assessment: '1. Essential Hypertension - well controlled on current regimen.\n2. Hyperlipidemia - clinically stable.',
      plan: '1. Continue Lisinopril 10mg daily and Atorvastatin 20mg at bedtime.\n2. Recheck basic metabolic panel and lipid panel in 6 months.\n3. Maintain current low-sodium DASH dietary habits.\n4. Follow-up: Return in 6 months or sooner if home BP exceeds 140/90 mmHg.',
    },
    fullFormattedNote: `CLINICAL CONSULTATION NOTE
PATIENT: Eleanor Vance (DOB: 1970-04-12, Age: 56) | ID: PAT-1081
DATE: 2026-10-13 | TYPE: Follow-up | ATTENDING: Dr. Sarah Morgan, MD

[SUBJECTIVE]
Chief Complaint: Quarterly blood pressure check and routine medication refill review.
History of Present Illness: Patient reports feeling well overall. Denies chest discomfort, shortness of breath, headache, or visual disturbances. Home blood pressure log shows average readings of 126/82 mmHg over the past 3 weeks.
Known Medical History: Essential Hypertension (diagnosed 2018), Hyperlipidemia, Osteopenia.
Allergies: Penicillin (Hives / Rash), Sulfa drugs (Mild nausea).
Current Medications: Lisinopril 10mg PO daily, Atorvastatin 20mg PO at bedtime, Vitamin D3 2000 IU daily.

[OBJECTIVE]
Vitals: BP 124/80 mmHg, HR 68 bpm, SpO2 99% RA.
Physical Examination:
- General: Alert and oriented, in no acute distress.
- Cardiovascular: Normal S1/S2, regular rate and rhythm, no murmurs.
- Pulmonary: Clear to auscultation bilaterally.
- Extremities: No peripheral edema.

[ASSESSMENT]
1. Essential Hypertension - well controlled on current regimen.
2. Hyperlipidemia - clinically stable.

[PLAN]
1. Continue Lisinopril 10mg daily and Atorvastatin 20mg at bedtime.
2. Recheck basic metabolic panel and lipid panel in 6 months.
3. Maintain current low-sodium DASH dietary habits.
4. Follow-up in 6 months or sooner if home BP exceeds 140/90 mmHg.

Electronically signed by: Dr. Sarah Morgan, MD
Status: Finalized (Audit Confirmed)`,
    generatedBy: 'Clinote AI Assistant (Draft)',
    status: 'Finalized',
    doctorName: 'Dr. Sarah Morgan, MD',
    createdAt: '2026-10-13T09:18:00Z',
    updatedAt: '2026-10-13T09:25:00Z',
    reviewedAt: '2026-10-13T09:22:00Z',
    finalizedAt: '2026-10-13T09:25:00Z',
  },
  {
    id: 'NOTE-902',
    consultationId: 'CON-502',
    patientId: 'PAT-1083',
    title: 'Clinical Consultation Note — Sophia Rodriguez',
    content: {
      subjective: 'Chief Complaint: Persistent productive cough and nasal congestion for 10 days.\nHistory of Present Illness: Symptoms began as a mild sore throat, evolving into rhinorrhea and productive cough with clear-to-whitish sputum. Mild low-grade subjective fever on day 2 (resolved). Denies hemoptysis, pleuritic chest pain, or wheezing.\nAllergies: Aspirin (Bronchospasm / Wheezing).\nMedications: Albuterol HFA Inhaler 90mcg PRN, Sertraline 50mg daily.',
      objective: 'Vitals: Temp 98.4 F, BP 118/74 mmHg, HR 74 bpm, RR 16/min, SpO2 98% room air.\nExamination: Pharynx mildly erythematous without exudate. Tympanic membranes clear. Lungs: normal breath sounds bilaterally, no wheezing or crackles.',
      assessment: 'Acute viral bronchitis / upper respiratory tract infection. Asthmatic component stable with no bronchospasm.',
      plan: '1. Supportive care: oral hydration, warm steam inhalations.\n2. Dextromethorphan/guaifenesin for daytime cough symptomatic relief.\n3. Continue Albuterol HFA PRN if cough triggers chest tightness.\n4. Reassurance regarding viral etiology; antibiotics not indicated at this time.\nFollow-up: Return if fever spikes above 101 F, shortness of breath develops, or symptoms do not improve after 7 more days.',
    },
    fullFormattedNote: `CLINICAL CONSULTATION NOTE
PATIENT: Sophia Rodriguez (DOB: 1995-12-03, Age: 30) | ID: PAT-1083
DATE: 2026-10-13 | TYPE: Urgent Care | ATTENDING: Dr. Sarah Morgan, MD

[SUBJECTIVE]
Chief Complaint: Persistent productive cough and nasal congestion for 10 days.
HPI: Symptoms began as a mild sore throat, evolving into rhinorrhea and productive cough with clear-to-whitish sputum. Mild low-grade subjective fever on day 2 (resolved). Denies hemoptysis, pleuritic chest pain, or wheezing.
Allergies: Aspirin (Bronchospasm / Wheezing).
Medications: Albuterol HFA Inhaler 90mcg 2 puffs PRN, Sertraline 50mg PO daily.

[OBJECTIVE]
Vitals: Temp: 98.4 F, BP: 118/74 mmHg, HR: 74 bpm, RR: 16/min, SpO2: 98% RA.
Exam: Pharynx mildly erythematous without exudate. Lungs clear to auscultation bilaterally, no wheezing, rhonchi, or rales.

[ASSESSMENT]
Acute viral bronchitis / upper respiratory tract infection. Asthmatic component stable with no bronchospasm.

[PLAN]
1. Supportive care: hydration and humidified air.
2. OTC guaifenesin/dextromethorphan for symptomatic cough relief.
3. Albuterol HFA PRN for any reactive bronchospasm.
4. Red-flag warnings reviewed: return for high fevers, hemoptysis, or shortness of breath.

AI-Assisted Draft • Clinical Review Performed
Status: Reviewed (Pending Final Sign-off)`,
    generatedBy: 'Clinote AI Assistant (Draft)',
    status: 'Reviewed',
    doctorName: 'Dr. Sarah Morgan, MD',
    createdAt: '2026-10-13T10:01:00Z',
    updatedAt: '2026-10-13T10:05:00Z',
    reviewedAt: '2026-10-13T10:05:00Z',
  },
  {
    id: 'NOTE-903',
    consultationId: 'CON-504',
    patientId: 'PAT-1084',
    title: 'Clinical Consultation Note — James O\'Connor',
    content: {
      subjective: 'Chief Complaint: Bilateral knee stiffness and evaluation of cardiac wellness.\nHPI: Morning stiffness in both knees lasting roughly 20 minutes, exacerbated by prolonged walking or descending stairs. Cardiac symptoms remain quiescent with no angina or exertional dyspnea.\nAllergies: Codeine (Severe nausea & dizziness).\nMedications: Metoprolol Succinate 25mg daily, Aspirin 81mg daily, Omeprazole 20mg daily.',
      objective: 'BP: 122/76 mmHg. HR: 64 bpm. Regular rate and rhythm. Knees: mild bilateral crepitus on passive flexion, no effusion, range of motion 0-125 degrees bilaterally.',
      assessment: '1. Bilateral primary knee osteoarthritis - mild to moderate symptomatic.\n2. Stable CAD s/p remote stent.',
      plan: 'Trial topical Diclofenac 1% gel TID for knee discomfort as needed. Recommended low-impact aquatic therapy exercises. Continue cardiac regimen unchanged.\nFollow-up in 4 months.',
    },
    fullFormattedNote: `CLINICAL CONSULTATION NOTE (AI-ASSISTED DRAFT)
PATIENT: James O'Connor (DOB: 1957-06-18, Age: 69) | ID: PAT-1084
DATE: 2026-10-13 | TYPE: Routine Checkup | ATTENDING: Dr. Sarah Morgan, MD

[SUBJECTIVE]
Chief Complaint: Bilateral knee stiffness and evaluation of cardiac wellness.
History of Present Illness: Morning stiffness in both knees lasting roughly 20 minutes, exacerbated by prolonged walking or descending stairs. Cardiac symptoms remain quiescent with no angina or exertional dyspnea.
Medical History: Coronary Artery Disease (Stent placed 2021), Bilateral Knee Osteoarthritis, GERD.
Allergies: Codeine (Severe nausea & dizziness).
Medications: Metoprolol Succinate 25mg daily, Aspirin 81mg daily, Omeprazole 20mg daily.

[OBJECTIVE]
Vitals: BP 122/76 mmHg, HR 64 bpm regular.
Physical Exam: Knees with mild bilateral crepitus on passive flexion, no effusion, full active extension, flexion to 125 degrees bilaterally.

[ASSESSMENT]
1. Bilateral primary knee osteoarthritis - mild to moderate symptomatic.
2. Stable CAD s/p remote stent.

[PLAN]
1. Trial topical Diclofenac 1% gel TID for knee discomfort as needed.
2. Low-impact aquatic therapy exercises recommended.
3. Continue current cardiovascular pharmacotherapy unchanged.
4. Follow-up: Routine follow-up in 4 months.

Note Status: Draft (Awaiting Doctor Review & Finalization)`,
    generatedBy: 'Clinote AI Assistant (Draft)',
    status: 'Draft',
    doctorName: 'Dr. Sarah Morgan, MD',
    createdAt: '2026-10-13T13:42:00Z',
    updatedAt: '2026-10-13T13:42:00Z',
  },
  {
    id: 'NOTE-904',
    consultationId: 'CON-507',
    patientId: 'PAT-1087',
    title: 'Clinical Consultation Note — Linda Washington',
    content: {
      subjective: 'Chief Complaint: Annual preventive wellness exam and bone density counseling.\nHPI: Patient reports good stamina with 30-minute daily walking routine. Takes Alendronate weekly with full glass of water without GI side effects. No falls or fractures in the past year.\nAllergies: Ciprofloxacin (Tendinitis sensation).\nMedications: Alendronate 70mg weekly, Calcium Citrate + Vit D supplement.',
      objective: 'BP: 120/78 mmHg. HR: 70 bpm. Height: 64 inches. Cardiac and pulmonary exams unremarkable. Spine non-tender without kyphosis.',
      assessment: '1. Postmenopausal Osteoporosis - stable on bisphosphonate therapy.\n2. Preventive wellness visit - age-appropriate screenings up to date.',
      plan: 'Order repeat DEXA scan for bone mineral density tracking. Continue Alendronate 70mg weekly with proper upright precautions. Continue daily Calcium and Vitamin D supplementation.\nFollow-up in 4 weeks to review scan results.',
    },
    fullFormattedNote: `CLINICAL CONSULTATION NOTE
PATIENT: Linda Washington (DOB: 1961-03-29, Age: 65) | ID: PAT-1087
DATE: 2026-10-12 | TYPE: Annual Wellness | ATTENDING: Dr. Sarah Morgan, MD

[SUBJECTIVE]
Chief Complaint: Annual preventive wellness exam and bone density counseling.
History of Present Illness: Patient reports good stamina with 30-minute daily walking routine. Takes Alendronate weekly with full glass of water without GI side effects. No falls or fractures in the past year.
Medical History: Postmenopausal Osteoporosis, Mild Controlled Asthma.
Allergies: Ciprofloxacin (Tendinitis sensation).
Medications: Alendronate 70mg PO once weekly, Calcium Citrate + Vit D supplement.

[OBJECTIVE]
Vitals: BP 120/78 mmHg, HR 70 bpm.
Physical Exam: General appearance well. Heart regular, lungs clear bilaterally. Musculoskeletal: Spine normal curvature without localized tenderness. Gait steady.

[ASSESSMENT]
1. Postmenopausal Osteoporosis - stable on bisphosphonate therapy.
2. Preventive wellness visit - age-appropriate screenings up to date.

[PLAN]
1. Order repeat DEXA scan for bone mineral density tracking.
2. Continue Alendronate 70mg weekly with proper upright precautions.
3. Continue daily Calcium and Vitamin D supplementation.
4. Review DEXA results when completed in 4 weeks.

Electronically signed by: Dr. Sarah Morgan, MD
Status: Finalized (Audit Confirmed)`,
    generatedBy: 'Clinote AI Assistant (Draft)',
    status: 'Finalized',
    doctorName: 'Dr. Sarah Morgan, MD',
    createdAt: '2026-10-12T14:28:00Z',
    updatedAt: '2026-10-12T14:35:00Z',
    reviewedAt: '2026-10-12T14:32:00Z',
    finalizedAt: '2026-10-12T14:35:00Z',
  },
  {
    id: 'NOTE-905',
    consultationId: 'CON-508',
    patientId: 'PAT-1088',
    title: 'Clinical Consultation Note — Robert Taylor',
    content: {
      subjective: 'Chief Complaint: Establish primary care and discuss ongoing management of anxiety and sleep difficulties.\nHPI: New patient to clinic. Reports generalized worry regarding work demands for past 8 months. Sleep latency approximately 60-90 minutes. Denies panic attacks, depression, or suicidal ideation.\nAllergies: Latex (Skin contact rash).\nMedications: Buspirone 10mg PO BID, Melatonin 3mg PRN at bedtime.',
      objective: 'BP: 126/80 mmHg. HR: 76 bpm. Alert, oriented x 4. Affect anxious but cooperative. Clear speech. Systemic examination within normal limits.',
      assessment: 'Generalized anxiety disorder with associated sleep onset insomnia.',
      plan: '1. Continue Buspirone 10mg BID.\n2. Sleep hygiene education: consistent bedtime, blue-light avoidance.\n3. Baseline routine labs ordered (CBC, CMP, TSH).\n4. Continue outpatient counseling.\nFollow-up in 4 weeks.',
    },
    fullFormattedNote: `CLINICAL CONSULTATION NOTE
PATIENT: Robert Taylor (DOB: 1991-07-08, Age: 35) | ID: PAT-1088
DATE: 2026-10-11 | TYPE: Initial Consultation | ATTENDING: Dr. Sarah Morgan, MD

[SUBJECTIVE]
Chief Complaint: Establish primary care and discuss ongoing management of anxiety and sleep difficulties.
History of Present Illness: New patient to clinic. Reports generalized worry regarding work demands for past 8 months. Sleep latency approximately 60-90 minutes. Denies panic attacks, depression, or suicidal ideation.
Medical History: Generalized Anxiety Disorder, Sleep-Onset Insomnia.
Allergies: Latex (Skin contact rash).
Medications: Buspirone 10mg PO BID, Melatonin 3mg PRN at bedtime.

[OBJECTIVE]
Vitals: BP 126/80 mmHg, HR 76 bpm.
Physical Exam: Patient alert and fully oriented. Affect mildly anxious, thought process linear and goal-directed. Heart and lung sounds normal. Neurologically intact.

[ASSESSMENT]
Generalized anxiety disorder with associated sleep onset insomnia.

[PLAN]
1. Continue Buspirone 10mg BID.
2. Sleep hygiene education provided.
3. Baseline routine labs ordered (CBC, CMP, TSH).
4. Continue outpatient counseling.
5. Return in 4 weeks to review lab results and clinical response.

Electronically signed by: Dr. Sarah Morgan, MD
Status: Finalized (Audit Confirmed)`,
    generatedBy: 'Clinote AI Assistant (Draft)',
    status: 'Finalized',
    doctorName: 'Dr. Sarah Morgan, MD',
    createdAt: '2026-10-11T11:05:00Z',
    updatedAt: '2026-10-11T11:15:00Z',
    reviewedAt: '2026-10-11T11:10:00Z',
    finalizedAt: '2026-10-11T11:15:00Z',
  },
];

export const DEMO_PRESET_CASES: DemoPresetCase[] = [
  {
    id: 'PRESET-HTN',
    caseTitle: 'Hypertension 6-Month Review (Well Controlled)',
    patientName: 'Eleanor Vance',
    type: 'Follow-up',
    chiefComplaint: 'Routine 6-month blood pressure review and prescription renewal.',
    historyOfPresentIllness: 'Patient returns for scheduled hypertension follow-up. Reports good medication compliance with Lisinopril 10mg daily. Brings in written home blood pressure log averaging 124/78 mmHg over the past 30 days. No headaches, dizziness, chest pressure, orthopnea, or ankle edema noted.',
    reviewOfSystems: 'Denies chest pain, palpitation, dyspnea on exertion, syncope, or visual disturbances.',
    examinationFindings: 'BP: 122/80 mmHg sitting right arm. HR: 68 bpm regular. SpO2: 99% room air. BMI: 24.8. Cardiovascular: S1/S2 distinct, no murmurs or extra sounds. Lungs: Clear to auscultation bilaterally. Extremities: Peripheral pulses 2+ symmetric, trace or no pedal edema.',
    assessment: '1. Essential Hypertension - well controlled on current single-agent therapy.\n2. Hyperlipidemia - stable on statin therapy.',
    plan: '1. Refill Lisinopril 10mg PO daily for 6 months.\n2. Refill Atorvastatin 20mg PO daily at bedtime.\n3. Routine annual lab work ordered: Comprehensive Metabolic Panel (electrolytes, BUN, creatinine) and Fasting Lipid Panel.\n4. Continue low-sodium dietary habits and 30-minute daily walking routine.',
    followUpInstructions: 'Return in 6 months for blood pressure and lab review, or sooner if home BP exceeds 140/90 mmHg.',
  },
  {
    id: 'PRESET-BRONCH',
    caseTitle: 'Acute Bronchitis & Cough (Urgent Care)',
    patientName: 'Sophia Rodriguez',
    type: 'Urgent Care',
    chiefComplaint: 'Persistent cough for 9 days with mild chest tightness.',
    historyOfPresentIllness: 'Patient reports upper respiratory symptoms starting 9 days ago with sore throat and clear rhinorrhea. Now has persistent paroxysmal cough productive of small amounts of whitish sputum. Mild chest soreness from coughing. Denies shortness of breath, high fevers, hemoptysis, or night sweats.',
    reviewOfSystems: 'Constitutional: Low-grade subjective fever day 2, afebrile since. Respiratory: Cough present, mild post-nasal drip. Negative for wheezing or dyspnea.',
    examinationFindings: 'Temp: 98.6 F. BP: 116/74 mmHg. HR: 76 bpm. RR: 16/min. SpO2: 99% on room air. ENT: Posterior pharynx mildly injected, no purulent exudate. Neck: Supple, no lymphadenopathy. Lungs: Good air movement bilaterally. Scattered mild rhonchi clearing with cough. No wheezes or crackles.',
    assessment: '1. Acute viral bronchitis.\n2. Mild reactive airway irritability without overt bronchospasm.',
    plan: '1. Reassurance provided regarding typical viral trajectory (10-14 days duration).\n2. Oral hydration and steam inhalation recommended.\n3. OTC Dextromethorphan / Guaifenesin 10ml Q4H PRN for bothersome cough.\n4. Albuterol HFA 90mcg 2 puffs Q4-6H PRN if chest tightness occurs.\n5. Antibiotics withheld as clinical presentation is viral in origin.',
    followUpInstructions: 'Return if fever spikes above 101 F, shortness of breath develops, chest pain worsens, or cough persists beyond 3 weeks.',
  },
  {
    id: 'PRESET-DM2',
    caseTitle: 'Type 2 Diabetes Routine Optimization',
    patientName: 'Marcus Chen',
    type: 'Follow-up',
    chiefComplaint: 'Follow-up for type 2 diabetes management and lab review.',
    historyOfPresentIllness: 'Marcus returns for quarterly diabetes evaluation. Self-reported glucometer readings range between 120-145 mg/dL fasting, and 160-185 mg/dL postprandial. Takes Metformin 500mg BID consistently with meals. Denies hypoglycemic episodes, polyuria, polydipsia, or blurry vision.',
    reviewOfSystems: 'Negative for chest discomfort, claudication, or focal weakness. Notes occasional mild tingling sensation in bilateral great toes at bedtime.',
    examinationFindings: 'BP: 126/82 mmHg. HR: 72 bpm. Weight: 178 lbs (down 2 lbs from prior visit). Feet examination: Intact skin, no calluses or erythema. Sensation intact to 10g Semmes-Weinstein monofilament across all test sites bilaterally. Dorsalis pedis and posterior tibial pulses 2+ bilaterally.',
    assessment: '1. Type 2 Diabetes Mellitus without acute complications; fair glycemic control (recent HbA1c 7.4%).\n2. Mild intermittent sensory symptoms in lower extremities.',
    plan: '1. Increase Metformin to 850mg PO BID with meals to target HbA1c < 7.0%.\n2. Order repeat HbA1c in 12 weeks.\n3. Annual dilated retinal eye exam referral given.\n4. Reinforce daily foot self-inspection and comfortable footwear.\n5. Nutrition counseling follow-up for carbohydrate distribution.',
    followUpInstructions: 'Follow up in 3 months with updated HbA1c lab results.',
  },
  {
    id: 'PRESET-MIGRAINE',
    caseTitle: 'Migraine with Visual Aura Review',
    patientName: 'Amina Patel',
    type: 'Follow-up',
    chiefComplaint: 'Evaluation of recurrent migraine headaches and medication review.',
    historyOfPresentIllness: 'Patient reports 2-3 severe throbbing right-sided headaches per month over past 4 months. Typically preceded by 20-30 minutes of jagged shimmering visual lines in left visual field. Accompanied by photophobia and nausea. Takes Sumatriptan 50mg with good resolution within 2 hours. Triggers include irregular sleep and screen glare.',
    reviewOfSystems: 'Positive for photophobia, phonophobia, and mild nausea during headache. Negative for fever, neck stiffness, numbness, or weakness.',
    examinationFindings: 'BP: 114/70 mmHg. HR: 66 bpm. Alert and comfortable. Cranial nerves II through XII grossly intact. Visual fields intact to confrontation. Fundoscopic exam reveals sharp disc margins without papilledema. Gait and balance normal.',
    assessment: '1. Episodic migraine with visual aura.\n2. Good symptomatic response to abortive 5-HT1B/1D agonist therapy.',
    plan: '1. Refill Sumatriptan 50mg tablets #9 for abortive therapy at first sign of aura.\n2. Add lifestyle trigger management: blue-light filtering, consistent sleep schedule, adequate hydration.\n3. Maintain headache diary recording frequency, duration, and abortive medication timing.\n4. If monthly headache frequency exceeds 4 episodes/month, consider initiating preventive therapy (e.g., topiramate or beta-blocker).',
    followUpInstructions: 'Follow up in 4 to 6 months with headache diary.',
  },
];
