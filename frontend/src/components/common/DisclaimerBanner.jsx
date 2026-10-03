import React from 'react';
import { Info } from 'lucide-react';

export default function DisclaimerBanner({ text }) {
  const content = text || (
    "This tool provides preliminary informational guidance based on a predefined knowledge base. " +
    "It does not provide a medical diagnosis and cannot replace a qualified healthcare professional."
  );

  return (
    <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold block mb-0.5">Academic Prototype Disclaimer:</span>
        <p className="leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
