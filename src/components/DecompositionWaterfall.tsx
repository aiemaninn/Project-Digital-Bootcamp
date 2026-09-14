import React from "react";
import { FactorDecomposition } from "../types";
import { ArrowUpRight, ArrowDownRight, Minus, PieChart, Layers } from "lucide-react";

interface DecompositionProps {
  factors: FactorDecomposition[];
  totalDeltaBps: number;
}

export const DecompositionWaterfall: React.FC<DecompositionProps> = ({ factors, totalDeltaBps }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Dekomposisi Ekonometrika: Kontributor Perubahan NPL
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Total Deviasi: {totalDeltaBps > 0 ? `+${totalDeltaBps}` : totalDeltaBps} bps
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown sensitivitas empiris masing-masing variabel makroprudensial dan sentimen berita terhadap baki NPL
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {factors.map((factor) => {
          const isUp = factor.contributionBps > 0;
          const isDown = factor.contributionBps < 0;

          return (
            <div
              key={factor.name}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isUp ? "bg-rose-500" : isDown ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {factor.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-slate-400 font-mono">Porsi Bobot: {factor.percentage}%</span>
                  <span
                    className={`inline-flex items-center font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      isUp
                        ? "bg-rose-100 text-rose-800"
                        : isDown
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isUp && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                    {isDown && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
                    {factor.contributionBps > 0 ? `+${factor.contributionBps}` : factor.contributionBps} bps
                  </span>
                </div>
              </div>

              {/* Visual contribution bar */}
              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden my-1.5 flex">
                <div
                  className={`h-full transition-all duration-300 ${
                    isUp ? "bg-rose-500 ml-auto" : isDown ? "bg-emerald-500 mr-auto" : "bg-slate-400"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, factor.percentage))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-1">
                {factor.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
