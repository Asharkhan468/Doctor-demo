'use client';

import React, { useState } from 'react';
import { useClinote } from '@/lib/context';
import { UserSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  User,
  Building2,
  FileText,
  Sliders,
  RotateCcw,
  ShieldAlert,
  Save,
  CheckCircle2,
  Sparkles,
  Info,
  Lock,
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, editSettings, resetAllData, showToast } = useClinote();

  const [doctorName, setDoctorName] = useState(settings.doctor.name);
  const [specialty, setSpecialty] = useState(settings.doctor.specialty);
  const [clinicName, setClinicName] = useState(settings.doctor.clinicName);
  const [email, setEmail] = useState(settings.doctor.email);
  const [phone, setPhone] = useState(settings.doctor.phone);
  const [licenseNumber, setLicenseNumber] = useState(settings.doctor.licenseNumber);

  const [noteFormat, setNoteFormat] = useState(settings.noteFormat);
  const [density, setDensity] = useState(settings.density);
  const [defaultFollowUpDays, setDefaultFollowUpDays] = useState(settings.defaultFollowUpDays);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(settings.autoSaveDrafts);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      doctor: {
        id: settings.doctor.id,
        name: doctorName.trim(),
        specialty: specialty.trim(),
        clinicName: clinicName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        licenseNumber: licenseNumber.trim(),
      },
      noteFormat,
      density,
      defaultFollowUpDays: Number(defaultFollowUpDays) || 14,
      autoSaveDrafts,
    };
    editSettings(updated);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
    // Refresh local form states
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Application Settings & Profile</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure physician credentials, documentation preferences, and demonstration datasets.
          </p>
        </div>
      </div>

      {/* Prototype & Compliance Safety Notice */}
      <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 text-xs text-teal-950 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-teal-700 shrink-0" />
          <h4 className="font-bold text-sm text-teal-900">
            Commercial SaaS Concept Demonstration Notice
          </h4>
        </div>
        <p className="leading-relaxed text-teal-900/90">
          This web application is an interactive product prototype designed for client demonstration purposes on Fiverr.
          It operates using browser-side storage and synthetic records.
          It is <strong>not</strong> configured for production healthcare environments, does not collect or transmit real protected health information (PHI), and does not claim HIPAA or GDPR compliance in this prototype phase.
        </p>
        <p className="text-[11px] text-teal-800">
          Ready for architecture handover: backend microservices, PostgreSQL/Supabase, and HIPAA-compliant LLM inference can be connected seamlessly.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Doctor Profile Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Physician Profile & Credentials</h3>
              <p className="text-xs text-slate-500">
                These credentials appear on clinical notes and electronic signature audit stamps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Doctor Full Name & Title"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />

            <Input
              label="Medical Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Clinic / Practice Name"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />

            <Input
              label="State License / NPI #"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Professional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Clinic Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Documentation Preferences */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Documentation & Note Preferences</h3>
              <p className="text-xs text-slate-500">Configure how Clinote structures clinical output.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Clinical Note Formatting Structure"
              value={noteFormat}
              onChange={(e) => setNoteFormat(e.target.value as UserSettings['noteFormat'])}
            >
              <option value="soap">SOAP Format (Subjective, Objective, Assessment, Plan)</option>
              <option value="problem_oriented">Problem-Oriented Medical Record (POMR)</option>
              <option value="narrative">Clinical Narrative Chronology</option>
            </Select>

            <Select
              label="Interface Density"
              value={density}
              onChange={(e) => setDensity(e.target.value as UserSettings['density'])}
            >
              <option value="comfortable">Comfortable (Optimal for Laptops & Desktops)</option>
              <option value="compact">Compact (High Information Density)</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Default Routine Follow-up Reminder (Days)"
              type="number"
              value={defaultFollowUpDays}
              onChange={(e) => setDefaultFollowUpDays(Number(e.target.value))}
            />

            <div className="pt-5">
              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveDrafts}
                  onChange={(e) => setAutoSaveDrafts(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span>Automatically sync consultation drafts to local storage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Settings CTA */}
        <div className="flex items-center justify-end">
          <Button type="submit" size="md" className="gap-2 font-bold shadow-sm">
            <Save className="h-4 w-4" />
            Save Profile & Preferences
          </Button>
        </div>
      </form>

      {/* Demo Dataset Reset Section */}
      <div className="bg-white p-6 rounded-xl border border-rose-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Demo Data</h3>
              <p className="text-xs text-slate-500">
                Restore the demo back to the factory seed of 8 synthetic patients, consultations, and clinical notes.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            className="text-xs font-semibold"
          >
            Reset Demo Dataset
          </Button>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Dataset?"
        description="This will clear any newly added test patients, custom consultations, or modified notes and restore the original 8 synthetic patient cases. This cannot be undone."
        confirmText="Yes, Reset Everything"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
