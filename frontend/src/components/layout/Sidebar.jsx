import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlayCircle,
  Stethoscope,
  Cpu,
  History,
  BookOpen,
  Info,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, apiConnected = true }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Demo & Guide', path: '/demo', icon: PlayCircle },
    { name: 'Symptom Checker', path: '/checker', icon: Stethoscope },
    { name: 'NLP Analysis', path: '/nlp-analysis', icon: Cpu },
    { name: 'Health History', path: '/history', icon: History },
    { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  MedNLP
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Symptom Checker
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live Engine Status & Academic Credit */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <div className="text-left">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] leading-tight">
                  {apiConnected ? 'NLP Engine Online' : 'Engine Offline'}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {apiConnected ? 'spaCy 3.8 + RapidFuzz' : 'FastAPI disconnected'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700">
              :8000
            </span>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium">
            MedNLP AI • Personal Project
          </div>
        </div>
      </aside>
    </>
  );
}
