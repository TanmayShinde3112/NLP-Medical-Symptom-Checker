import React, { useState, useEffect } from 'react';
import { Cpu, Search, Activity, Stethoscope } from 'lucide-react';

const STEPS = [
  { text: 'Preprocessing and normalizing text...', icon: Cpu },
  { text: 'Tokenizing and lemmatizing with spaCy...', icon: Activity },
  { text: 'Extracting symptoms and checking synonyms...', icon: Search },
  { text: 'Matching against medical knowledge base...', icon: Stethoscope }
];

export default function ProcessingIndicator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = STEPS[currentStepIndex].icon;

  return (
    <div className="flex items-start space-x-2.5 max-w-md animate-in fade-in duration-150">
      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
        <Stethoscope className="w-4 h-4" />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl rounded-tl-xs p-3.5 shadow-xs space-y-2">
        <div className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 text-xs font-medium">
          <CurrentIcon className="w-3.5 h-3.5 animate-spin" />
          <span>Processing Symptoms</span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-200">
          {STEPS[currentStepIndex].text}
        </p>

        {/* Simple dots */}
        <div className="flex space-x-1 pt-0.5">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-200 ${
                idx <= currentStepIndex
                  ? 'w-4 bg-blue-600'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
