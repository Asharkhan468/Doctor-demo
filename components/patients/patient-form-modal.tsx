'use client';

import React, { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, User, ShieldAlert } from 'lucide-react';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patientToEdit?: Patient | null;
}

export function PatientFormModal({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
}: PatientFormModalProps) {
  const isEditing = !!patientToEdit;

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '1985-05-15',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    emergencyContact: '',
    address: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    additionalNotes: '',
    status: 'Active' as Patient['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        dateOfBirth: patientToEdit.dateOfBirth,
        gender: patientToEdit.gender,
        phone: patientToEdit.contact.phone,
        email: patientToEdit.contact.email,
        emergencyContact: patientToEdit.contact.emergencyContact || '',
        address: patientToEdit.contact.address || '',
        medicalHistory: patientToEdit.medicalHistory.join(', '),
        allergies: patientToEdit.allergies.join(', '),
        medications: patientToEdit.medications.join(', '),
        additionalNotes: patientToEdit.additionalNotes || '',
        status: patientToEdit.status,
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        dateOfBirth: '1988-06-20',
        gender: 'Female',
        phone: '+1 (555) 789-0123',
        email: '',
        emergencyContact: '',
        address: '',
        medicalHistory: '',
        allergies: 'No Known Drug Allergies (NKDA)',
        medications: '',
        additionalNotes: '',
        status: 'Active',
      });
      setErrors({});
    }
  }, [patientToEdit, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Patient full name is required';
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.phone.trim()) errs.phone = 'Contact phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const savedPatient: Patient = {
      id: patientToEdit?.id || generateId('PAT'),
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      contact: {
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example-med.com`,
        emergencyContact: formData.emergencyContact.trim() || undefined,
        address: formData.address.trim() || undefined,
      },
      medicalHistory: parseList(formData.medicalHistory),
      allergies: parseList(formData.allergies),
      medications: parseList(formData.medications),
      additionalNotes: formData.additionalNotes.trim() || undefined,
      status: formData.status,
      createdAt: patientToEdit?.createdAt || new Date().toISOString(),
      lastVisit: patientToEdit?.lastVisit,
    };

    onSave(savedPatient);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Patient — ${patientToEdit.name}` : 'Register New Demo Patient'}
      description="Enter fictional patient demographics and clinical history for testing."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Full Patient Name"
            placeholder="e.g. Eleanor Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            error={errors.dateOfBirth}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })
            }
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </Select>

          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
          />

          <Input
            label="Email Address"
            placeholder="patient@example-med.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Emergency Contact"
            placeholder="e.g. Spouse - +1 (555) 123-4567"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
          />

          <Input
            label="Residential Address"
            placeholder="City, State"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* Clinical History & Safety Alerts */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Medical History & Allergies (Separate with commas)
          </p>

          <div className="space-y-3">
            <Input
              label="Known Drug / Food Allergies"
              placeholder="e.g. Penicillin (Hives), Sulfa (Rash)"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              helperText="Critical for patient safety. Enter 'NKDA' if no known allergies."
            />

            <Input
              label="Chronic Medical Conditions"
              placeholder="e.g. Essential Hypertension, Type 2 Diabetes, Asthma"
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            />

            <Input
              label="Current Active Medications"
              placeholder="e.g. Lisinopril 10mg daily, Metformin 500mg BID"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
            />

            <Textarea
              label="Additional Provider Notes"
              placeholder="Clinical baseline observations, dietary habits, or past surgeries..."
              rows={2}
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isEditing ? `ID: ${patientToEdit.id}` : 'Auto-generates synthetic ID'}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {isEditing ? 'Save Changes' : 'Create Patient'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
