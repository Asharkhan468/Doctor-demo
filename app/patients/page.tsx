'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClinote } from '@/lib/context';
import { Patient, PatientStatus } from '@/lib/types';
import { calculateAge, formatDate } from '@/lib/utils';
import { PatientProfileModal } from '@/components/patients/patient-profile-modal';
import { PatientFormModal } from '@/components/patients/patient-form-modal';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import {
  Users,
  Search,
  Plus,
  Filter,
  User,
  Stethoscope,
  MoreVertical,
  Edit,
  Phone,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

function PatientsContent() {
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get('selected');
  const { patients, createPatient, editPatient } = useClinote();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PatientStatus>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auto-open selected patient if query param passed from Global Search
  useEffect(() => {
    if (selectedParam) {
      const match = patients.find((p) => p.id === selectedParam);
      if (match) {
        setSelectedPatient(match);
        setIsProfileModalOpen(true);
      }
    }
  }, [selectedParam, patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        patient.medicalHistory.some((m) => m.toLowerCase().includes(q)) ||
        patient.allergies.some((a) => a.toLowerCase().includes(q));

      return matchesStatus && matchesQuery;
    });
  }, [patients, searchQuery, statusFilter]);

  const handleOpenProfile = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsProfileModalOpen(true);
  };

  const handleOpenEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setPatientToEdit(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Patient Directory</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {patients.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search, manage demographics, and review clinical histories for all active clinic patients.
          </p>
        </div>

        <Button size="sm" onClick={handleOpenAdd} className="gap-1.5 font-semibold">
          <Plus className="h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, patient ID, condition, or allergy..."
            className="w-full pl-9 pr-4 py-2 text-xs text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Status:
          </span>
          {(['All', 'Active', 'New', 'Inactive'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Data Table */}
      <div className="rounded-xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">No patients found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No matching records found for &ldquo;{searchQuery}&rdquo;. Try adjusting your search query or status filter.
            </p>
            <Button variant="outline" size="sm" className="mt-4 text-xs" onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 pl-5">Patient Name & ID</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Allergies</th>
                  <th className="py-3 px-4">Chronic History</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPatients.map((patient) => {
                  const age = calculateAge(patient.dateOfBirth);
                  const hasSevereAllergy =
                    patient.allergies.length > 0 &&
                    !patient.allergies.includes('No Known Drug Allergies (NKDA)');

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handleOpenProfile(patient)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4 pl-5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            {patient.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {patient.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">{patient.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <p>{age} yrs • {patient.gender}</p>
                        <p className="text-[11px] text-slate-400">DOB: {formatDate(patient.dateOfBirth)}</p>
                      </td>

                      {/* Allergies with high-visibility badge */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {hasSevereAllergy ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              <ShieldAlert className="h-3 w-3" />
                              {patient.allergies[0]}
                              {patient.allergies.length > 1 && ` (+${patient.allergies.length - 1})`}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              NKDA
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Chronic History */}
                      <td className="py-3.5 px-4 max-w-xs text-slate-600">
                        <p className="truncate line-clamp-1">
                          {patient.medicalHistory.join(', ') || 'None reported'}
                        </p>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{patient.contact.phone}</span>
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={patient.status} />
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 pr-5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2.5 font-medium"
                            onClick={() => handleOpenProfile(patient)}
                          >
                            View Record
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700"
                            onClick={() => handleOpenEdit(patient)}
                            title="Edit Patient"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPatients.length} of {patients.length} patient records</span>
          <span className="text-[11px] text-slate-400">Click any patient row to open clinical history</span>
        </div>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        patient={selectedPatient}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onEdit={(p) => {
          setIsProfileModalOpen(false);
          handleOpenEdit(p);
        }}
      />

      {/* Patient Add / Edit Form Modal */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        patientToEdit={patientToEdit}
        onSave={(saved) => {
          if (patientToEdit) {
            editPatient(saved);
          } else {
            createPatient(saved);
          }
        }}
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading patients directory...
        </div>
      }
    >
      <PatientsContent />
    </React.Suspense>
  );
}
