import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../api/client';

export default function KnowledgeBasePage() {
  const [conditions, setConditions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchKB = async () => {
      setLoading(true);
      try {
        const data = await api.getKnowledgeBase(selectedCategory, searchQuery);
        setConditions(data.conditions || []);
        if (data.categories && categories.length === 0) {
          setCategories(['All', ...data.categories]);
        }
      } catch (err) {
        console.error('Error fetching knowledge base:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchKB();
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (name) => {
    setExpandedId((prev) => (prev === name ? null : name));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Medical Knowledge Base
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore the 20 structured condition patterns and canonical symptom ontologies
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Knowledge Base Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2 font-medium">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>Verified clinical knowledge catalog — structured diagnostic patterns and canonical symptom ontologies.</span>
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conditions, symptoms, or clinical descriptions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Category:
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((cond) => {
          const isExpanded = expandedId === cond.name;
          return (
            <div
              key={cond.name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {cond.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {cond.category}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {cond.description}
                </p>

                {/* Canonical Symptoms */}
                <div className="space-y-1 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Associated Symptom Pattern:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cond.symptoms.map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setSearchQuery(sym)}
                        className="px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900 text-cyan-800 dark:text-cyan-300 text-xs font-medium capitalize border border-cyan-100 dark:border-cyan-900/40 transition-colors"
                        title={`Filter all conditions with symptom: ${sym}`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expandable Precautions & Consultation */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleExpand(cond.name)}
                  className="w-full text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 flex items-center justify-between py-1 focus:outline-none"
                >
                  <span>{isExpanded ? 'Hide clinical pattern advice' : 'View precautions & consultation guidance'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 text-xs pt-2 animate-in fade-in duration-200">
                    {cond.precautions && (
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                          Supportive Care:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 pl-1">
                          {cond.precautions.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cond.when_to_consult && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300">
                        <span className="font-semibold block mb-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Consultation Triggers:
                        </span>
                        <p>{cond.when_to_consult}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {conditions.length === 0 && !loading && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No condition patterns matched.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching different terms.</p>
        </div>
      )}
    </div>
  );
}
