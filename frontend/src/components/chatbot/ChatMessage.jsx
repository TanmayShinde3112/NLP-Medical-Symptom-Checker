import React from 'react';
import { User, Stethoscope, Clock } from 'lucide-react';
import ResultCard from './ResultCard';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs ${
          isUser
            ? 'bg-blue-600 shadow-xs'
            : 'bg-slate-800 text-blue-400 dark:bg-slate-800 shadow-xs'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4 text-blue-400" />}
      </div>

      {/* Message Content Container */}
      <div className={`flex flex-col space-y-1 max-w-3xl ${isUser ? 'items-end' : 'items-start w-full'}`}>
        {/* Name & Time */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 dark:text-slate-500 px-1">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            {isUser ? 'You' : 'MedNLP Assistant'}
          </span>
          {message.timestamp && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>

        {/* Bubble or Result Component */}
        {isUser ? (
          <div className="px-4 py-2.5 rounded-xl rounded-tr-xs bg-blue-600 text-white text-sm sm:text-base leading-relaxed max-w-xl shadow-xs">
            {message.text}
          </div>
        ) : message.resultData ? (
          <ResultCard data={message.resultData} />
        ) : (
          <div className="px-4 py-3 rounded-xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line shadow-xs">
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
