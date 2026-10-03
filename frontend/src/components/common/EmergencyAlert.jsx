import React from 'react';
import { AlertOctagon, PhoneCall, Hospital } from 'lucide-react';

export default function EmergencyAlert({ reasons = [] }) {
  return (
    <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-900 p-4 sm:p-5 text-red-900 dark:text-red-100 shadow-xs space-y-3">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-red-600 text-white flex-shrink-0 mt-0.5">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-lg font-bold text-red-700 dark:text-red-400">
            Seek Urgent Medical Attention Immediately
          </h3>
          <p className="text-xs sm:text-sm text-red-800 dark:text-red-200">
            Some symptoms you entered may require urgent physical medical evaluation.
          </p>
        </div>
      </div>

      {reasons && reasons.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-red-200 dark:border-red-900/60 text-xs space-y-1">
          <span className="font-semibold text-red-700 dark:text-red-400 block">
            Critical Red Flags Detected:
          </span>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {reasons.map((r, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-semibold text-[11px] capitalize border border-red-200 dark:border-red-800"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-0.5 text-xs">
        <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-red-600 text-white font-medium flex-1 justify-center">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Emergency Services (911 / 112)</span>
        </div>
        <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 font-medium flex-1 justify-center">
          <Hospital className="w-3.5 h-3.5" />
          <span>Visit Hospital Emergency Room</span>
        </div>
      </div>

      <p className="text-[11px] text-red-600 dark:text-red-400">
        * MedNLP is an academic prototype and does NOT diagnose emergencies. Do not delay seeking emergency physical medical care.
      </p>
    </div>
  );
}
