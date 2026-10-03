import React, { useState } from 'react';
import {
  MessageSquare,
  FileCode,
  Scissors,
  Tag,
  Wand2,
  Search,
  Layers,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function PipelineVisualizer({ pipelineData }) {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      id: 0,
      title: "1. Raw User Input",
      short: "Input",
      icon: MessageSquare,
      summary: "Natural-language symptom query entered by user",
      content: pipelineData ? (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm">
          "{pipelineData.original_text || 'No data yet'}"
        </div>
      ) : null,
      explanation: "Captures unconstrained clinical descriptions such as 'I have fever, headache and body pain' or 'My stomach hurts and I am throwing up'."
    },
    {
      id: 1,
      title: "2. Text Cleaning & Normalization",
      short: "Cleaning",
      icon: FileCode,
      summary: "Case folding, contraction expansion, whitespace & symbol removal",
      content: pipelineData ? (
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs">
            <span className="text-slate-400 block mb-1">Cleaned representation:</span>
            "{pipelineData.cleaned_text}"
          </div>
        </div>
      ) : null,
      explanation: "Expands contractions (e.g., 'I've' -> 'i have', 'can't' -> 'cannot'), folds text to lowercase, and strips non-essential symbols while preserving punctuation boundaries."
    },
    {
      id: 2,
      title: "3. spaCy Tokenization & POS",
      short: "Tokenize",
      icon: Scissors,
      summary: "Splitting sentence into linguistic atomic tokens",
      content: pipelineData ? (
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {(pipelineData.tokens || []).map((t, idx) => (
            <span key={idx} className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-cyan-600 dark:text-cyan-400">
              {t}
            </span>
          ))}
        </div>
      ) : null,
      explanation: "Employs spaCy's statistical linguistic pipeline to segment natural-language text into discrete lexical tokens."
    },
    {
      id: 3,
      title: "4. Lemmatization & Stopword Filtering",
      short: "Lemmatize",
      icon: Tag,
      summary: "Extracting canonical root words and identifying non-informative words",
      content: pipelineData ? (
        <div className="space-y-3">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">Content Lemmas:</span>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {(pipelineData.lemmatized_tokens || []).map((l, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null,
      explanation: "Reduces inflected morphological variants (e.g. 'aches' -> 'ache', 'throwing' -> 'throw') while selectively preserving medical negators like 'no', 'not', 'without'."
    },
    {
      id: 4,
      title: "5. Symptom & Synonym Extraction",
      short: "Symptoms",
      icon: Wand2,
      summary: "Multi-word phrase matching and canonical synonym normalization",
      content: pipelineData ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(pipelineData.extracted_symptoms || []).map((s, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-semibold text-xs border border-cyan-300 dark:border-cyan-800 capitalize">
                ✓ {s}
              </span>
            ))}
          </div>
          {(pipelineData.extracted_symptoms || []).length === 0 && (
            <p className="text-xs text-slate-400 italic">No symptoms recognized in current input.</p>
          )}
        </div>
      ) : null,
      explanation: "Maps colloquial variations into unified canonical symptoms: e.g., 'high temperature' -> fever, 'head pain' -> headache, 'stomach ache' -> stomach pain."
    },
    {
      id: 5,
      title: "6. RapidFuzz Approximate Matching",
      short: "Fuzzy",
      icon: Search,
      summary: "Levenshtein distance calculation for typo and spelling resilience",
      content: pipelineData && pipelineData.symptom_matches ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
          {pipelineData.symptom_matches.map((m, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="font-mono text-slate-700 dark:text-slate-300">"{m.matched_phrase}"</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase text-[10px]">
                {m.method} ({Math.round(m.confidence * 100)}%)
              </span>
            </div>
          ))}
        </div>
      ) : null,
      explanation: "Applies RapidFuzz token sort and ratio algorithms with strict thresholds (>= 88%) to tolerate common user typos like 'hedache' or 'naucea' without false matches."
    },
    {
      id: 6,
      title: "7. Rule-Based Condition Matching",
      short: "Matching",
      icon: Layers,
      summary: "Knowledge base condition ranking based on transparent symptom overlap",
      content: pipelineData ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Overlap Mathematical Model:</p>
          <div className="p-2 bg-white dark:bg-slate-900 rounded-lg font-mono text-[11px] text-cyan-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
            Score = (0.6 * (|S_match| / |S_condition|) + 0.4 * (|S_match| / |S_user|)) * 100%
          </div>
          {pipelineData.possible_conditions && pipelineData.possible_conditions.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300 block">Top Matched Conditions:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {pipelineData.possible_conditions.slice(0, 4).map((c, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.category}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs">{c.match_score}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic text-[11px]">No conditions matched the extracted symptoms.</p>
          )}
        </div>
      ) : null,
      explanation: "Ranks medical knowledge base conditions by balancing precision (condition coverage) and recall (user coverage) transparently."
    },
    {
      id: 7,
      title: "8. Response & Precaution Generation",
      short: "Output",
      icon: CheckCircle2,
      summary: "Evidence-based non-prescriptive supportive care advice and disclaimers",
      content: pipelineData ? (
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-600 dark:text-slate-300">
          {pipelineData.emergency_alert ? (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 font-medium">
              URGENT ALERT: High-risk red flag symptoms detected ({pipelineData.emergency_reasons?.join(', ')}). Immediate medical intervention recommended.
            </div>
          ) : null}
          {pipelineData.precautions && pipelineData.precautions.length > 0 ? (
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Generated Supportive Care Precautions:</span>
              <ul className="list-disc list-inside space-y-0.5 pl-1">
                {pipelineData.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-slate-400 italic">No specific precautions generated for this query.</p>
          )}
          {pipelineData.consultation_advice ? (
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px]">
              <span className="font-semibold block">When to Consult:</span>
              <p>{pipelineData.consultation_advice}</p>
            </div>
          ) : null}
        </div>
      ) : null,
      explanation: "Produces safe, deterministic, non-prescriptive outputs ensuring users understand the informational nature of the academic prototype."
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Interactive NLP Architecture Pipeline</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Click any step to inspect the underlying NLP transformations and mathematical criteria
        </p>
      </div>

      {/* Pipeline Step Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {stages.map((st) => {
          const Icon = st.icon;
          const isActive = activeStage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id)}
              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-400 text-cyan-700 dark:text-cyan-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400 animate-bounce' : ''}`} />
              <span className="text-[11px] font-bold leading-tight line-clamp-1">{st.short}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Panel */}
      <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-600 text-white">
              {React.createElement(stages[activeStage].icon, { className: "w-4 h-4" })}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {stages[activeStage].title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stages[activeStage].summary}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
            Stage {activeStage + 1} of 8
          </span>
        </div>

        {/* Live Transformation Data */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Pipeline Live Data:
          </span>
          {stages[activeStage].content || (
            <p className="text-xs text-slate-400 italic">Run an analysis in the Symptom Checker to populate live data.</p>
          )}
        </div>

        {/* Technical Academic Explanation */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
          <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5 text-slate-800 dark:text-slate-200">Technical NLP Implementation:</span>
            <p>{stages[activeStage].explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
