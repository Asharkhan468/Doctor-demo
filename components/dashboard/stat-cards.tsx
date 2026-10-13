'use client';

import React from 'react';
import Link from 'next/link';
import { useClinote } from '@/lib/context';
import { Calendar, Users, FileEdit, CheckCircle2, ArrowUpRight } from 'lucide-react';

export function StatCards() {
  const { consultations, patients, clinicalNotes } = useClinote();

  // Calculate live stats
  // For demo realism: consultations for today or scheduled
  const todayConsultations = consultations.filter((c) => c.date === '2026-10-13');
  const totalPatients = patients.length;
  const draftNotes = clinicalNotes.filter((n) => n.status === 'Draft' || n.status === 'Reviewed');
  const completedConsultations = consultations.filter((c) => c.status === 'Completed');

  const stats = [
    {
      title: "Today's Consultations",
      value: todayConsultations.length || 6,
      subtext: `${consultations.filter((c) => c.status === 'Scheduled').length} scheduled upcoming`,
      icon: Calendar,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-100',
      href: '/consultations',
      linkText: 'View schedule',
    },
    {
      title: 'Total Patients',
      value: totalPatients,
      subtext: 'Active clinical records',
      icon: Users,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-100',
      href: '/patients',
      linkText: 'Manage patients',
    },
    {
      title: 'Draft Clinical Notes',
      value: draftNotes.length,
      subtext: `${draftNotes.filter((n) => n.status === 'Draft').length} awaiting physician review`,
      icon: FileEdit,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      href: '/notes?status=Draft',
      linkText: 'Review drafts',
      highlight: draftNotes.length > 0,
    },
    {
      title: 'Completed Encounters',
      value: completedConsultations.length,
      subtext: 'Documented & finalized',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      href: '/consultations?status=Completed',
      linkText: 'Audit encounters',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`rounded-xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
              stat.highlight ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg border ${stat.iconColor}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</span>
              {stat.highlight && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Action required
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href={stat.href}
                className="font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 group"
              >
                <span>{stat.linkText}</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
