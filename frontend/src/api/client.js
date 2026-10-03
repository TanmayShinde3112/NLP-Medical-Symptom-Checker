import axios from 'axios';

// Backend base URL (can be customized via VITE_API_URL or defaults to localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const api = {
  // Health
  checkHealth: async () => {
    const res = await apiClient.get('/api/health');
    return res.data;
  },

  // Dashboard Stats
  getStats: async () => {
    const res = await apiClient.get('/api/stats');
    return res.data;
  },

  // Symptom Analysis (Main Chat)
  analyzeSymptoms: async (text) => {
    const res = await apiClient.post('/api/analyze', { text });
    return res.data;
  },

  // Interactive NLP pipeline processing (Sandbox)
  processNlpPipeline: async (text) => {
    const res = await apiClient.post('/api/nlp/process', { text });
    return res.data;
  },

  // History
  getHistory: async (limit = 50) => {
    const res = await apiClient.get(`/api/history?limit=${limit}`);
    return res.data;
  },

  getHistoryDetail: async (id) => {
    const res = await apiClient.get(`/api/history/${id}`);
    return res.data;
  },

  deleteHistoryItem: async (id) => {
    const res = await apiClient.delete(`/api/history/${id}`);
    return res.data;
  },

  clearAllHistory: async () => {
    const res = await apiClient.delete('/api/history');
    return res.data;
  },

  exportHistoryUrl: (format = 'csv') => {
    return `${API_BASE_URL}/api/history/export?format=${format}`;
  },

  // Knowledge Base
  getKnowledgeBase: async (category = null, search = null) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const res = await apiClient.get(`/api/knowledge-base?${params.toString()}`);
    return res.data;
  },

  getConditionDetail: async (conditionName) => {
    const res = await apiClient.get(`/api/knowledge-base/${encodeURIComponent(conditionName)}`);
    return res.data;
  },
};

export default apiClient;
