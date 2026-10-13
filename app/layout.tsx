import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Clinote AI — Commercial Doctor Consultation Assistant SaaS',
  description: 'AI-assisted clinical consultation notes and patient workflow management prototype for doctors. Less paperwork. More focus on patient care.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
