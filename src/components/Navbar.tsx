import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, Sparkles, BookOpen, Search, Cpu, Database, Smartphone } from 'lucide-react';

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
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleFontSizeChange = (level: 'sm' | 'md' | 'lg') => {
    setFontSizeLevel(level);
    const root = document.documentElement;
    if (level === 'sm') root.style.fontSize = '14px';
    else if (level === 'md') root.style.fontSize = '16px';
    else if (level === 'lg') root.style.fontSize = '18px';
  };

  return (
    <header className="bg-white border-b border-gray-200 text-slate-800 sticky top-0 z-50 shadow-sm">
      {/* 1. National Tricolor Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 2. Top GIGW Accessibility & Govt Bar */}
      <div className="bg-[#002244] text-white px-4 sm:px-8 py-1.5 text-[11px] flex flex-wrap items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-2.5 text-slate-300">
          <a
            href="#main-content"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-[#FF9933] px-1 rounded text-slate-300 hover:text-white"
          >
            Skip to Main Content
          </a>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">Screen Reader Access</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-200 font-medium">भारत सरकार</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200">Government of India</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Text Size Controls (A- / A / A+) */}
          <div className="flex items-center border border-slate-700 rounded bg-[#001830] px-1 py-0.5 text-[10px] font-medium">
            <button
              onClick={() => handleFontSizeChange('sm')}
              className={`px-1.5 py-0.5 rounded transition ${fontSizeLevel === 'sm' ? 'bg-[#FF9933] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Decrease text size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSizeChange('md')}
              className={`px-1.5 py-0.5 rounded transition ${fontSizeLevel === 'md' ? 'bg-[#FF9933] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSizeChange('lg')}
              className={`px-1.5 py-0.5 rounded transition ${fontSizeLevel === 'lg' ? 'bg-[#FF9933] text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              title="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center text-[10px] font-medium">
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded ${lang === 'en' ? 'text-[#FF9933] font-bold underline' : 'text-slate-300 hover:text-white'}`}
            >
              English
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setLang('hi')}
              className={`px-1.5 py-0.5 rounded ${lang === 'hi' ? 'text-[#FF9933] font-bold underline' : 'text-slate-300 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          {onOpenMobileModal && (
            <button
              onClick={onOpenMobileModal}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 flex items-center gap-1.5 transition cursor-pointer text-[11px]"
              title="Open QR Code to use on Mobile Phone"
            >
              <Smartphone className="w-3 h-3 text-[#FF9933]" />
              <span>Mobile QR</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Official Ministry Header with Ashoka Emblem Placeholder */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Ministry Stack & State Emblem */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Ashoka Emblem Placeholder */}
            <div className="w-10 h-13 shrink-0 flex flex-col items-center justify-center border border-gray-200 rounded p-1 bg-slate-50 text-slate-700 shadow-2xs" title="State Emblem of India">
              <svg viewBox="0 0 24 32" className="w-7 h-9 text-[#003366] fill-current" aria-label="National Emblem of India">
                <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 5.5 10 6.2 10.8 6.7C9.2 7.2 8 8.7 8 10.5C8 12.5 9.5 14 11.5 14.2V17H8.5C7.7 17 7 17.7 7 18.5V19.5H17V18.5C17 17.7 16.3 17 15.5 17H12.5V14.2C14.5 14 16 12.5 16 10.5C16 8.7 14.8 7.2 13.2 6.7C14 6.2 14.5 5.5 14.5 4.5C14.5 3 13.5 2 12 2ZM12 21C8.7 21 6 23.7 6 27H18C18 23.7 15.3 21 12 21ZM10 28H14V29H10V28Z" />
              </svg>
              <span className="text-[7px] font-serif text-slate-600 uppercase font-bold mt-0.5">सत्यमेव जयते</span>
            </div>

            {/* Ministry Text Stack */}
            <div className="leading-snug">
              <div className="text-[12px] font-bold text-slate-900">
                उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय
              </div>
              <div className="text-[12px] font-semibold text-[#003366]">
                Ministry of Consumer Affairs, Food &amp; Public Distribution
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span>Department of Consumer Affairs</span>
                <span className="w-px h-3 bg-gray-300" aria-hidden="true" />
                <span className="text-slate-700">Legal Metrology Division</span>
              </div>
            </div>
          </div>

          {/* Right Brand: Clean Maanak Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#003366] text-white rounded-md flex items-center justify-center font-bold text-lg shrink-0">
              M
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                Maanak
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Legal Metrology Compliance Portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Navigation Tabs & Officer Role Selector */}
      <div className="bg-[#003366] text-white px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto py-0.5">
            <button
              onClick={() => setActiveTab('inspect')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                activeTab === 'inspect'
                  ? 'bg-white text-[#003366] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              Field Inspection
            </button>

            <button
              onClick={() => setActiveTab('overcharge')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                activeTab === 'overcharge'
                  ? 'bg-white text-[#003366] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#FF9933]" />
              Overcharge Check
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-white text-[#003366] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
              Rule Engine ({ruleCount})
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                activeTab === 'dataset'
                  ? 'bg-white text-[#003366] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#FF9933]" />
              Commodity Library (22)
            </button>

            <button
              onClick={() => setActiveTab('e2e')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer ${
                activeTab === 'e2e'
                  ? 'bg-white text-[#003366] font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#FF9933]" />
              Pipeline Tests
            </button>
          </nav>

          {/* Officer Role Selector */}
          <div className="flex items-center gap-2 bg-[#002244] px-2.5 py-1 rounded-md border border-blue-900/60">
            <div className="text-[11px] text-slate-300 font-sans flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#FF9933]" />
              <span className="hidden sm:inline">Role:</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentRole('field_officer')}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  currentRole === 'field_officer'
                    ? 'bg-[#FF9933] text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Field Inspector - Inspect packages, extract declarations, and issue notices"
              >
                Field Insp.
              </button>

              <button
                onClick={() => setCurrentRole('supervisor')}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  currentRole === 'supervisor'
                    ? 'bg-[#FF9933] text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Legal Supervisor - Approve notices and compounding orders"
              >
                Supervisor
              </button>

              <button
                onClick={() => setCurrentRole('admin')}
                className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-[#FF9933] text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Chief Metrology Admin - Configure statutory rules and penalty slabs"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

