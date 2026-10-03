import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { api } from '../../api/client';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [checkingApi, setCheckingApi] = useState(false);

  const checkConnection = async () => {
    setCheckingApi(true);
    try {
      await api.checkHealth();
      setApiConnected(true);
    } catch {
      setApiConnected(false);
    } finally {
      setCheckingApi(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Re-check backend health periodically every 15s
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        apiConnected={apiConnected}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Backend Disconnected Banner */}
        {!apiConnected && (
          <div className="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/30 px-4 py-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>
                Unable to connect to the NLP server (http://localhost:8000). Please make sure the backend is running.
              </span>
            </div>
            <button
              onClick={checkConnection}
              disabled={checkingApi}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-xs"
            >
              <RefreshCw className={`w-3 h-3 ${checkingApi ? 'animate-spin' : ''}`} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mandatory Academic Disclaimer Footer */}
        <Footer />
      </div>
    </div>
  );
}
