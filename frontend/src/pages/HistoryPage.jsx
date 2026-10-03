import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Search,
  Download
} from 'lucide-react';
import Modal from '../components/common/Modal';
import { api } from '../api/client';

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory(50);
      setHistoryItems(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewDetail = async (id) => {
    try {
      const detail = await api.getHistoryDetail(id);
      setSelectedRecord(detail);
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching record detail:', err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.clearAllHistory();
      setHistoryItems([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  const filteredHistory = historyItems.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase().trim();
    const matchesInput = item.original_input?.toLowerCase().includes(term);
    const matchesSymptoms = item.identified_symptoms?.some((s) => s.toLowerCase().includes(term));
    const matchesCondition = item.top_condition?.toLowerCase().includes(term);
    const matchesEmergency = (term === 'emergency' || term === 'red flag') ? item.emergency_alert : false;
    const matchesId = item.id.toString() === term;
    return matchesInput || matchesSymptoms || matchesCondition || matchesEmergency || matchesId;
  });

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Analysis History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Local SQLite database records from conversational symptom evaluations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {historyItems.length > 0 && (
            <div className="flex items-center gap-1.5">
              <a
                href={api.exportHistoryUrl('csv')}
                download="mednlp_history_export.csv"
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
                title="Download full analysis history as CSV"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Export CSV</span>
              </a>
              <a
                href={api.exportHistoryUrl('json')}
                download="mednlp_history_export.json"
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
                title="Download full analysis history as JSON"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export JSON</span>
              </a>
            </div>
          )}

          <button
            onClick={fetchHistory}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {historyItems.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      {historyItems.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter past analyses by symptom, input text, or condition pattern..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      )}

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Raw Input</th>
                  <th className="p-4">Identified Symptoms</th>
                  <th className="p-4">Top Pattern Match</th>
                  <th className="p-4">Latency</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-100 max-w-xs truncate" title={item.original_input}>
                      "{item.original_input}"
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {item.identified_symptoms.length > 0 ? (
                          item.identified_symptoms.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-semibold text-[11px] capitalize border border-cyan-200 dark:border-cyan-800"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None detected</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {item.emergency_alert ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                          <AlertOctagon className="w-3.5 h-3.5" /> Urgent Red Flag
                        </span>
                      ) : item.top_condition ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs block">
                            {item.top_condition}
                          </span>
                          <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                            {item.top_match_score}% overlap
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No match</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {item.processing_time_ms} ms
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewDetail(item.id)}
                          className="p-2 rounded-xl text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 dark:text-cyan-400 transition-colors"
                          title="View detailed NLP analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                          title="Delete this record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            {searchTerm ? 'No matching history records found' : 'No analyses recorded yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'Try modifying your search keywords.'
              : 'As you interact with the Symptom Checker, evaluations will be logged here in real time for health tracking.'}
          </p>
        </div>
      )}

      {/* Record Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Analysis Record Deep-Dive"
        maxWidth="max-w-3xl"
      >
        {selectedRecord && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-xs font-semibold block uppercase">Raw Input:</span>
              <p className="font-mono text-slate-800 dark:text-slate-200">"{selectedRecord.original_input}"</p>
            </div>

            {selectedRecord.cleaned_text && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-xs font-semibold block uppercase">Cleaned / Normalized:</span>
                <p className="font-mono text-cyan-700 dark:text-cyan-300">"{selectedRecord.cleaned_text}"</p>
              </div>
            )}

            {selectedRecord.tokens && selectedRecord.tokens.length > 0 && (
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-semibold block uppercase">spaCy Tokens ({selectedRecord.tokens.length}):</span>
                <div className="flex flex-wrap gap-1 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedRecord.tokens.map((tok, idx) => (
                    <span key={idx} className="font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs">
                      {tok}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.emergency_reasons && selectedRecord.emergency_reasons.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs">
                <span className="font-bold">Urgent Indicators Triggered:</span> {selectedRecord.emergency_reasons.join(', ')}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block mb-1">Identified Symptoms:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedRecord.identified_symptoms.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold capitalize">
                      {s}
                    </span>
                  ))}
                  {selectedRecord.identified_symptoms.length === 0 && <span className="text-slate-400 italic">None</span>}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 block mb-1">Emergency Evaluation:</span>
                {selectedRecord.emergency_alert ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> High Risk Red Flag
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Routine Clinical Pattern
                  </span>
                )}
              </div>
            </div>

            {/* Matched conditions list */}
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                Knowledge Base Condition Overlap:
              </span>
              <div className="space-y-2">
                {(selectedRecord.matched_conditions || []).map((cond, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{cond.name}</span>
                      <span className="text-slate-400 block">{cond.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{cond.match_score}%</span>
                      <span className="text-slate-400 block text-[10px]">match score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Analysis ID #{selectedRecord.id} • Latency: {selectedRecord.processing_time_ms} ms • Database: SQLite
            </div>
          </div>
        )}
      </Modal>

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Clear All History?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete all stored analysis records from the SQLite database? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
