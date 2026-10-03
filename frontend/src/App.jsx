import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import NlpAnalysisPage from './pages/NlpAnalysisPage';
import HistoryPage from './pages/HistoryPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import AboutPage from './pages/AboutPage';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="demo" element={<DemoPage />} />
            <Route path="checker" element={<SymptomCheckerPage />} />
            <Route path="nlp-analysis" element={<NlpAnalysisPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
