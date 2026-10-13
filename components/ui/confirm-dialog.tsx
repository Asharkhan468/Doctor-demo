'use client';

import React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'teal';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${
            isDanger ? 'bg-rose-100 text-rose-600' : 'bg-teal-100 text-teal-700'
          }`}
        >
          {isDanger ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-slate-900">{title}</h4>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={isDanger ? 'danger' : 'primary'}
          size="sm"
          onClick={() => {
            onConfirm();
          }}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
