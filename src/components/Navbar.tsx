import React from 'react';
import { UserRole } from '../types';
import { Shield, Sparkles, BookOpen, Search, Cpu, Database, Smartphone, QrCode } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ruleCount: number;
  onOpenMobileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeTab,
  setActiveTab,
  ruleCount,
  onOpenMobileModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-50 shadow-md">
      {/* Top Govt Bar */}
      <div className="bg-slate-950 px-4 sm:px-8 py-1.5 border-b border-slate-800 text-[10px] sm:text-xs flex flex-wrap items-center justify-between gap-2 text-slate-400 uppercase tracking-wider font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Govt of India</span>
          <span className="text-slate-700">•</span>
          <span className="hidden md:inline text-slate-400">Min. of Consumer Affairs</span>
          <span className="text-slate-700 hidden md:inline">•</span>
          <span className="text-amber-500">Legal Metrology Division (PCR 2011)</span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenMobileModal && (
            <button
              onClick={onOpenMobileModal}
              className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition cursor-pointer text-[10px]"
              title="Open QR Code to use on Mobile Phone"
            >
              <Smartphone className="w-2.5 h-2.5" />
              <span>Mobile QR</span>
            </button>
          )}
          <span className="text-xs text-slate-500 uppercase tracking-widest hidden sm:inline">
            Scan Session ID: <span className="text-amber-400">LM-90122-PX</span>
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            Rules: <span className="text-amber-400 font-bold">{ruleCount} Active</span>
          </span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand with Geometric Amber Block */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20 shrink-0">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-white flex items-center">
                Metrology AI
                <span className="text-slate-500 font-normal ml-2 text-xs uppercase tracking-widest hidden sm:inline">
                  / Field Analysis
                </span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Statutory Packaged Commodities Compliance &amp; Compounding Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Geometric Balance */}
        <nav className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('inspect')}
            className={`px-3.5 py-2 rounded font-medium transition flex items-center gap-1.5 text-xs ${
              activeTab === 'inspect'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Field Analysis
          </button>

          <button
            onClick={() => setActiveTab('overcharge')}
            className={`px-3.5 py-2 rounded font-medium transition flex items-center gap-1.5 text-xs ${
              activeTab === 'overcharge'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Overcharge Check
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-2 rounded font-medium transition flex items-center gap-1.5 text-xs ${
              activeTab === 'rules'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Rule Engine
          </button>

          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3.5 py-2 rounded font-medium transition flex items-center gap-1.5 text-xs ${
              activeTab === 'dataset'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Dataset (22)
          </button>

          <button
            onClick={() => setActiveTab('e2e')}
            className={`px-3.5 py-2 rounded font-medium transition flex items-center gap-1.5 text-xs ${
              activeTab === 'e2e'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Pipeline Test
          </button>
        </nav>

        {/* RBAC Role Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <div className="text-[11px] text-slate-500 pl-2 font-mono uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-500" />
            <span className="hidden sm:inline">Role:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentRole('field_officer')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                currentRole === 'field_officer'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Field Inspector - Can scan packages and generate notices"
            >
              Field Insp.
            </button>

            <button
              onClick={() => setCurrentRole('supervisor')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                currentRole === 'supervisor'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Legal Supervisor - Can approve notices and sign compounding orders"
            >
              Supervisor
            </button>

            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                currentRole === 'admin'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Chief Metrology Admin - Can edit statutory rules and adjust penalty slabs"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

