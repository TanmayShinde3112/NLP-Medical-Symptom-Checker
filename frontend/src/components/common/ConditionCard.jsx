import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ConditionCard({ condition, rank = 1 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      {/* Header: Rank + Condition Name + Match Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
              #{rank}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {condition.name}
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {condition.category}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {condition.description}
          </p>
        </div>

        {/* Match Score Badge */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Symptom Match: {condition.match_score}%
          </span>
        </div>
      </div>

      {/* Match Bar */}
      <div className="py-2.5">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
          <span>{condition.explanation}</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{condition.match_score}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(5, condition.match_score))}%` }}
          />
        </div>
      </div>

      {/* Matched Symptoms Tags */}
      <div className="py-1 space-y-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Matching Pattern Symptoms:
        </span>
        <div className="flex flex-wrap gap-1">
          {condition.matched_symptoms.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span className="capitalize">{s}</span>
            </span>
          ))}
          {condition.all_condition_symptoms
            .filter((s) => !condition.matched_symptoms.includes(s))
            .map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded bg-slate-50 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 border border-slate-200 dark:border-slate-800"
                title="Condition symptom not reported in current input"
              >
                <span className="capitalize">{s}</span>
              </span>
            ))}
        </div>
      </div>

      {/* Expand/Collapse for Precautions & Medical Advice */}
      <div className="pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {expanded ? (
            <>
              <span>Hide precautions & consultation guidance</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>View precautions & consultation guidance</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
            {condition.precautions && condition.precautions.length > 0 && (
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Supportive Care Precautions:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300 pl-1">
                  {condition.precautions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {condition.when_to_consult && (
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 space-y-0.5">
                <span className="font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  When to Consult a Healthcare Professional:
                </span>
                <p>{condition.when_to_consult}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 italic">
        * Match score represents similarity to this prototype's knowledge base pattern, NOT medical probability or diagnosis.
      </p>
    </div>
  );
}
