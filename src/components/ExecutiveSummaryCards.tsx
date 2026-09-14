import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { SectorNPL, BankTierMetric } from '../types/npl';

interface ExecutiveSummaryCardsProps {
  sectors: SectorNPL[];
  tiers: BankTierMetric[];
  onNavigateTab: (tab: 'nowcasting' | 'sentiment' | 'stresstest' | 'chatbot') => void;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({
  sectors,
  tiers,
  onNavigateTab,
}) => {
  const vulnerableSectors = sectors.filter(s => s.status === 'Waspada' || s.status === 'Siaga');

  return (
    <div id="executive-summary-section" className="space-y-6">
      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: NPL Gross & Nowcast */}
        <div id="card-npl-gross" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">NPL Gross Perbankan</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Di Bawah Batas 5% OJK
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">2.18%</span>
            <span className="text-xs text-slate-500">Aktual Q4 2024</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500">Nowcast Q1 2025: </span>
              <strong className="text-blue-700 font-bold">2.23%</strong>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +5 bps
            </span>
          </div>
        </div>

        {/* Card 2: NPL Net */}
        <div id="card-npl-net" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">NPL Net (Setelah CKPN)</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Sehat
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">0.78%</span>
            <span className="text-xs text-slate-500">Benchmark &lt; 2.0%</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500">Nowcast Q1 2025: </span>
              <strong className="text-emerald-700 font-bold">0.80%</strong>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="h-3 w-3 mr-0.5" /> Stabil
            </span>
          </div>
        </div>

        {/* Card 3: Loan at Risk (LaR) */}
        <div id="card-lar" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Loan at Risk (LaR)</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Tren Membaik
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">9.85%</span>
            <span className="text-xs text-slate-500">Kol 2 + Restruktur</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500">Puncak Pandemi: </span>
              <strong className="text-slate-600">18.6%</strong>
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="h-3 w-3 mr-0.5" /> -120 bps yoy
            </span>
          </div>
        </div>

        {/* Card 4: CKPN Coverage & CAR */}
        <div id="card-ckpn-coverage" className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Bantalan Modal & CKPN</span>
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Sangat Kuat
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">148.5%</span>
            <span className="text-xs text-slate-500">Coverage Ratio</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-500">CAR Perbankan: </span>
              <strong className="text-slate-800 font-bold">26.8%</strong>
            </div>
            <span className="text-xs text-indigo-700 font-medium">
              Basel III Ready
            </span>
          </div>
        </div>
      </div>

      {/* Warning Bar / Early Warning Callout */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Early Warning System (EWS) Makroprudensial:</span>
              <span className="text-xs bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded">
                2 Sektor Dalam Pengawasan Khusus
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Sektor <strong>Konstruksi (NPL 3.84%, Nowcast 3.91%)</strong> dan <strong>UMKM (NPL 3.65%, Nowcast 3.72%)</strong> menunjukkan sensitivitas tinggi terhadap siklus pemulihan arus kas dan suku bunga pinjaman.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-nav-stresstest"
            onClick={() => onNavigateTab('stresstest')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Uji Stress Test Sektoral
          </button>
          <button
            id="btn-nav-chatbot"
            onClick={() => onNavigateTab('chatbot')}
            className="px-3 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Tanya AI Copilot
          </button>
        </div>
      </div>

      {/* Two Column Grid: Sectoral Breakdown + KBMI Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sectoral NPL Table & Progress (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Distribusi Kualitas Kredit per Sektor Ekonomi</h2>
              <p className="text-xs text-slate-500">Perbandingan NPL terkini, hasil nowcast Q1 2025, dan rasio Loan at Risk (LaR)</p>
            </div>
            <button
              onClick={() => onNavigateTab('nowcasting')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Lihat Detail Lab &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 font-semibold">Sektor Ekonomi</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Pangsa</th>
                  <th className="py-2.5 px-3 font-semibold text-right">NPL Aktual</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Nowcast Q1</th>
                  <th className="py-2.5 px-3 font-semibold text-right">LaR (%)</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status EWS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectors.map((sec) => (
                  <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div>{sec.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate max-w-xs">{sec.keyRiskDriver}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                      {sec.shareOfCredit}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                      {sec.currentNpl.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">
                      {sec.nowcastNpl.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {sec.lar.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        sec.status === 'Bahaya'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : sec.status === 'Siaga'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : sec.status === 'Waspada'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {sec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Banking Tier (KBMI 1 - 4) Resilience (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Profil Risiko Berdasarkan Kelompok Bank (KBMI)</h2>
                <p className="text-xs text-slate-500">Ketahanan modal (CAR) & CKPN coverage terhadap risiko NPL</p>
              </div>
            </div>

            <div className="space-y-3 mt-3">
              {tiers.map((t) => (
                <div key={t.tier} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{t.tier}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({t.capitalMin})</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      NPL Gross: {t.nplGross}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-slate-600 block text-[10px]">NPL Net</span>
                      <span className="font-mono font-semibold text-slate-800">{t.nplNet}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px]">CAR Modal</span>
                      <span className="font-mono font-semibold text-slate-800">{t.car}%</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px]">CKPN Coverage</span>
                      <span className={`font-mono font-semibold ${t.ckpnCoverage < 100 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {t.ckpnCoverage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
            <div className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Kesimpulan Makroprudensial Bank Indonesia:</span>
            </div>
            <p className="mt-1 text-slate-700 text-[11px]">
              Ketahanan sistem perbankan nasional terjaga dengan sangat baik. KBMI 4 memegang 58% aset perbankan dengan CKPN coverage 215%, menjadi jangkar stabilitas sistem keuangan (SSK).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
