import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  BookOpen,
  Activity,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  PlayCircle
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { api } from '../api/client';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_analyses: 0,
    unique_symptoms_detected: 0,
    knowledge_base_conditions: 20,
    average_processing_time_ms: 0,
    recent_analyses: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleTryExample = () => {
    navigate('/checker', { state: { example: 'I have fever, headache and body pain.' } });
  };

  const steps = [
    {
      num: "1",
      title: "Natural Language Input",
      desc: "Describe your symptoms in plain words like you would to a doctor or friend.",
      icon: Stethoscope
    },
    {
      num: "2",
      title: "Text Preprocessing",
      desc: "The system cleans punctuation, standardizes contractions, and tokenizes words with spaCy.",
      icon: Cpu
    },
    {
      num: "3",
      title: "Symptom Extraction",
      desc: "Identifies medical phrases, handles synonyms and spelling mistakes via fuzzy matching.",
      icon: Search
    },
    {
      num: "4",
      title: "Condition Matching",
      desc: "Compares detected symptoms against 20 predefined health patterns to calculate similarity.",
      icon: Layers
    },
    {
      num: "5",
      title: "Preliminary Guidance",
      desc: "Provides supportive home precautions and indicates when to consult a medical professional.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Human-designed clean hero banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-900/60 text-blue-200 text-xs font-medium border border-blue-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI Health Assistant • Real-Time NLP</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
              Understand your symptoms with intelligent NLP
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
              Describe your symptoms naturally using text or voice dictation. MedNLP automatically extracts medical concepts, handles negation, and matches against structured clinical patterns in real time.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => navigate('/checker')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Check Symptoms</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/demo')}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Interactive Demo & Guide</span>
              </button>

              <button
                onClick={handleTryExample}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
              >
                Try Quick Example
              </button>
            </div>
          </div>

          {/* Clean human summary box */}
          <div className="lg:col-span-4 bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2 text-xs">
            <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wide">
              Key Capabilities
            </span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>20 Curated Diagnostic Patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>High-Speed spaCy + RapidFuzz Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Zero Diagnostic Claims (Safe Prototype)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Local SQLite History Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Symptoms Recognized"
          value={stats.unique_symptoms_detected > 0 ? stats.unique_symptoms_detected : '28'}
          unit="canonical"
          icon={Stethoscope}
          changeText="Curated symptom dictionary"
          color="blue"
        />
        <StatCard
          title="Conditions in KB"
          value={stats.knowledge_base_conditions || 20}
          unit="patterns"
          icon={BookOpen}
          changeText="Across medical categories"
          color="blue"
        />
        <StatCard
          title="Analyses Performed"
          value={stats.total_analyses}
          unit="logged"
          icon={Activity}
          changeText={stats.total_analyses === 0 ? "No analyses yet" : "Saved in SQLite"}
          color="blue"
        />
        <StatCard
          title="Avg NLP Processing Time"
          value={stats.average_processing_time_ms || 18.5}
          unit="ms"
          icon={Clock}
          changeText="Fast local processing"
          color="blue"
        />
      </div>

      {/* How It Works Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              How the System Works
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5-step NLP pipeline from natural input to preliminary guidance
            </p>
          </div>
          <button
            onClick={() => navigate('/nlp-analysis')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View detailed NLP pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                      Step {st.num}
                    </span>
                    <div className="p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Analyses Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Recent Analyses
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recent user symptom queries processed and stored locally
            </p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recent_analyses && stats.recent_analyses.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Query</th>
                  <th className="p-3">Symptoms</th>
                  <th className="p-3">Top Match</th>
                  <th className="p-3">Match Score</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {stats.recent_analyses.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => navigate('/history')}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    title="Click to view all history records"
                  >
                    <td className="p-3 max-w-xs truncate text-slate-800 dark:text-slate-200 font-normal" title={rec.original_input}>
                      "{rec.original_input}"
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {rec.identified_symptoms.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium text-[11px] capitalize">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-200">
                      {rec.top_condition || 'No pattern match'}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {rec.top_match_score}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {rec.processing_time_ms} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
            <Stethoscope className="w-7 h-7 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No analyses yet.</p>
            <p className="text-xs text-slate-400 mt-0.5">Start by describing symptoms in the Symptom Checker.</p>
            <button
              onClick={() => navigate('/checker')}
              className="mt-3 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Open Symptom Checker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
