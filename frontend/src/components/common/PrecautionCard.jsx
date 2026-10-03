import React from 'react';
import { CheckCircle2, ShieldAlert, Heart } from 'lucide-react';

export default function PrecautionCard({ precautions = [], consultationAdvice = '' }) {
  if (!precautions || precautions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100">
        <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-xs font-bold uppercase tracking-wide">
          4. Recommended Supportive Next Steps
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {precautions.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {consultationAdvice && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Professional Medical Consultation Advice:</span>
            <span>{consultationAdvice}</span>
          </div>
        </div>
      )}
    </div>
  );
}
