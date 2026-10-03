import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>
            MedNLP provides preliminary conversational symptom intelligence and triage guidance. Always consult a qualified physician for clinical diagnoses. In an emergency, dial 911 / 112 immediately.
          </span>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
          MedNLP • Personal AI Project
        </div>
      </div>
    </footer>
  );
}
