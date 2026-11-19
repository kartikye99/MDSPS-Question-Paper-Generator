import React from 'react';
import LogoPlaceholder from './LogoPlaceholder';
import { Activity } from 'lucide-react';

export default function Header({ onOpenSystemStatus }) {
  return (
    <header className="bg-school-navy text-white shadow-sm border-b-2 border-school-gold/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & School Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <LogoPlaceholder className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white uppercase font-sans">
                Maharshi Dayanand Saraswati Public School
              </h1>
              <p className="text-xs text-school-gold font-medium tracking-wide">
                AI-Powered Examination Paper Generator
              </p>
            </div>
          </div>

          {/* Quick System Status Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSystemStatus}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="View Backend Health & Settings"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">System Status</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
