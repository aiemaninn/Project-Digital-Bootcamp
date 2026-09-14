import React from "react";
import { NowcastSummary, MacroScenario } from "../types";
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck, Newspaper, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardsProps {
  summary: NowcastSummary;
  scenario: MacroScenario;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary, scenario }) => {
  const isUp = summary.deltaBps > 0;
  const isDown = summary.deltaBps < 0;

  // Regulatory threshold colors
  let statusBadgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  if (summary.riskStatus === "Pelanggaran Ambang Batas") {
    statusBadgeColor = "bg-red-100 text-red-800 border-red-300 animate-pulse";
    statusIcon = <AlertTriangle className="w-4 h-4 text-red-600" />;
  } else if (summary.riskStatus === "Perhatian Khusus") {
    statusBadgeColor = "bg-orange-100 text-orange-800 border-orange-300";
    statusIcon = <AlertTriangle className="w-4 h-4 text-orange-600" />;
  } else if (summary.riskStatus === "Waspada Moderat") {
    statusBadgeColor = "bg-amber-100 text-amber-800 border-amber-300";
    statusIcon = <Activity className="w-4 h-4 text-amber-600" />;
  }

  // Sentiment bar percentage (-1.0 to 1.0 mapped to 0 to 100%)
  const sentimentPct = Math.round(((scenario.sentimentIndex + 1) / 2) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Nowcasted Gross NPL */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Nowcast Gross NPL ({summary.currentQuarter.split(" ")[0]})
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeColor}`}>
            {statusIcon}
            <span>{summary.riskStatus}</span>
          </span>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
            {summary.nowcastGrossNpl.toFixed(2)}%
          </span>
          <div className="flex items-center text-xs font-semibold">
            {isUp && (
              <span className="text-rose-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{summary.deltaBps} bps
              </span>
            )}
            {isDown && (
              <span className="text-emerald-600 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />{summary.deltaBps} bps
              </span>
            )}
            {!isUp && !isDown && (
              <span className="text-slate-500 flex items-center">
                <Minus className="w-3.5 h-3.5" />0 bps
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-500 flex justify-between items-center pt-2 border-t border-slate-100">
          <span>95% CI: <strong className="font-mono text-slate-700">{summary.ci95[0]}% - {summary.ci95[1]}%</strong></span>
          <span className="text-[11px] text-slate-400">Baseline OJK: {summary.officialLastNpl}%</span>
        </div>

        {/* Progress bar towards 5.0% threshold */}
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              summary.nowcastGrossNpl >= 5.0
                ? "bg-rose-600"
                : summary.nowcastGrossNpl >= 3.5
                ? "bg-orange-500"
                : summary.nowcastGrossNpl >= 2.5
                ? "bg-amber-500"
                : "bg-blue-600"
            }`}
            style={{ width: `${Math.min(100, (summary.nowcastGrossNpl / 5.0) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0%</span>
          <span className="text-rose-600 font-semibold">Batas Aman BI: 2.5% | Ambang Regulator: 5.0%</span>
        </div>
      </div>

      {/* 2. Nowcasted Net NPL & CKPN */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Nowcast Net NPL & Pencadangan
          </span>
          <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
            {summary.nowcastNetNpl.toFixed(2)}%
          </span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            Sehat (&lt; 1.5%)
          </span>
        </div>

        <div className="mt-2 text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Rasio CKPN Coverage:</span>
            <span className="font-semibold font-mono text-slate-800">224.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Loan at Risk (LaR):</span>
            <span className="font-semibold font-mono text-slate-800">9.38% (Single Digit)</span>
          </div>
        </div>
      </div>

      {/* 3. News Sentiment Index (Deep Learning High Frequency) */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Indeks Sentimen Berita (NSI)
          </span>
          <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
            <Newspaper className="w-4 h-4" />
          </span>
        </div>

        <div className="flex items-baseline space-x-2 my-1">
          <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${
            scenario.sentimentIndex < -0.2 ? "text-amber-600" : scenario.sentimentIndex > 0.2 ? "text-emerald-600" : "text-slate-800"
          }`}>
            {scenario.sentimentIndex > 0 ? `+${scenario.sentimentIndex.toFixed(2)}` : scenario.sentimentIndex.toFixed(2)}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {scenario.sentimentIndex < -0.4
              ? "Tekanan Signifikan"
              : scenario.sentimentIndex < 0
              ? "Waspada / Netral-Negatif"
              : scenario.sentimentIndex > 0.4
              ? "Optimis Tinggi"
              : "Positif"}
          </span>
        </div>

        {/* Sentiment Spectrum Bar */}
        <div className="mt-2.5">
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
            <span className="text-rose-600">Bearish (-1.0)</span>
            <span className="text-slate-500">Netral (0.0)</span>
            <span className="text-emerald-600">Bullish (+1.0)</span>
          </div>
          <div className="w-full bg-gradient-to-r from-rose-500 via-amber-300 to-emerald-500 h-2 rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-slate-900 rounded-full shadow-md transition-all duration-300"
              style={{ left: `calc(${sentimentPct}% - 7px)` }}
            />
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 pt-1.5 flex justify-between">
          <span>Dampak NPL dari Sentimen:</span>
          <span className={`font-mono font-bold ${summary.sentimentContributionBps > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {summary.sentimentContributionBps > 0 ? `+${summary.sentimentContributionBps}` : summary.sentimentContributionBps} bps
          </span>
        </div>
      </div>

      {/* 4. Bank Indonesia Macroprudential Stance */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Instrumen Makroprudensial BI
          </span>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            Pro-Growth & Stability
          </span>
        </div>

        <div className="space-y-1.5 mt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">BI-Rate:</span>
            <span className="font-mono font-bold text-slate-900">{scenario.biRate.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Countercyclical Buffer (CCyB):</span>
            <span className="font-mono font-bold text-slate-900">0.0% (Netral)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Rasio Intermediasi (RIM):</span>
            <span className="font-mono font-bold text-emerald-600">88.2% (Target 84-94%)</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Insentif Likuiditas (KLM):</span>
            <span className="font-mono font-bold text-blue-600">Hingga 4.0% DPK</span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 flex items-center justify-between">
          <span>Stance Kebijakan:</span>
          <span className="font-semibold text-slate-700">Akomodatif Terarah</span>
        </div>
      </div>
    </div>
  );
};
