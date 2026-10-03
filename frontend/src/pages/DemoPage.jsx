import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  Sparkles,
  Mic,
  MicOff,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Zap,
  HelpCircle,
  Sliders,
  Check,
  Stethoscope,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api/client';

export default function DemoPage() {
  const navigate = useNavigate();

  // Preset demo scenarios for 1-click live testing
  const DEMO_SCENARIOS = [
    {
      id: 'flu',
      title: 'Viral Infection (Flu Pattern)',
      badge: 'Multi-Symptom',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      description: 'Multiple active symptoms matching a classic viral infection pattern.',
      query: 'I have a high fever, severe headache, and body aches for two days.',
      expectedHighlights: ['Identifies fever, headache, body pain', 'High confidence match', 'Recommends rest & hydration']
    },
    {
      id: 'negation',
      title: 'Clinical Negation Handling',
      badge: 'NegEx Algorithm',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      description: 'Demonstrates intelligent exclusion of symptoms the patient explicitly denies.',
      query: 'I have a painful headache, but no cough, cold, or fever.',
      expectedHighlights: ['Extracts "headache" only', 'Excludes cough, cold, and fever', 'Prevents false flu diagnosis']
    },
    {
      id: 'emergency',
      title: 'Red-Flag Emergency Triage',
      badge: 'Critical Red Flag',
      badgeColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      description: 'Critical life-safety symptoms trigger an immediate high-priority alert.',
      query: 'I have severe chest pain and difficulty breathing.',
      expectedHighlights: ['Emergency alert triggers immediately', 'Urgent ER advice', 'Supercedes routine recommendations']
    },
    {
      id: 'gastric',
      title: 'Digestive / Gastric Pattern',
      badge: 'Gastrointestinal',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      description: 'Stomach burning and nausea mapped to Peptic Gastritis pattern.',
      query: 'My stomach is burning and I feel severe nausea and vomiting after eating.',
      expectedHighlights: ['Extracts stomach pain, nausea, vomiting', 'Matches Peptic Gastritis', 'Dietary & hydration guidance']
    },
    {
      id: 'typo',
      title: 'Fuzzy Typo & Vernacular Match',
      badge: 'RapidFuzz',
      badgeColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      description: 'Typographical errors and informal phrases normalized seamlessly.',
      query: 'I have bad hedache and feever with head pain.',
      expectedHighlights: ['Normalizes "hedache" -> headache', 'Normalizes "feever" -> fever', 'Zero manual corrections needed']
    }
  ];

  const [customInput, setCustomInput] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState('flu');
  const [activeTab, setActiveTab] = useState('tour'); // 'tour' | 'sandbox' | 'tips'
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseInputRef = useRef('');

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.warn(err);
      }
      setIsListening(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      baseInputRef.current = customInput.trim();

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let speechText = '';
        for (let i = 0; i < event.results.length; i++) {
          speechText += event.results[i][0].transcript;
        }

        const cleanSpeech = speechText
          .replace(/\b([a-zA-Z]+)(?:\s+\1\b)+/gi, '$1')
          .trim();

        const base = baseInputRef.current;
        const fullText = base ? `${base} ${cleanSpeech}` : cleanSpeech;
        setCustomInput(fullText);
        setSelectedScenarioId(null);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone permission was denied. Please allow microphone access in your browser address bar.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  // Run live analysis against real FastAPI backend
  const handleRunAnalysis = async (textToRun) => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }
    const query = textToRun || customInput;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await api.analyzeSymptoms(query);
      setAnalysisResult(data);
    } catch (err) {
      console.error('Demo analysis error:', err);
      setError('Could not connect to the backend engine on port 8000. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run scenario by clicking
  const handleSelectScenario = (scenario) => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }
    setSelectedScenarioId(scenario.id);
    setCustomInput(scenario.query);
    handleRunAnalysis(scenario.query);
  };

  // Copy query to clipboard
  const handleCopyQuery = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-cyan-100 border border-white/20">
            <PlayCircle className="w-4 h-4 text-cyan-200" />
            <span>New User Interactive Tour & Live Sandbox</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            How MedNLP Works — Interactive Guide
          </h2>

          <p className="text-sm sm:text-base text-cyan-100 leading-relaxed font-normal">
            Welcome! MedNLP translates natural, conversational language into structured medical insights using real-time NLP. Follow the interactive steps below or test real clinical scenarios live.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveTab('sandbox');
                handleSelectScenario(DEMO_SCENARIOS[0]);
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-cyan-50 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Try Live Interactive Sandbox</span>
            </button>

            <button
              onClick={() => navigate('/checker')}
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch Symptom Checker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('tour')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'tour'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>1. 4-Step User Guide</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sandbox');
            if (!analysisResult) handleSelectScenario(DEMO_SCENARIOS[0]);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Live Interactive Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'tips'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Feature Highlights & Tips</span>
        </button>
      </div>

      {/* TAB 1: 4-STEP USER GUIDE */}
      {activeTab === 'tour' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Getting Started in 4 Easy Steps
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Follow this intuitive workflow whenever you want to assess symptoms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 relative hover:border-blue-400 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base shadow-xs">
                1
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-blue-500" />
                <span>Speak or Type Naturally</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click the microphone icon to speak your symptoms aloud, or type freely in everyday conversational words without worrying about medical terminology.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 italic">
                "I have high temperature and my head really hurts"
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 relative hover:border-purple-400 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base shadow-xs">
                2
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>AI Extracts & Negates</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The NLP engine standardizes synonyms, fixes typos, and excludes negated symptoms (such as <em>"no cough, no fever"</em>) using NegEx logic.
              </p>
              <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 text-[11px] text-purple-800 dark:text-purple-300">
                Extracted: <strong>headache</strong> | Negated: <strong>fever, cough</strong>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 relative hover:border-emerald-400 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base shadow-xs">
                3
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <span>Instant Clinical Match</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Evaluates positive symptoms against 20 verified diagnostic condition patterns, calculating transparent match percentages and differential insights.
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                Pattern Overlap: <strong>70% Viral Infection</strong>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 relative hover:border-rose-400 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-base shadow-xs">
                4
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Triage & Red Flags</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Critical life-safety symptoms (chest pain, severe breathlessness) trigger immediate emergency alerts with clear instructions to dial emergency lines.
              </p>
              <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                Emergency Alert: <strong>Seek Urgent Care</strong>
              </div>
            </div>
          </div>

          {/* Quick CTA to Sandbox */}
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Ready to see it in action?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test pre-built cases in the live sandbox with instant real-time API responses.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('sandbox');
                handleSelectScenario(DEMO_SCENARIOS[0]);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <span>Launch Live Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE INTERACTIVE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Real-Time Clinical Sandbox</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select any pre-configured case below or type your own symptoms to run live inference against the local NLP engine on port 8000.
            </p>
          </div>

          {/* Scenarios Carousel / Button Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`text-left p-4 rounded-2xl border transition-all space-y-2 relative ${
                  selectedScenarioId === sc.id
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  {selectedScenarioId === sc.id && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  {sc.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  "{sc.query}"
                </p>
              </button>
            ))}
          </div>

          {/* Live Input Sandbox Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Active Query:</span>
              </label>
              {customInput && (
                <button
                  onClick={() => handleCopyQuery(customInput)}
                  className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : null}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              )}
            </div>

            {isListening && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-semibold">Listening to microphone...</span>
                  <span className="text-[11px] text-rose-600/80 dark:text-rose-400 hidden sm:inline">Speak naturally without pauses.</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-[11px] font-bold text-rose-700 dark:text-rose-200 underline hover:no-underline"
                >
                  Done Speaking
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setSelectedScenarioId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunAnalysis(customInput);
                }}
                placeholder="Type or speak custom symptoms here (e.g. 'I have headache but no fever')..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Speak symptoms via microphone"}
                className={`px-3 py-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400 animate-pulse ring-2 ring-rose-400/50'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleRunAnalysis(customInput)}
                disabled={loading || !customInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs whitespace-nowrap"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? 'Analyzing...' : 'Run Live'}</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Live Analysis Output Container */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Result Header & Latency */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Live Engine Output
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Query: <span className="font-medium text-slate-700 dark:text-slate-300 italic">"{analysisResult.original_text}"</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{analysisResult.latency_ms} ms</span>
                  </span>
                  <button
                    onClick={() => navigate('/checker', { state: { example: analysisResult.original_text } })}
                    className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Open in Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Emergency Alert Banner (if applicable) */}
              {analysisResult.emergency_alert && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Emergency Red-Flag Triggered</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Urgent medical evaluation is recommended. Red flag symptoms detected:{' '}
                    <strong>{analysisResult.emergency_reasons?.join(', ') || 'Critical symptoms'}</strong>.
                  </p>
                </div>
              )}

              {/* Extracted Symptoms: Positive vs Negated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Active Symptoms Identified ({analysisResult.identified_symptoms?.length || 0})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysisResult.identified_symptoms?.length > 0 ? (
                      analysisResult.identified_symptoms.map((sym, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-semibold"
                        >
                          {sym}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No positive symptoms recognized</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>Negation & Red-Flag Status</span>
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {analysisResult.emergency_alert
                      ? 'Status: Emergency flag active.'
                      : 'Status: Non-emergency standard consultation guidance.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Clean tokens processed: {analysisResult.nlp_pipeline_details?.clean_tokens?.length || 0}
                  </p>
                </div>
              </div>

              {/* Condition Matching Ranking */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Top Differential Matches
                </h4>

                <div className="space-y-2.5">
                  {analysisResult.possible_conditions?.length > 0 ? (
                    analysisResult.possible_conditions.slice(0, 3).map((cond, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                              {cond.condition_name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {cond.category}
                            </span>
                          </div>
                          <span className="font-bold text-xs text-blue-600 dark:text-blue-400 font-mono">
                            {cond.match_score}% Overlap
                          </span>
                        </div>

                        {/* Overlap Progress Bar */}
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${cond.match_score}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>
                            Overlapping symptoms: <strong>{cond.matched_symptoms?.join(', ') || 'None'}</strong>
                          </span>
                          <span className="text-slate-400">
                            Urgency: {cond.urgency_level || 'Routine'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400 text-center">
                      No matching conditions found in knowledge base for this symptom pattern.
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Advice & Precautions */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 space-y-2">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Clinical Advice & Recommended Precautions</span>
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysisResult.consultation_advice}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {analysisResult.precautions?.map((prec, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      • {prec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEATURE HIGHLIGHTS & TIPS */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Power Features & Usage Tips
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Get the most accurate evaluations out of MedNLP with these practical tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Voice Dictation (Speech-to-Text)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Click the microphone icon in the chat bar at any time to dictate symptoms verbally. The Web Speech API continuously transcribes your spoken words into the text field in real time.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Natural Negation Handling
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                MedNLP understands words like <em>"no"</em>, <em>"not"</em>, <em>"without"</em>, and <em>"denies"</em>. Feel free to say: <em>"I have body ache but no cough or fever"</em>.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                100% Privacy by Design
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                All symptom analyses run on your local computer using Python and SQLite. No confidential patient data or medical questions are sent to cloud LLM providers or advertising brokers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Exportable Health History
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Visit the Health History tab at any time to review past assessments, inspect symptom progression, and download official CSV or JSON exports to share with your healthcare provider.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
