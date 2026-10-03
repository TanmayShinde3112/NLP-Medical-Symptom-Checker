import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ChevronDown, ChevronUp, CornerDownLeft, Lightbulb, Mic, MicOff } from 'lucide-react';

export default function ChatInput({ onSendMessage, onClear, isLoading }) {
  const [input, setInput] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const baseInputRef = useRef('');

  // Clean up speech recognition on unmount
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
      alert("Voice dictation is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
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
      // Abort any existing recognition instance to prevent duplicate event listeners
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

      // Lock current input value before dictation starts so we append cleanly without duplication
      baseInputRef.current = input.trim();

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        // Build the transcript cumulatively from all result items in this session
        let speechText = '';
        for (let i = 0; i < event.results.length; i++) {
          speechText += event.results[i][0].transcript;
        }

        // Deduplicate accidental adjacent duplicate words (e.g., "headache headache" -> "headache")
        const cleanSpeech = speechText
          .replace(/\b([a-zA-Z]+)(?:\s+\1\b)+/gi, '$1')
          .trim();

        const base = baseInputRef.current;
        const fullText = base ? `${base} ${cleanSpeech}` : cleanSpeech;
        setInput(fullText);
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

  const exampleQueries = [
    "I have fever, headache and body pain.",
    "I am experiencing stomach pain and vomiting.",
    "I have a runny nose, sneezing and sore throat.",
    "I have headache and sensitivity to light.",
    "I have head pain and high temperature.",
    "I have hedache and feever.",
    "I have severe chest pain and difficulty breathing.",
    "I feel terrible and something is wrong."
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    baseInputRef.current = '';
    setShowExamples(false);
  };

  // When an example is chosen: fill input AND automatically minimize the suggestions panel
  const handleSelectExample = (exText) => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }
    setInput(exText);
    baseInputRef.current = exText;
    setShowExamples(false); // Minimize panel to give maximum space to chat
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-3 space-y-2.5 transition-colors">
      {/* Examples Toggle Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-0.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>{showExamples ? 'Hide examples' : 'Try an example symptom'}</span>
          {showExamples ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {showExamples && (
          <span className="text-[11px] text-slate-400">
            Clicking an example will select it and minimize this panel
          </span>
        )}
      </div>

      {/* Collapsible Example Suggestions Dropdown */}
      {showExamples && (
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
          {exampleQueries.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(ex)}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors text-left"
            >
              "{ex}"
            </button>
          ))}
        </div>
      )}

      {/* Active Voice Listening Banner */}
      {isListening && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Listening...</span>
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

      {/* Input Textarea & Action Row */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Describe your symptoms (e.g., I have fever, headache and body pain)..."
            className="w-full resize-none rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <div className="hidden sm:flex absolute right-2.5 bottom-2.5 text-[10px] text-slate-400 items-center gap-0.5 pointer-events-none">
            <span>Enter</span>
            <CornerDownLeft className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Voice Dictation (Speech-to-Text) Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          title={isListening ? "Stop listening" : "Voice dictation (Speech-to-Text)"}
          className={`p-2.5 rounded-lg border transition-all ${
            isListening
              ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-400 animate-pulse ring-2 ring-rose-400/50'
              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>

        {onClear && (
          <button
            type="button"
            onClick={() => {
              if (isListening) {
                try {
                  recognitionRef.current?.stop();
                } catch {}
                setIsListening(false);
              }
              setInput('');
              baseInputRef.current = '';
              onClear();
            }}
            disabled={isLoading}
            title="Clear chat"
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
        >
          <span>Analyze</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
        <span>Offline NLP analysis via spaCy + RapidFuzz</span>
        <span className="hidden sm:inline">No personal data required</span>
      </div>
    </div>
  );
}
