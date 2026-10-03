import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, HelpCircle, ShieldCheck, Sparkles, PlayCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between px-4 sm:px-6 h-15">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Medical Symptom Checker</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Intelligent conversational symptom assistant & clinical triage.
            </p>
          </div>
        </div>

        {/* Right: Demo Button + Theme Toggle + Help + Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Interactive Demo Link */}
          <Link
            to="/demo"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all border border-blue-200 dark:border-blue-800/80 shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Demo</span>
          </Link>

          {/* Quick Help Dialog Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="About MedNLP"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Professional User Profile */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">MedNLP AI</p>
              <p className="text-[10px] text-emerald-500 font-medium leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">About MedNLP Assistant</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              MedNLP is an intelligent, privacy-first conversational health assistant engineered with state-of-the-art NLP, clinical negation parsing, and deterministic condition triage.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-700 dark:text-slate-200">Core Capabilities:</p>
              <p>• Natural language speech & text recognition</p>
              <p>• spaCy lemmatization & grammatical tokenization</p>
              <p>• NegEx clinical negation scope analysis (e.g. "no fever")</p>
              <p>• RapidFuzz typo & phonetic variant tolerance</p>
              <p>• Red-flag emergency detection & instant triage guidance</p>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <Link
                to="/demo"
                onClick={() => setShowHelpModal(false)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Open Interactive Demo & Guide</span>
              </Link>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
