import React, { useState, useEffect, useCallback } from 'react';
import {
  Cpu,
  Play,
  Tag,
  Search,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Code,
  Copy,
  Check
} from 'lucide-react';
import PipelineVisualizer from '../components/nlp/PipelineVisualizer';
import TokenViewer from '../components/nlp/TokenViewer';
import { api } from '../api/client';

export default function NlpAnalysisPage() {
  const [inputText, setInputText] = useState("I've got a terrible headache and high temperature.");
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const sampleInputs = [
    "I've got a terrible headache and high temperature.",
    "My stomach hurts and I am throwing up.",
    "I have runny nose, sneezing and sore throat.",
    "I have headache, but no fever and no vomiting.",
    "I have headache but no cough, cold, or fever.",
    "I have severe chest pain and difficulty breathing.",
    "I have hedache and feever."
  ];

  const runAnalysis = useCallback(async (textToRun) => {
    const query = textToRun || inputText;
    if (!query.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const data = await api.processNlpPipeline(query);
      setPipelineResult(data);
    } catch (err) {
      console.error('NLP Sandbox error:', err);
      setError("Failed to communicate with NLP pipeline server.");
    } finally {
      setIsProcessing(false);
    }
  }, [inputText]);

  useEffect(() => {
    runAnalysis("I've got a terrible headache and high temperature.");
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Natural Language Processing Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Visualize how natural-language input is tokenized, normalized, and extracted
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Input Sandbox */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-1">
            Test Clinical Input Query:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAnalysis(inputText)}
              placeholder="Enter an unconstrained symptom sentence..."
              className="flex-1 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => runAnalysis(inputText)}
              disabled={isProcessing || !inputText.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample query buttons */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs text-slate-400 font-semibold block">Curated NLP Benchmarks:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample);
                  runAnalysis(sample);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 font-medium transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
        )}
      </div>

      {/* Main Interactive Pipeline Visualizer */}
      {pipelineResult && (
        <PipelineVisualizer
          pipelineData={{
            ...pipelineResult.pipeline,
            possible_conditions: pipelineResult.possible_conditions,
            precautions: pipelineResult.precautions,
            consultation_advice: pipelineResult.consultation_advice,
            emergency_alert: pipelineResult.emergency_alert,
            emergency_reasons: pipelineResult.emergency_reasons,
            message: pipelineResult.message,
            disclaimer: pipelineResult.disclaimer
          }}
        />
      )}

      {/* Detailed Lexical & Token Breakdown */}
      {pipelineResult && pipelineResult.pipeline && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Token Analysis Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-600" />
                <span>spaCy Tokenization & POS Tagging</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {pipelineResult.pipeline.token_details?.length || 0} tokens
              </span>
            </div>
            <TokenViewer tokenDetails={pipelineResult.pipeline.token_details} />
          </div>

          {/* Synonym & Typo Extraction Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-600" />
                <span>Symptom Extraction & Synonym Mappings</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {pipelineResult.identified_symptoms?.length || 0} recognized
              </span>
            </div>

            {pipelineResult.symptom_matches && pipelineResult.symptom_matches.length > 0 ? (
              <div className="space-y-3">
                {pipelineResult.symptom_matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5">Surface Phrase:</span>
                      <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100">
                        "{m.matched_phrase}"
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400" />

                    <div>
                      <span className="text-xs text-slate-400 block mb-0.5">Canonical Normalized:</span>
                      <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 capitalize">
                        {m.canonical_symptom}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        {m.method}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{Math.round(m.confidence * 100)}% match</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400">No canonical symptoms detected in this input query.</p>
              </div>
            )}

            {/* Negation Scope Status */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 text-xs text-cyan-900 dark:text-cyan-200 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                Negation Handling Active:
              </span>
              <p>
                Symptoms preceded by negation indicators ("no", "not", "without", "free of") or coordinated negative lists are excluded from positive extraction.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON Debug Inspector */}
      {pipelineResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-600" />
              <span>Full NLP Response Payload (JSON)</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(JSON.stringify(pipelineResult, null, 2));
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  } catch (e) {
                    console.error("Copy JSON failed:", e);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy entire JSON to clipboard"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
              <span className="text-xs text-slate-400 font-mono">FastAPI output</span>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 border border-slate-800">
            {JSON.stringify(pipelineResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
