import React from 'react';
import { ShieldAlert, Cpu, TrendingUp, Sparkles, AlertTriangle, Landmark, BarChart3, Newspaper, Sliders, MessageSquare } from 'lucide-react';
import { CURRENT_MACRO_INDICATORS } from '../data/macroprudentialData';

interface HeaderProps {
  activeTab: 'overview' | 'nowcasting' | 'sentiment' | 'stresstest' | 'chatbot';
  setActiveTab: (tab: 'overview' | 'nowcasting' | 'sentiment' | 'stresstest' | 'chatbot') => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenMethodology }) => {
  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner / Ticker */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Nowcast Q1 2025: <strong>2.23%</strong> (95% CI: 2.14% - 2.32%)</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span>BI-Rate: <strong className="text-slate-200">{CURRENT_MACRO_INDICATORS.biRate.toFixed(2)}%</strong></span>
            <span>USD/IDR: <strong className="text-slate-200">{CURRENT_MACRO_INDICATORS.usdIdr.toLocaleString('id-ID')}</strong></span>
            <span>Pertumbuhan Kredit: <strong className="text-emerald-400">+{CURRENT_MACRO_INDICATORS.creditGrowth}% yoy</strong></span>
            <span>Pertumbuhan PDB: <strong className="text-slate-200">+{CURRENT_MACRO_INDICATORS.gdpGrowth}%</strong></span>
            <span>FSI Sentimen Berita: <strong className="text-cyan-400">+{CURRENT_MACRO_INDICATORS.fsiScore} (Optimis)</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto text-xs">
          <button
            id="btn-open-methodology"
            onClick={onOpenMethodology}
            className="text-slate-300 hover:text-white transition-colors underline decoration-slate-600 hover:decoration-cyan-400 cursor-pointer text-xs"
          >
            Metodologi MIDAS & FinBERT
          </button>
          <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/50 text-blue-300 font-mono text-[11px]">
            BI Macroprudential Framework
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
            <Landmark className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                NPL Nowcast & Risk Analytics
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Deep Learning + Ekonometrika
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform Manajemen Risiko Kredit Perbankan & Kebijakan Makroprudensial Bank Indonesia
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="nav-tabs" className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium self-stretch md:self-auto overflow-x-auto">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Ringkasan Eksekutif</span>
          </button>

          <button
            id="tab-nowcasting"
            onClick={() => setActiveTab('nowcasting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'nowcasting'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Nowcast & Ekonometrika</span>
          </button>

          <button
            id="tab-sentiment"
            onClick={() => setActiveTab('sentiment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sentiment'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Sentimen Berita (Deep Learning)</span>
          </button>

          <button
            id="tab-stresstest"
            onClick={() => setActiveTab('stresstest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stresstest'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Stress Test Makro</span>
          </button>

          <button
            id="tab-chatbot"
            onClick={() => setActiveTab('chatbot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chatbot'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-cyan-400 hover:text-cyan-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <span>AI Risk Copilot</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
