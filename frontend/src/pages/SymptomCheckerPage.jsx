import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ChatMessage from '../components/chatbot/ChatMessage';
import ChatInput from '../components/chatbot/ChatInput';
import ProcessingIndicator from '../components/chatbot/ProcessingIndicator';
import { api } from '../api/client';
import { Stethoscope, RefreshCcw, Sparkles } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'assistant',
  text: "Hello! I can help identify symptoms from your description and provide preliminary health information. What symptoms are you experiencing?",
  timestamp: new Date().toISOString(),
  resultData: null
};

export default function SymptomCheckerPage() {
  const location = useLocation();
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('mednlp_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [INITIAL_MESSAGE];
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Persist conversation to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('mednlp_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = useCallback(async (text) => {
    if (!text || !text.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      resultData: null
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to FastAPI backend
      const result = await api.analyzeSymptoms(text);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.message,
        timestamp: new Date().toISOString(),
        resultData: result
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: "I was unable to connect to the MedNLP backend server. Please verify that the FastAPI backend is running at http://localhost:8000.",
        timestamp: new Date().toISOString(),
        resultData: null
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handle incoming example from Dashboard navigation state
  useEffect(() => {
    if (location.state?.example) {
      handleSendMessage(location.state.example);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleSendMessage]);

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    sessionStorage.removeItem('mednlp_chat_messages');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] min-h-[600px] animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Symptom Checker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Tell me what you're experiencing in your own words.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Quick Suggestion Chips for New Users */}
        {messages.length === 1 && (
          <div className="ml-11 max-w-2xl space-y-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700/60 animate-in fade-in">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Or click one of these quick scenarios to test instantly:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage("I have a high fever, severe headache, and body aches for two days.")}
                className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 transition-all text-left shadow-2xs"
              >
                🌡️ Fever & body aches
              </button>
              <button
                onClick={() => handleSendMessage("I have a painful headache, but no cough, cold, or fever.")}
                className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 transition-all text-left shadow-2xs"
              >
                🧠 Headache (Negation test: no fever)
              </button>
              <button
                onClick={() => handleSendMessage("Experiencing stomach burning, nausea, and vomiting after meals.")}
                className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 transition-all text-left shadow-2xs"
              >
                🤢 Stomach pain & nausea
              </button>
              <button
                onClick={() => handleSendMessage("I have severe chest pain and difficulty breathing.")}
                className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 transition-all text-left shadow-2xs"
              >
                ⚠️ Severe chest pain & breathlessness
              </button>
            </div>
          </div>
        )}

        {/* Processing Indicator during NLP execution */}
        {isLoading && <ProcessingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="pt-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          onClear={handleClearChat}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
