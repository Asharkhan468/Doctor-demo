'use client';

import React from 'react';
import { useClinote } from '@/lib/context';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useClinote();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-3.5 shadow-lg shadow-slate-900/5 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200"
            style={{
              borderColor: isSuccess
                ? '#a7f3d0'
                : isError
                ? '#fecdd3'
                : isWarning
                ? '#fde68a'
                : '#bae6fd',
            }}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              {isError && <AlertCircle className="h-5 w-5 text-rose-600" />}
              {isWarning && <AlertTriangle className="h-5 w-5 text-amber-600" />}
              {isInfo && <Info className="h-5 w-5 text-sky-600" />}
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-xs font-semibold text-slate-900">{toast.title}</p>
              )}
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
