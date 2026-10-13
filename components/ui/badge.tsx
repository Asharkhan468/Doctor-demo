import React from 'react';
import { cn } from '@/lib/utils';
import { ConsultationStatus, NoteStatus, PatientStatus } from '@/lib/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline'
    | 'teal';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'default', size = 'md', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide transition-colors';

  const variants = {
    default: 'bg-slate-100 text-slate-800 border border-slate-200/80',
    primary: 'bg-teal-50 text-teal-800 border border-teal-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    info: 'bg-sky-50 text-sky-800 border border-sky-200',
    outline: 'border border-slate-300 text-slate-700 bg-white',
    teal: 'bg-teal-600 text-white border border-teal-600',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 leading-tight',
    md: 'text-xs px-2.5 py-0.5 leading-normal',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ConsultationStatus | NoteStatus | PatientStatus | string }) {
  switch (status) {
    case 'Scheduled':
      return <Badge variant="info">Scheduled</Badge>;
    case 'In Progress':
      return <Badge variant="warning">In Progress</Badge>;
    case 'Completed':
      return <Badge variant="success">Completed</Badge>;
    case 'Draft':
      return (
        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50/50">
          Draft
        </Badge>
      );
    case 'Reviewed':
      return <Badge variant="primary">Reviewed</Badge>;
    case 'Finalized':
      return <Badge variant="success">Finalized</Badge>;
    case 'Active':
      return <Badge variant="success">Active</Badge>;
    case 'Inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'New':
      return <Badge variant="info">New Patient</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}
