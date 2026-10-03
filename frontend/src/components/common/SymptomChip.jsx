import React from 'react';
import { Check } from 'lucide-react';

export default function SymptomChip({ name, method = 'exact', confidence = 1.0, onClick }) {
  const methodBadge = () => {
    if (method === 'synonym') {
      return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium" title="Normalized from synonym phrase">
          synonym
        </span>
      );
    }
    if (method === 'fuzzy') {
      return (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-medium" title={`Fuzzy match (${Math.round(confidence * 100)}%)`}>
          fuzzy {Math.round(confidence * 100)}%
        </span>
      );
    }
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
        exact
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800/60 text-xs font-medium"
    >
      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
      <span className="capitalize">{name}</span>
      {methodBadge()}
    </div>
  );
}
