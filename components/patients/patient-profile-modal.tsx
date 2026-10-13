'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Patient } from '@/lib/types';
import { useClinote } from '@/lib/context';
import { calculateAge, formatDate, formatTime } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Pill,
  History,
  FileText,
  Stethoscope,
  Plus,
  Edit,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface PatientProfileModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
}

export function PatientProfileModal({
  patient,
  isOpen,
  onClose,
  onEdit,
}: PatientProfileModalProps) {
  const router = useRouter();
  const { consultations, clinicalNotes } = useClinote();
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'notes'>('overview');

  if (!patient || !isOpen) return null;

  const age = calculateAge(patient.dateOfBirth);
  const patientConsultations = consultations.filter((c) => c.patientId === patient.id);
  const patientNotes = clinicalNotes.filter((n) => n.patientId === patient.id);

  const handleStartConsultation = () => {
    onClose();
    router.push(`/consultations/new?patientId=${patient.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* Patient Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-teal-600/20">
            {patient.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {patient.id}
              </span>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{patient.gender}</span>
              <span>•</span>
              <span>DOB: {formatDate(patient.dateOfBirth)} ({age} years old)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(patient);
            }}
          >
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit Profile
          </Button>
          <Button size="sm" onClick={handleStartConsultation}>
            <Stethoscope className="h-3.5 w-3.5 mr-1" />
            Start Consultation
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pt-3 pb-0 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 px-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clinical Overview
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'consultations'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Consultations</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
            {patientConsultations.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Clinical Notes</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
            {patientNotes.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="pt-5 space-y-5">
          {/* Critical Allergy Warning Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              patient.allergies.length > 0 && !patient.allergies.includes('No Known Drug Allergies (NKDA)')
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Allergy Status & Drug Sensitivities
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {patient.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      allergy.includes('NKDA')
                        ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900'
                        : 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                    }`}
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical History */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <History className="h-4 w-4 text-teal-600" />
                Chronic Conditions & Medical History
              </h4>
              {patient.medicalHistory.length === 0 ? (
                <p className="text-xs text-slate-400">None reported</p>
              ) : (
                <ul className="space-y-1.5">
                  {patient.medicalHistory.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Current Medications */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Pill className="h-4 w-4 text-teal-600" />
                Current Prescribed Medications
              </h4>
              {patient.medications.length === 0 ? (
                <p className="text-xs text-slate-400">No active medications recorded</p>
              ) : (
                <ul className="space-y-1.5">
                  {patient.medications.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-800 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Contact Details & Additional Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Contact Information
              </h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{patient.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{patient.contact.email}</span>
                </div>
                {patient.contact.emergencyContact && (
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">Emergency:</span>
                    <span>{patient.contact.emergencyContact}</span>
                  </div>
                )}
                {patient.contact.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{patient.contact.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Clinical Observations & Notes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {patient.additionalNotes || 'No additional notes logged.'}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Registered: {formatDate(patient.createdAt)}</span>
                {patient.lastVisit && <span>Last Encounter: {formatDate(patient.lastVisit)}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Consultations History */}
      {activeTab === 'consultations' && (
        <div className="pt-4 space-y-3">
          {patientConsultations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No consultations recorded yet for this patient.
            </div>
          ) : (
            patientConsultations.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{c.type}</span>
                    <span className="text-xs text-slate-400 font-mono">{c.id}</span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{c.chiefComplaint}</p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(c.date)}</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(c.time)}</span>
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href={`/consultations/new?consultationId=${c.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Open Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Clinical Notes */}
      {activeTab === 'notes' && (
        <div className="pt-4 space-y-3">
          {patientNotes.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No clinical notes recorded yet for this patient.
            </div>
          ) : (
            patientNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{note.title}</span>
                    <span className="text-xs text-slate-400 font-mono">{note.id}</span>
                    <StatusBadge status={note.status} />
                  </div>
                  <Link href={`/notes?selected=${note.id}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      View Note
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Provider: {note.doctorName} • Created {formatDate(note.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Clinote AI Synthetic Electronic Medical Record</span>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
