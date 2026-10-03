import React, { useState } from 'react';
import SymptomChip from '../common/SymptomChip';
import ConditionCard from '../common/ConditionCard';
import PrecautionCard from '../common/PrecautionCard';
import EmergencyAlert from '../common/EmergencyAlert';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  AlertCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function ResultCard({ data }) {
  const [showNlpDetails, setShowNlpDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const {
    original_text,
    tokens = [],
    identified_symptoms = [],
    symptom_matches = [],
    possible_conditions = [],
    precautions = [],
    consultation_advice,
    emergency_alert,
    emergency_reasons = [],
    processing_time_ms = 0,
    single_symptom_notice,
    disclaimer,
    message
  } = data;

  const handleCopySummary = async () => {
    const summaryText = `MedNLP Symptom Summary:
Query: "${original_text}"
Identified Symptoms: ${identified_symptoms.join(', ') || 'None'}
Top Patterns: ${possible_conditions.slice(0, 3).map(c => `${c.name} (${c.match_score}% match)`).join('; ') || 'None'}
Emergency Alert: ${emergency_alert ? 'YES - ' + emergency_reasons.join(', ') : 'No'}
Guidance: ${consultation_advice || 'Monitor symptoms'}
Disclaimer: ${disclaimer || 'Preliminary AI guidance - not a medical diagnosis.'}`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-150">
      {/* Emergency Alert (Red Flag Detection) */}
      {emergency_alert && (
        <EmergencyAlert reasons={emergency_reasons} />
      )}

      {/* Primary Message Bubble */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
          <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Symptom Evaluation
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3 h-3" /> {processing_time_ms} ms
            </span>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              title="Copy consultation summary to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
          {message}
        </p>

        {single_symptom_notice && (
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span>{single_symptom_notice}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: Identified Symptoms */}
      {identified_symptoms.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              1. Identified Symptoms ({identified_symptoms.length})
            </h4>
            <span className="text-[11px] text-slate-400">
              Normalized canonical terms
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {identified_symptoms.map((symptom) => {
              const matchInfo = symptom_matches.find((m) => m.canonical_symptom === symptom);
              return (
                <SymptomChip
                  key={symptom}
                  name={symptom}
                  method={matchInfo ? matchInfo.method : 'exact'}
                  confidence={matchInfo ? matchInfo.confidence : 1.0}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: NLP Processing Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                2. NLP Processing Details
              </h4>
            </div>
          </div>
          <button
            onClick={() => setShowNlpDetails(!showNlpDetails)}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {showNlpDetails ? (
              <>
                <span>Hide details</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Show pipeline steps</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Compact summary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Input Text</span>
            <p className="text-slate-700 dark:text-slate-200 font-medium truncate" title={original_text}>
              "{original_text}"
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Normalized Tokens</span>
            <p className="text-slate-700 dark:text-slate-200 font-medium">
              {tokens.length} tokens
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Extracted Symptoms</span>
            <p className="text-blue-600 dark:text-blue-400 font-semibold capitalize">
              {identified_symptoms.length > 0 ? identified_symptoms.join(', ') : 'None'}
            </p>
          </div>
        </div>

        {/* Expanded NLP Details */}
        {showNlpDetails && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                spaCy Tokens:
              </span>
              <div className="flex flex-wrap gap-1">
                {tokens.map((tok, i) => (
                  <span
                    key={i}
                    className="font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]"
                  >
                    {tok}
                  </span>
                ))}
              </div>
            </div>

            {symptom_matches.length > 0 && (
              <div>
                <span className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Symptom & Synonym Mapping:
                </span>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2">User Phrase</th>
                        <th className="p-2">Canonical Symptom</th>
                        <th className="p-2">Match Type</th>
                        <th className="p-2">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {symptom_matches.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-mono text-slate-700 dark:text-slate-300">"{m.matched_phrase}"</td>
                          <td className="p-2 font-semibold text-blue-600 dark:text-blue-400 capitalize">{m.canonical_symptom}</td>
                          <td className="p-2 uppercase text-[10px] font-bold text-slate-500">{m.method}</td>
                          <td className="p-2">{Math.round(m.confidence * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: Possible Associated Conditions */}
      {possible_conditions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              3. Possible Associated Conditions ({possible_conditions.length})
            </h4>
            <span className="text-[11px] text-slate-400">
              Ranked by symptom pattern overlap
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {possible_conditions.slice(0, 4).map((cond, idx) => (
              <ConditionCard key={cond.name} condition={cond} rank={idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Basic Precautions & Next Steps */}
      <PrecautionCard
        precautions={precautions}
        consultationAdvice={consultation_advice}
      />

      {/* SECTION 5: Mandatory Clinical Disclaimer */}
      <DisclaimerBanner text={disclaimer} />

    </div>
  );
}
