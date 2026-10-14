# Clinote AI — Commercial Doctor Consultation Assistant SaaS Prototype

> **Tagline:** Less paperwork. More focus on patient care.

Clinote AI is a commercial healthcare SaaS prototype designed for physicians to manage patient encounters, structure daily consultation schedules, generate AI-assisted clinical notes (SOAP format), and review patient records from an intuitive, single dashboard.

Clinote AI is a functional workflow demonstration: it records or accepts consultation audio, sends it to a server-side speech-to-text provider, and generates editable SOAP drafts from the clinician-reviewed transcript. Consultation records in this prototype are stored in the current browser only; this is not a secure or multi-user medical records system.

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
- **Step 2: Actual Audio Capture:** Record from the browser microphone, pause/resume, stop and play the recording, or upload an audio file (4 MB maximum to fit Vercel's function request limit).
- **Step 3: Real Speech-to-Text:** Audio is sent to the server-side OpenAI transcription endpoint. The returned transcript can be corrected before note generation; missing API credentials or provider failures are shown as errors, never simulated as success.
- **Step 4: AI-Assisted SOAP Draft:** OpenAI generates four separate editable sections from the reviewed transcript. The prompt requires preservation of details and negations and marks absent information `Not documented`; output still requires clinician verification.
- **Step 5: Review, Save & Approve:** Save a draft, reopen it from consultation history, edit individual SOAP sections, mark reviewed, or explicitly approve after confirmation. Saving edits to an approved note returns it to draft status and requires reapproval.

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
- **Persistence:** Existing browser `localStorage` store with cross-tab updates (demonstration only; not secure shared storage)
- **AI endpoints:** Next.js Route Handlers keep the OpenAI API key server-side and validate audio size/type and SOAP response structure
- **Authentication/database:** Not implemented; there is no doctor account, server-side ownership enforcement, or production database

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.9+
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

### Configure the AI providers

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to an OpenAI API key with access to audio transcription and Responses API models. Keep this key server-side; do not prefix it with `NEXT_PUBLIC_`.
3. The defaults are `gpt-transcribe` for speech transcription and `gpt-4o-mini` for structured SOAP generation. Override them with `OPENAI_TRANSCRIPTION_MODEL` or `OPENAI_NOTES_MODEL` only if your account supports a different model.
4. Restart the development server and visit `/consultations/new`. Record or upload fictional consultation audio, transcribe it, review/correct the returned text, generate and edit each SOAP section, then save and approve the note.

Without `OPENAI_API_KEY`, the consultation workflow remains accessible, but transcription and SOAP endpoints return an explicit configuration error. No successful AI output is simulated. OpenAI processes the audio/transcript under the account's API terms; use synthetic data for this demo.

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
   - Notice the optional clinical intake fields populate with fictional example data. They do not fabricate a transcript or AI result.

5. **Record and transcribe audio:**
   - Use **Start Recording** and allow microphone access, then pause/resume and stop; alternatively upload a supported audio file.
   - Play the captured audio, choose **Transcribe Audio**, then correct the actual returned transcript.
   - Click **Generate Draft Note** to send that reviewed transcript to the SOAP endpoint.

6. **Review and approve:**
   - Edit each of the four SOAP sections and click **Save Draft**.
   - Mark the note reviewed or click **Finalize Note**, inspect the confirmation, and explicitly approve.
   - Reopen the consultation from **Consultations**. Later edits to an approved note reset it to draft.

7. **Persistence Verification:**
   - Refresh the browser (`F5`).
   - All newly created patients, consultations, and finalized notes persist cleanly in local storage.

8. **Settings & Reset:**
   - Navigate to `/settings`.
   - Edit the doctor's name or clinic name to demonstrate personalization.
   - Scroll down and click **"Reset Demo Dataset"** to return to the original seed state.

---

## Deployment, security, and limitations

Deploy using the existing Next.js/Vercel project configuration; no custom `vercel.json` or database migration is present. Add `OPENAI_API_KEY` (and optional model overrides) under the Vercel project's server-side Environment Variables for each deployment environment, then redeploy. Never expose the key to the browser. Audio uploads are capped at 4 MB because Vercel Functions currently limit request and response payloads to 4.5 MB; keep this demo on a protected deployment because it has no account authentication or per-doctor usage controls.

This demo has **no registration/login, server-side consultation persistence, doctor ownership checks, or secure multi-doctor data isolation**. Notes and transcripts are stored in browser `localStorage`, which is neither encrypted medical storage nor shared across doctors/devices. Audio is held in browser memory and sent to OpenAI only when transcription is requested. Use fictional patients and synthetic audio only. This application has not undergone a HIPAA assessment and is not represented as HIPAA-compliant or production-ready. A commercial deployment requires a vetted identity system, database and access-control design, audit/security review, retention controls, and applicable contractual/compliance work.
