'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, FileText, UserPlus, X } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'note' | 'patient' | 'schedule';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: "Dr. Morgan: Draft clinical note for Sophia Rodriguez is ready for review.",
    time: '15m ago',
    read: false,
    type: 'note',
  },
  {
    id: 'notif-2',
    title: 'New patient record created: Robert Taylor (PAT-1088).',
    time: '2h ago',
    read: false,
    type: 'patient',
  },
  {
    id: 'notif-3',
    title: 'Consultation note for Eleanor Vance (CON-501) finalized & signed.',
    time: '3h ago',
    read: true,
    type: 'note',
  },
  {
    id: 'notif-4',
    title: 'Reminder: Scheduled Telehealth check-in with David Kim at 3:15 PM.',
    time: '4h ago',
    read: true,
    type: 'schedule',
  },
];

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-medium text-teal-700 hover:text-teal-900 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markRead(item.id)}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !item.read ? 'bg-teal-50/20' : ''
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {item.type === 'note' && (
                    <div className="h-7 w-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'patient' && (
                    <div className="h-7 w-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                      <UserPlus className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'schedule' && (
                    <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${!item.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                </div>
                {!item.read && (
                  <span className="h-2 w-2 rounded-full bg-teal-600 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 text-center">
            <span className="text-[11px] text-slate-400">Clinote AI Simulation Center</span>
          </div>
        </div>
      )}
    </div>
  );
}
