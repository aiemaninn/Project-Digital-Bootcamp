import React, { useState } from "react";
import { NowcastSummary, MacroScenario } from "../types";
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldAlert, FileText } from "lucide-react";

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: NowcastSummary;
  scenario: MacroScenario;
  generatedReportText: string | null;
  isGenerating: boolean;
  onGenerateReport: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  summary,
  scenario,
  generatedReportText,
  isGenerating,
  onGenerateReport,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (generatedReportText) {
      navigator.clipboard.writeText(generatedReportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Laporan Kajian Stabilitas Keuangan & Nowcast NPL</h3>
              <p className="text-xs text-slate-300">
                Dokumen Ringkasan Eksekutif untuk Komite Manajemen Risiko & Regulator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans">
          {/* Executive Stats Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Nowcast NPL Gross</span>
              <span className="text-base font-bold text-blue-700">{summary.nowcastGrossNpl.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Status Risiko</span>
              <span className="text-xs font-bold text-slate-800">{summary.riskStatus}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Sentimen Berita (NSI)</span>
              <span className={`text-base font-bold ${scenario.sentimentIndex < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                {scenario.sentimentIndex > 0 ? `+${scenario.sentimentIndex.toFixed(2)}` : scenario.sentimentIndex.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">BI-Rate / Kurs</span>
              <span className="text-xs font-bold text-slate-700">
                {scenario.biRate}% / Rp {scenario.kursUsdIdr.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* AI Generated Content or Button to generate */}
          {isGenerating ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-700">
                Sedang memproses Laporan Eksekutif Makroprudensial menggunakan Gemini 3.8 Flash...
              </p>
              <p className="text-xs text-slate-400">
                Mensintesis hasil dekomposisi ekonometrika, elastisitas sektoral, dan rekomendasi mitigasi risiko
              </p>
            </div>
          ) : generatedReportText ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans">
                {generatedReportText}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <p className="text-slate-600 max-w-md mx-auto text-xs sm:text-sm">
                Klik tombol di bawah untuk menghasilkan laporan kajian eksekutif resmi berbasis model ekonometrika dan sentimen berita keuangan terkini.
              </p>
              <button
                onClick={onGenerateReport}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hasilkan Laporan Kajian Stabilitas Keuangan AI</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Klasifikasi: Internal Makroprudensial & Manajemen Risiko Perbankan
          </span>

          <div className="flex items-center space-x-2">
            {generatedReportText && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
                  <span>{copied ? "Tersalin" : "Salin Teks"}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
