import React from 'react';
import { Sparkles, Key, AlertTriangle, X, Check, Copy } from 'lucide-react';

export default function ApiKeyNoticeModal({ isOpen, onClose, uploadData }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyConfigText = () => {
    navigator.clipboard.writeText('GEMINI_API_KEY=your_key_here');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-white" />
            <h3 className="font-bold text-sm sm:text-base">
              Google Gemini API Key Required
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                {uploadData?.filesReceived?.length || 'Your'} handwritten draft page(s) were received successfully!
              </p>
              <p className="mt-1 text-amber-800 text-xs leading-relaxed">
                However, AI recognition for English and Hindi (Devanagari) handwriting requires a Google Gemini Vision API key to transcribe and structure questions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quick Setup (Takes 1 Minute):
            </h4>
            
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Get your free Gemini API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-school-accent font-semibold underline hover:text-school-navy"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Open the file <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">server/.env</code> in your project root.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div className="flex-1">
                  <p>Add your API key:</p>
                  <div className="mt-1 flex items-center justify-between bg-slate-900 text-slate-100 p-2 rounded-lg font-mono text-[11px]">
                    <span>GEMINI_API_KEY=your_key_here</span>
                    <button
                      type="button"
                      onClick={copyConfigText}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy syntax"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-school-navy text-white rounded-lg hover:bg-school-accent transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
