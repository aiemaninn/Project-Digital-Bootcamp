import React, { useState } from 'react';
import { calculateStressTest, StressTestResult } from '../utils/econometricEngine';
import { SECTOR_NPL_DATA, STRESS_TEST_SCENARIOS, CURRENT_MACRO_INDICATORS } from '../data/macroprudentialData';
import { Sliders, AlertTriangle, ShieldCheck, TrendingUp, DollarSign, Activity, RotateCcw, Award } from 'lucide-react';

export const StressTestingSimulator: React.FC = () => {
  // Scenario state
  const [selectedPreset, setSelectedPreset] = useState<string>('baseline');
  const [biRateShockBps, setBiRateShockBps] = useState<number>(0);
  const [usdIdrShockPct, setUsdIdrShockPct] = useState<number>(0);
  const [gdpGrowthShockPct, setGdpGrowthShockPct] = useState<number>(0);
  const [sentimentShock, setSentimentShock] = useState<number>(0);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const scenario = STRESS_TEST_SCENARIOS.find(s => s.id === presetId);
    if (scenario) {
      setBiRateShockBps(scenario.biRateShockBps);
      setUsdIdrShockPct(scenario.usdIdrShockPct);
      setGdpGrowthShockPct(scenario.gdpGrowthShockPct);
      setSentimentShock(scenario.sentimentShock);
    }
  };

  const handleReset = () => {
    handleSelectPreset('baseline');
  };

  // Run calculation
  const result: StressTestResult = calculateStressTest(
    {
      biRateShockBps,
      usdIdrShockPct,
      gdpGrowthShockPct,
      sentimentShock,
    },
    SECTOR_NPL_DATA,
    CURRENT_MACRO_INDICATORS
  );

  return (
    <div id="stresstest-simulator" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Simulator Stress Test Makroprudensial & Manajemen Risiko</h2>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-semibold">
                PSAK 71 / IFRS 9 ECL Framework
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Simulasi transmisi guncangan suku bunga, nilai tukar, kontraksi PDB, dan sentimen kepanikan pasar terhadap kualitas portofolio kredit perbankan.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ke Baseline</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Pilih Skenario Skenario Standar Bank Indonesia & OJK:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {STRESS_TEST_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleSelectPreset(sc.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedPreset === sc.id
                    ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{sc.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">{sc.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Sliders on Left, Stressed Metrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-600" />
              <span>Parameter Shock Makro</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Sensitivitas VECM</span>
          </div>

          {/* Slider 1: BI Rate Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="slider-bi-rate" className="font-semibold text-slate-700">
                Guncangan BI-Rate (Interest Rate Shock)
              </label>
              <span className="font-mono font-bold text-blue-700">
                +{biRateShockBps} bps ({((CURRENT_MACRO_INDICATORS.biRate * 100 + biRateShockBps) / 100).toFixed(2)}%)
              </span>
            </div>
            <input
              id="slider-bi-rate"
              type="range"
              min={0}
              max={200}
              step={25}
              value={biRateShockBps}
              onChange={(e) => {
                setBiRateShockBps(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0 bps (Normal)</span>
              <span>+100 bps</span>
              <span>+200 bps (Krisis)</span>
            </div>
          </div>

          {/* Slider 2: Kurs Rupiah Depreciation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="slider-usd-idr" className="font-semibold text-slate-700">
                Pelemahan Rupiah terhadap USD
              </label>
              <span className="font-mono font-bold text-amber-700">
                +{usdIdrShockPct}% (Rp{Math.round(CURRENT_MACRO_INDICATORS.usdIdr * (1 + usdIdrShockPct / 100)).toLocaleString('id-ID')})
              </span>
            </div>
            <input
              id="slider-usd-idr"
              type="range"
              min={0}
              max={20}
              step={1}
              value={usdIdrShockPct}
              onChange={(e) => {
                setUsdIdrShockPct(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>0% (Rp16.180)</span>
              <span>+10% (Rp17.800)</span>
              <span>+20% (Rp19.400)</span>
            </div>
          </div>

          {/* Slider 3: GDP Contraction */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="slider-gdp" className="font-semibold text-slate-700">
                Perubahan Pertumbuhan PDB Tahunan
              </label>
              <span className="font-mono font-bold text-slate-800">
                {gdpGrowthShockPct > 0 ? `+${gdpGrowthShockPct}%` : `${gdpGrowthShockPct}%`} (PDB: {(CURRENT_MACRO_INDICATORS.gdpGrowth + gdpGrowthShockPct).toFixed(2)}%)
              </span>
            </div>
            <input
              id="slider-gdp"
              type="range"
              min={-2.5}
              max={0.5}
              step={0.1}
              value={gdpGrowthShockPct}
              onChange={(e) => {
                setGdpGrowthShockPct(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>-2.5% (Kontraksi Berat)</span>
              <span>-1.0%</span>
              <span>+0.5% (Ekspansi)</span>
            </div>
          </div>

          {/* Slider 4: Financial Sentiment Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="slider-sentiment" className="font-semibold text-slate-700">
                Guncangan Sentimen Berita Keuangan (NLP)
              </label>
              <span className={`font-mono font-bold ${sentimentShock < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {sentimentShock > 0 ? `+${sentimentShock.toFixed(2)}` : sentimentShock.toFixed(2)}
              </span>
            </div>
            <input
              id="slider-sentiment"
              type="range"
              min={-1.0}
              max={0.5}
              step={0.05}
              value={sentimentShock}
              onChange={(e) => {
                setSentimentShock(Number(e.target.value));
                setSelectedPreset('custom');
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>-1.0 (Kepanikan Berita)</span>
              <span>0.0 (Netral)</span>
              <span>+0.5 (Optimis)</span>
            </div>
          </div>

          {/* Methodology Callout */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
            <strong>Transmisi Ekonometrika:</strong> Model stress testing menghubungkan elastisitas empiris BI: Kenaikan +100 bps suku bunga meningkatkan NPL Gross rata-rata +15 bps dengan akselerasi tajam pada kredit konstruksi (beta 1.65x) dan UMKM (beta 1.45x).
          </div>
        </div>

        {/* Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Regulatory Warning if Breached */}
          {result.regulatoryBreach ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-sm">Peringatan Kritis: Batas Ambang NPL 5% Terlampaui!</div>
                <p className="mt-0.5">
                  NPL Gross mencapai <strong>{result.stressedNplGross}%</strong>. Diperlukan tindakan resolusi makroprudensial darurat: aktivasi pelonggaran Penyangga Likuiditas Makroprudensial (PLM) dan restrukturisasi kredit terarah.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>NPL Gross tetap di bawah ambang batas regulasi OJK (5.0%). Sistem perbankan memiliki ketahanan modal memadai.</span>
              </div>
              <span className="font-mono font-bold text-emerald-800 shrink-0">{result.stressedNplGross}% / 5.0%</span>
            </div>
          )}

          {/* Stressed KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">NPL Gross Stres</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{result.stressedNplGross}%</div>
              <span className="text-[10px] text-amber-700 font-semibold">
                Baseline: 2.23% (+{Math.round((result.stressedNplGross - 2.23) * 100)} bps)
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">NPL Net Stres</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{result.stressedNplNet}%</div>
              <span className="text-[10px] text-slate-500 font-medium">
                Benchmark &lt; 2.0%
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Loan at Risk (LaR)</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{result.stressedLar}%</div>
              <span className="text-[10px] text-slate-500 font-medium">
                Baseline: 9.85%
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">CAR Permodalan</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{result.stressedCar}%</div>
              <span className="text-[10px] text-rose-600 font-semibold">
                Erosi: -{result.capitalErosionBps} bps
              </span>
            </div>
          </div>

          {/* Provisioning Gap / CKPN Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kebutuhan Tambahan Pembentukan CKPN (ECL PSAK 71 / Stage 2 & 3 Migration):
              </span>
              <div className="text-xl font-bold text-slate-900 mt-0.5">
                Rp {result.ckpnGapTrillionIdr} Triliun
              </div>
              <p className="text-[11px] text-slate-500">
                Estimasi cadangan tambahan yang harus dibentuk bank untuk menyerap pemburukan kualitas kredit akibat skenario ini.
              </p>
            </div>
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center shrink-0">
              <span className="text-[10px] text-blue-700 uppercase font-semibold block">Bantalan Modal Bank</span>
              <span className="text-xs font-bold text-blue-900">Masih Sangat Tebal (&gt; 20%)</span>
            </div>
          </div>

          {/* Stressed Sector Breakdown Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Dampak Terhadap Tiap Sektor Ekonomi
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                    <th className="py-2 px-2.5 font-semibold">Sektor</th>
                    <th className="py-2 px-2.5 text-right font-semibold">NPL Awal</th>
                    <th className="py-2 px-2.5 text-right font-semibold">NPL Stres</th>
                    <th className="py-2 px-2.5 text-right font-semibold">Kenaikan</th>
                    <th className="py-2 px-2.5 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.sectorImpacts.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-2.5 font-medium text-slate-900">{sec.name}</td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-600">{sec.baselineNpl.toFixed(2)}%</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">{sec.stressedNpl.toFixed(2)}%</td>
                      <td className="py-2 px-2.5 text-right font-mono text-rose-600">+{sec.deltaBps} bps</td>
                      <td className="py-2 px-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          sec.status === 'Bahaya'
                            ? 'bg-rose-100 text-rose-800'
                            : sec.status === 'Siaga'
                            ? 'bg-orange-100 text-orange-800'
                            : sec.status === 'Waspada'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
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
        </div>
      </div>
    </div>
  );
};
