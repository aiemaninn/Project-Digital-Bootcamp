import React, { useState } from 'react';
import { Header } from './components/Header';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { NowcastingLab } from './components/NowcastingLab';
import { SentimentNewsEngine } from './components/SentimentNewsEngine';
import { StressTestingSimulator } from './components/StressTestingSimulator';
import { ChatbotAssistant } from './components/ChatbotAssistant';
import { EconometricMethodologyModal } from './components/EconometricMethodologyModal';
import { SECTOR_NPL_DATA, BANK_TIER_DATA } from './data/macroprudentialData';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'nowcasting' | 'sentiment' | 'stresstest' | 'chatbot'>('overview');
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <ExecutiveSummaryCards
            sectors={SECTOR_NPL_DATA}
            tiers={BANK_TIER_DATA}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'nowcasting' && (
          <NowcastingLab onOpenMethodology={() => setIsMethodologyOpen(true)} />
        )}

        {activeTab === 'sentiment' && (
          <SentimentNewsEngine />
        )}

        {activeTab === 'stresstest' && (
          <StressTestingSimulator />
        )}

        {activeTab === 'chatbot' && (
          <ChatbotAssistant />
        )}
      </main>

      {/* Floating Quick Action to AI Copilot when not on chatbot tab */}
      {activeTab !== 'chatbot' && (
        <button
          id="floating-btn-copilot"
          onClick={() => setActiveTab('chatbot')}
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-blue-500/30 flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105 cursor-pointer border border-blue-400/40"
          title="Tanya AI Risk Copilot"
        >
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span className="hidden sm:inline">Tanya AI Risk Copilot</span>
        </button>
      )}

      {/* Methodology Modal */}
      <EconometricMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Sistem Nowcasting & Manajemen Risiko Kredit Makroprudensial Bank Indonesia
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Model: MIDAS-FinBERT Ensemble</span>
            <span>•</span>
            <span>Standar: PSAK 71 / Basel III</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
