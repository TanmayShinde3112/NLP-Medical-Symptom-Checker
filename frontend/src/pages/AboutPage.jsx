import React from 'react';
import {
  Info,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Code2,
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  const nlpTechniques = [
    {
      title: "Text Preprocessing & Normalization",
      desc: "Cleans unconstrained user text through contraction expansion ('I\\'ve got' -> 'i have got'), case folding, and regex noise removal."
    },
    {
      title: "Statistical Tokenization (spaCy)",
      desc: "Segments raw text into discrete lexical tokens using spaCy's en_core_web_sm pipeline while tagging grammatical Part-of-Speech."
    },
    {
      title: "Lemmatization & Stopword Pruning",
      desc: "Reduces inflected tokens to canonical base lemmas (e.g. 'aching' -> 'ache', 'vomited' -> 'vomit') while protecting medical negation terms."
    },
    {
      title: "Multi-Word Symptom Extraction",
      desc: "Detects n-gram medical entities such as 'runny nose', 'stomach pain', 'body pain', and 'sensitivity to light' across sentence spans."
    },
    {
      title: "Synonym Normalization",
      desc: "Resolves colloquial vernacular into canonical ontology entries (e.g. 'high temperature' -> fever, 'head hurts' -> headache)."
    },
    {
      title: "RapidFuzz Typo Tolerance",
      desc: "Employs Levenshtein ratio matching (>= 72% threshold) to smoothly recognize user typos like 'hedache' and 'feever'."
    },
    {
      title: "Clinical Negation Scope Analysis",
      desc: "Parses lookahead and backward negation scopes (e.g., 'no fever and no vomiting') to prevent misattributing denied symptoms."
    },
    {
      title: "Automated Red Flag Triage",
      desc: "Instantly flags emergency symptoms (e.g. severe chest pain, trouble breathing) and triggers urgent medical evaluation warnings."
    }
  ];

  const techStack = [
    { area: "Frontend Framework", tech: "React 19 + Vite" },
    { area: "Styling & UI Design", tech: "Tailwind CSS v4 + Lucide Icons" },
    { area: "Speech Recognition", tech: "Web Speech API (Real-Time Voice Dictation)" },
    { area: "Backend API Engine", tech: "Python 3.13 + FastAPI + Uvicorn (ASGI)" },
    { area: "NLP & Tokenization", tech: "spaCy (en_core_web_sm) + Linguistic Pipelines" },
    { area: "Fuzzy String Matching", tech: "RapidFuzz 3.14 (Levenshtein Token Ratio)" },
    { area: "Database & Storage", tech: "SQLite 3 + SQLAlchemy 2.0 ORM" },
    { area: "Data Validation", tech: "Pydantic v2 Schema Validation" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title & Personal Project Showcase Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-cyan-100 border border-white/20">
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Personal AI Project • Production Edition</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          MedNLP — AI Medical Symptom Intelligence Platform
        </h2>

        <p className="text-sm text-cyan-100 max-w-2xl font-normal leading-relaxed">
          An explainable, privacy-first conversational health assistant engineered with state-of-the-art computational linguistics, clinical negation parsing, and deterministic condition triage.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/20 text-xs sm:text-sm">
          <div>
            <span className="text-cyan-200 block text-[11px] uppercase font-semibold">Engine Core:</span>
            <span className="font-bold">spaCy + RapidFuzz</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px] uppercase font-semibold">Inference Latency:</span>
            <span className="font-bold">&lt; 15ms Real-Time</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px] uppercase font-semibold">Interaction:</span>
            <span className="font-bold">Voice & Natural Text</span>
          </div>
          <div>
            <span className="text-cyan-200 block text-[11px] uppercase font-semibold">Architecture:</span>
            <span className="font-bold">FastAPI + React 19</span>
          </div>
        </div>
      </div>

      {/* Problem Statement & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Problem Statement & Vision</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Patients describe medical complaints in unconstrained, colloquial everyday language rather than formal ICD-10 medical nomenclature. Generic keyword search engines fail because of complex synonyms, typos, and negative statements (such as <em>"I have a headache but no fever"</em>). MedNLP bridges this gap by grounding free-form text and speech into canonical clinical concepts with transparent, explainable triage logic.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Core System Capabilities</span>
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Natural Language & Voice Input:</strong> Speak or type symptoms naturally without medical jargon.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Contextual Negation (NegEx):</strong> Reliably detects ruled-out symptoms across complex coordinated lists.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Fuzzy Typo Tolerance:</strong> RapidFuzz Levenshtein matching instantly handles phonetic typos and misspellings.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Red-Flag Guardrails:</strong> High-priority emergency detection immediately flags life-threatening symptoms.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* NLP Techniques */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Natural Language Processing Pipeline</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Eight deterministic stages transforming unstructured text into structured medical intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nlpTechniques.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5"
            >
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                STAGE 0{idx + 1}
              </span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {tech.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Full-Stack Technology Architecture</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">System Component</th>
                <th className="p-3.5">Technology & Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {techStack.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-400">
                    {item.area}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 dark:text-slate-100 font-mono">
                    {item.tech}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Principles & Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Clinical Safety & Governance</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Zero Hallucination:</strong> Deterministic pattern matching ensures explanations are 100% grounded in verified medical rules.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Privacy by Default:</strong> All text and voice processing executes locally without sending personal health telemetry to third-party ad brokers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Emergency Prioritization:</strong> Red-flag life safety triggers immediately supersede routine differential considerations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span><strong>Explicit Advisory:</strong> Clear non-prescriptive precautions and instructions on when to consult licensed medical specialists.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Future Roadmap & Enhancements</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Integration of biomedical transformer embeddings (BioBERT / ClinicalBERT) for hybrid semantic retrieval.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Multi-turn conversational dialogue state tracking and slot-filling across consultation sessions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Automated clinical assessment PDF summary generation for physician consultation intake.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Geolocation-assisted referral to nearby 24/7 emergency centers and primary care clinics.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
