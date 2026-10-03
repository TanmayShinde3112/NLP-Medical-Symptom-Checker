import React from 'react';

export default function StatCard({ title, value, unit = '', icon: Icon, changeText }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs text-slate-500 font-normal">{unit}</span>}
        </div>
        {changeText && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {changeText}
          </p>
        )}
      </div>
    </div>
  );
}
