import React from "react";
import { SectorNplData, BankClusterNplData } from "../types";
import { Building2, Landmark, AlertTriangle, ShieldCheck, TrendingUp, Info } from "lucide-react";

interface SectoralHeatmapProps {
  sectors: SectorNplData[];
  clusters: BankClusterNplData[];
}

export const SectoralHeatmap: React.FC<SectoralHeatmapProps> = ({ sectors, clusters }) => {
  return (
    <div className="space-y-6">
      {/* 1. Sektor Riil Breakdown */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Matriks Kerentanan Kredit Sektoral (Nowcasting Sektor Riil)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sensitivitas masing-masing sektor ekonomi terhadap guncangan makroekonomi dan sentimen berita keuangan
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Total Pangsa Kredit: 100% Portofolio Industri
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Sektor Ekonomi</th>
                <th className="py-3 px-3">Pangsa Kredit</th>
                <th className="py-3 px-3">NPL Baseline</th>
                <th className="py-3 px-3">Nowcast NPL</th>
                <th className="py-3 px-3">Deviasi</th>
                <th className="py-3 px-3">Tingkat Risiko</th>
                <th className="py-3 px-3">Saluran Transmisi Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {sectors.map((s) => {
                let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
                if (s.riskCategory === "Tinggi") {
                  badgeClass = "bg-rose-100 text-rose-800 border-rose-300 font-bold";
                } else if (s.riskCategory === "Waspada") {
                  badgeClass = "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
                } else if (s.riskCategory === "Moderat") {
                  badgeClass = "bg-blue-100 text-blue-800 border-blue-300";
                }

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {s.sector}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {s.creditSharePct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {s.currentNpl.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {s.nowcastNpl.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span
                        className={`font-semibold ${
                          s.deltaBps > 0 ? "text-rose-600" : s.deltaBps < 0 ? "text-emerald-600" : "text-slate-500"
                        }`}
                      >
                        {s.deltaBps > 0 ? `+${s.deltaBps}` : s.deltaBps} bps
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${badgeClass}`}>
                        {s.riskCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] max-w-xs leading-snug">
                      {s.transmissionChannel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Profil Kelompok Bank KBMI */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-indigo-600" />
              Profil Ketahanan Kredit Berdasarkan Klaster Bank (KBMI 1 - 4 & BPD)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi penyangga modal (CAR), cakupan pencadangan (CKPN), dan Loan at Risk (LaR)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((c) => (
            <div
              key={c.cluster}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-none"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {c.cluster}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  CAR: <strong className="text-slate-700">{c.capitalAdequacyRatio}%</strong>
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">{c.displayName}</h4>
              <p className="text-[11px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nowcast Gross NPL:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {c.nowcastGrossNpl.toFixed(2)}%
                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                      (Base: {c.currentGrossNpl}%)
                    </span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nowcast Net NPL:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {c.netNpl.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Loan at Risk (LaR):</span>
                  <span className="font-mono font-semibold text-amber-700">
                    {c.larRatio.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Cakupan CKPN:</span>
                  <span className="font-mono font-semibold text-blue-700">
                    {c.ckpnCoverage.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
