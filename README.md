# Clinote AI — Commercial Doctor Consultation Assistant SaaS Prototype

> **Tagline:** Less paperwork. More focus on patient care.

Clinote AI is a commercial healthcare SaaS prototype designed for physicians to manage patient encounters, structure daily consultation schedules, generate AI-assisted clinical notes (SOAP format), and review patient records from an intuitive, single dashboard.

Built as an enterprise-grade concept demonstration for prospective clients (Fiverr presentation ready), this prototype runs entirely locally in the browser with deterministic AI simulation, client-side persistence, and zero paid API dependencies.

---

## 🌟 Key Features

### 1. Unified Practice Dashboard
- **Personalized Provider Greeting:** Real-time greeting for Dr. Sarah Morgan, MD with clinic affiliation (`MetroHealth Physicians Group`).
- **Dynamic Metric Cards:** Live counts computed from the dataset (Today's Consultations, Total Patients, Draft Clinical Notes Awaiting Review, Completed Encounters).
- **Consultation Schedule Table:** Filter by status (`All`, `Scheduled`, `In Progress`, `Completed`, `Draft`) with one-click desk resume buttons.
- **Notes Awaiting Review Panel:** Instant review & sign-off directly from the dashboard.
- **Recent Clinical Activity Feed:** Live audit log of provider actions.

### 2. Interactive Patient Management
- **Directory Data Table:** Search by patient name, patient ID, diagnosis, or allergies.
- **Allergy Safety Badging:** Prominent visual alerts for drug sensitivities (e.g., Penicillin hives, Aspirin bronchospasm, NKDA).
- **Patient Profile Modal:** Detailed demographics, age calculator, contact info, emergency contacts, chronic conditions, and current medications.
- **Encounter & Notes History:** Direct links from a patient's profile to their previous consultations and generated notes.
- **Add / Edit Patient Form:** Full client-side validation and local storage persistence.

### 3. Consultation Workspace & AI Note Synthesis
- **Step 1: Patient Selection & Visit Details:** Select existing patients with instant medical history & allergy preview, or quick-add fictional patients.
- **1-Click Demo Scenarios:** Instant preset loader for live client demos:
  - *Hypertension 6-Month Review (Well Controlled)*
  - *Acute Bronchitis & Cough (Urgent Care)*
  - *Type 2 Diabetes Routine Optimization*
  - *Migraine with Visual Aura Review*
- **Step 2: Structured Clinical Documentation:**
  - Chief Complaint
  - History of Present Illness (HPI)
  - Review of Systems (ROS)
  - Physical Examination Findings & Vitals
  - Clinical Assessment & Diagnostic Impression
  - Plan, Medications & Patient Instructions
  - Follow-up Guidance
- **Step 3: AI-Assisted Clinical Note Generator:**
  - Realistic multi-stage transformer simulation with visual progress indicator.
  - Generates standardized **SOAP (Subjective, Objective, Assessment, Plan)** notes.
  - Strict compliance: uses only entered data, marks absent fields as `(Not provided)`, avoiding hallucinations.
  - Labeled with: `AI-Assisted Draft • Clinical Review Required`.
- **Step 4: Review, Edit & Finalize:**
  - In-place document editing toggle.
  - Copy note to clipboard with toast notification.
  - Save draft and resume anytime.
  - Physician review verification.
  - Formal finalization with confirmation modal, locking the note with electronic signature and audit timestamp.

### 4. Clinical Notes Library
- Searchable repository filtered by `All`, `Draft`, `Reviewed`, and `Finalized`.
- Hospital-grade document viewer with patient banner, doctor credentials, and audit trail.
- Export options: Copy text and one-click download as `.txt` file.

### 5. Application Settings & Demo Safety
- Doctor Profile customization (Name, Specialty, Clinic Name, License / NPI #, Email, Phone).
- Documentation preferences (SOAP, POMR, Narrative format; comfortable vs compact density).
- **Safety & Prototype Notice:** Explicit disclaimer that this is a commercial concept prototype operating on synthetic data.
- **Demo Data Reset:** One-click restoration back to the initial 8 synthetic patient cases.

---

## 💻 Tech Stack

- **Framework:** Next.js (App Router with Turbopack)
- **Language:** TypeScript (Strict typing across data models and services)
- **Styling:** Tailwind CSS (Deep navy `#0f172a`, soft slate `#f8fafc`, restrained teal `#0d9488` accents)
- **Icons:** Lucide React
- **Persistence:** Browser `localStorage` with custom multi-tab event synchronization
- **Architecture:** Isolated service layer for AI note generation and storage persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Installation

1. Navigate to the project root directory:
   ```bash
   cd "c:\Personal Project\Doctor demo"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at [http://localhost:3000](http://localhost:3000).

### Production Build
To test the production build:
```bash
npm run build
npm run start
```

---

## 🧪 Live Demo Walkthrough (Fiverr Presentation Script)

1. **Dashboard Overview:**
   - Notice the greeting: `Good morning, Dr. Morgan.`
   - Point out the 4 stat cards (e.g. 8 consultations, 24 patients, draft notes awaiting review).
   - Show the Today's Schedule table with status pills.

2. **Global Search:**
   - Click `Ctrl + K` or the search bar in the top navigation.
   - Type `"Eleanor"` or `"PAT-1081"` to jump directly to Eleanor Vance's record.

3. **Patient Management:**
   - Go to `/patients`.
   - Click **Add New Patient** to register a fictional demo patient.
   - Click on any patient row (e.g., Marcus Chen) to inspect their profile, allergies, and consultation history.
   - Click **Start Consultation** directly from their profile.

4. **1-Click Scenario Demo:**
   - In the consultation desk (`/consultations/new`), click the **"⚡ Load Preset Clinical Case..."** dropdown.
   - Select **"Acute Bronchitis & Cough (Urgent Care)"**.
   - Notice all clinical fields (Chief Complaint, HPI, Physical Exam, Assessment, Plan) instantly populate with realistic medical phrasing.

5. **Generate AI Draft Note:**
   - Click the teal **"Generate Draft Note"** button.
   - Observe the animated progress bar as it structures the inputs into SOAP format.
   - Review the document preview with the `AI-Assisted Draft • Clinical Review Required` banner.

6. **Edit, Copy, and Finalize:**
   - Click **"Edit Note"** to make live adjustments in the document textarea.
   - Click **"Copy"** or **"Save Draft"**.
   - Click **"Finalize Note"**; review the confirmation modal ("Confirm Clinical Finalization"), and confirm.
   - The note is now stamped as `Finalized` and signed by Dr. Sarah Morgan.

7. **Persistence Verification:**
   - Refresh the browser (`F5`).
   - All newly created patients, consultations, and finalized notes persist cleanly in local storage.

8. **Settings & Reset:**
   - Navigate to `/settings`.
   - Edit the doctor's name or clinic name to demonstrate personalization.
   - Scroll down and click **"Reset Demo Dataset"** to return to the original seed state.

---

## 🔒 Demo Safety & Privacy Notice

Clinote AI is a commercial concept prototype created for software demonstration. It does not use or store real protected health information (PHI) and does not replace professional clinical judgment. It does not connect to external third-party AI APIs during this demonstration, ensuring total zero-cost portability and privacy.
