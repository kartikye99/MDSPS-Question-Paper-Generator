import React, { useState, useEffect } from 'react';
import { X, Server, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function SystemStatusModal({ isOpen, onClose }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to fetch health status:', err);
      setError(err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-school-navy text-white px-6 py-4 flex items-center justify-between border-b-2 border-school-gold">
          <div className="flex items-center space-x-2.5">
            <Server className="w-5 h-5 text-school-gold" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">System & API Status</h3>
              <p className="text-[11px] text-slate-300">MDSPS Question Paper Generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {loading && !health && (
            <div className="flex items-center justify-center py-8 text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mr-2 text-school-gold" />
              <span className="text-sm">Connecting to server diagnostic...</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-red-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-red-800">Backend Server Offline</p>
                <p className="text-red-700 mt-0.5">{error}</p>
                <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-1.5 rounded">
                  Run: npm run dev:server
                </p>
              </div>
            </div>
          )}

          {health && (
            <div className="space-y-3">
              {/* Server State */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-700">Backend Server</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-slate-600 font-medium">Running on Port 5000 (Uptime: {health.uptime})</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                  200 OK
                </span>
              </div>

              {/* Gemini Vision API State */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-school-gold" />
                    <p className="text-xs font-semibold text-slate-700">Google Gemini Vision OCR</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      health.services?.geminiVision === 'configured'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {health.services?.geminiVision === 'configured' ? 'Active' : 'Key Needed'}
                  </span>
                </div>

                {health.services?.geminiVision === 'configured' ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Google Gemini API key is configured. Handwritten recognition in English and Hindi is active.
                  </p>
                ) : (
                  <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-700" />
                      How to configure your API key:
                    </p>
                    <ol className="list-decimal list-inside text-amber-800 text-[11px] space-y-0.5 pl-1">
                      <li>Get a key from <span className="font-mono underline">https://aistudio.google.com/</span></li>
                      <li>Open <span className="font-mono bg-amber-100 px-1 rounded">server/.env</span> in project root</li>
                      <li>Set <span className="font-mono bg-amber-100 px-1 rounded">GEMINI_API_KEY=your_key</span></li>
                    </ol>
                  </div>
                )}
              </div>

              {/* School Details */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Institution: <strong>{health.school?.name}</strong></span>
                <span className="font-mono">{health.version}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-school-navy"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-school-navy text-white rounded-lg hover:bg-school-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
