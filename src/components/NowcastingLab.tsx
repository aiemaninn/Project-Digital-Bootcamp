import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, ComposedChart, ReferenceLine } from 'recharts';
import { NPL_TIMESERIES } from '../data/macroprudentialData';
import { MODEL_PERFORMANCE_METRICS } from '../utils/econometricEngine';
import { Check, Info, TrendingUp, Sparkles, Layers, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface NowcastingLabProps {
  onOpenMethodology: () => void;
}

export const NowcastingLab: React.FC<NowcastingLabProps> = ({ onOpenMethodology }) => {
  const [showHybrid, setShowHybrid] = useState(true);
  const [showMidas, setShowMidas] = useState(true);
  const [showDfm, setShowDfm] = useState(false);
  const [showDeepLearning, setShowDeepLearning] = useState(false);
  const [showCiBand, setShowCiBand] = useState(true);
  const [activeHorizon, setActiveHorizon] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');

  // Format tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-sm text-slate-100 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{label}</span>
            {dataPoint.isNowcast && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                Nowcast
              </span>
            )}
            {dataPoint.isForecast && (
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                Forecast
              </span>
            )}
          </div>
          {dataPoint.actualNpl !== null && (
            <div className="flex justify-between text-slate-200">
              <span className="text-slate-400">NPL Aktual OJK:</span>
              <strong className="text-white font-mono">{dataPoint.actualNpl}%</strong>
            </div>
          )}
          <div className="flex justify-between text-blue-300">
            <span>Hybrid Ensemble:</span>
            <strong className="font-mono">{dataPoint.hybridEnsembleNpl}%</strong>
          </div>
          <div className="flex justify-between text-amber-300">
            <span>MIDAS Ekonometrika:</span>
            <strong className="font-mono">{dataPoint.midasNpl}%</strong>
          </div>
          <div className="flex justify-between text-emerald-300">
            <span>Dynamic Factor (DFM):</span>
            <strong className="font-mono">{dataPoint.dfmNpl}%</strong>
          </div>
          <div className="flex justify-between text-purple-300">
            <span>BiLSTM Deep Learning:</span>
            <strong className="font-mono">{dataPoint.deepLearningNpl}%</strong>
          </div>
          <div className="border-t border-slate-700 pt-1 text-[11px] text-slate-400 flex justify-between">
            <span>95% Confidence Interval:</span>
            <span className="font-mono text-slate-300">{dataPoint.ciLower95}% - {dataPoint.ciUpper95}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="nowcasting-lab" className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Laboratorium Nowcasting & Forecasting NPL</h2>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                Frekuensi Campuran (Mixed-Frequency)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Menjembatani indikator pasar harian (BI-Rate, Kurs, IndONIA, Sentimen Berita NLP) dengan data NPL kuartalan resmi OJK/BI.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenMethodology}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Spesifikasi Persamaan</span>
            </button>
          </div>
        </div>

        {/* Model Toggles and Legend */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium mr-1">Layer Model:</span>

            {/* Hybrid Ensemble Toggle */}
            <button
              id="toggle-hybrid"
              onClick={() => setShowHybrid(!showHybrid)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showHybrid
                  ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Hybrid Ensemble (MIDAS + FinBERT)</span>
              {showHybrid && <Check className="h-3 w-3 text-blue-600" />}
            </button>

            {/* MIDAS Toggle */}
            <button
              id="toggle-midas"
              onClick={() => setShowMidas(!showMidas)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showMidas
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>MIDAS Polinomial Almon</span>
              {showMidas && <Check className="h-3 w-3 text-amber-600" />}
            </button>

            {/* DFM Toggle */}
            <button
              id="toggle-dfm"
              onClick={() => setShowDfm(!showDfm)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showDfm
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Dynamic Factor Model (DFM)</span>
              {showDfm && <Check className="h-3 w-3 text-emerald-600" />}
            </button>

            {/* Deep Learning Toggle */}
            <button
              id="toggle-dl"
              onClick={() => setShowDeepLearning(!showDeepLearning)}
              className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showDeepLearning
                  ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>BiLSTM FinBERT Attention</span>
              {showDeepLearning && <Check className="h-3 w-3 text-purple-600" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showCiBand}
                onChange={(e) => setShowCiBand(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Interval Keyakinan 95%</span>
            </label>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="mt-4 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={NPL_TIMESERIES} margin={{ top: 20, right: 25, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis
                domain={[2.0, 2.7]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#cbd5e1"
                tickFormatter={(val) => `${val.toFixed(2)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {/* Confidence interval band */}
              {showCiBand && (
                <Area
                  type="monotone"
                  dataKey="ciUpper95"
                  stroke="none"
                  fill="#93c5fd"
                  fillOpacity={0.25}
                  name="95% CI Upper"
                />
              )}
              {showCiBand && (
                <Area
                  type="monotone"
                  dataKey="ciLower95"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1.0}
                  name="95% CI Lower"
                />
              )}

              {/* Threshold line */}
              <ReferenceLine
                x="Q1 2025 (Nowcast)"
                stroke="#2563eb"
                strokeDasharray="4 4"
                label={{ value: "Mulai Nowcast", position: "insideTopLeft", fill: "#2563eb", fontSize: 10, fontWeight: 700 }}
              />

              {/* Actual NPL line */}
              <Line
                type="monotone"
                dataKey="actualNpl"
                name="NPL Aktual (OJK)"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />

              {/* Hybrid Ensemble */}
              {showHybrid && (
                <Line
                  type="monotone"
                  dataKey="hybridEnsembleNpl"
                  name="Ensemble (MIDAS + FinBERT)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  strokeDasharray="5 3"
                  dot={{ r: 3, fill: '#2563eb' }}
                />
              )}

              {/* MIDAS */}
              {showMidas && (
                <Line
                  type="monotone"
                  dataKey="midasNpl"
                  name="MIDAS Almon"
                  stroke="#f59e0b"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}

              {/* DFM */}
              {showDfm && (
                <Line
                  type="monotone"
                  dataKey="dfmNpl"
                  name="Dynamic Factor Model"
                  stroke="#10b981"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}

              {/* Deep Learning */}
              {showDeepLearning && (
                <Line
                  type="monotone"
                  dataKey="deepLearningNpl"
                  name="BiLSTM FinBERT"
                  stroke="#8b5cf6"
                  strokeWidth={1.8}
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Hasil Analisis Nowcast Terkini:</span>
            <span>NPL perbankan Q1 2025 diprediksi berada di level <strong>2.23%</strong> (naik tipis +0.05% dari 2.18% di Q4 2024).</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Aman (Jauh di Bawah Batas 5%)
          </span>
        </div>
      </div>

      {/* Model Performance Benchmark Comparison */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Uji Akurasi & Validasi Model (Out-of-Sample Evaluation)</h3>
            <p className="text-xs text-slate-500">
              Evaluasi kinerja prediksi menggunakan metrik error standar Bank Indonesia (Sample Evaluasi: 2021-Q1 s.d. 2024-Q4)
            </p>
          </div>
          <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-semibold">
            Model Terpilih: Hybrid Ensemble
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 font-semibold">Metode / Model</th>
                <th className="py-2.5 px-3 font-semibold text-right">RMSE</th>
                <th className="py-2.5 px-3 font-semibold text-right">MAE</th>
                <th className="py-2.5 px-3 font-semibold text-right">Theil's U</th>
                <th className="py-2.5 px-3 font-semibold text-right">Akurasi Arah (%)</th>
                <th className="py-2.5 px-3 font-semibold text-left">Frekuensi Update</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MODEL_PERFORMANCE_METRICS.map((m, idx) => (
                <tr key={idx} className={m.isBest ? 'bg-blue-50/50 font-medium' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      {m.isBest && <Sparkles className="h-3.5 w-3.5 text-blue-600" />}
                      <span>{m.model}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">{m.description}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">{m.rmse.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">{m.mae.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800">{m.theilU.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700">{m.directionalAccuracy}</td>
                  <td className="py-2.5 px-3 text-slate-600">{m.latency}</td>
                  <td className="py-2.5 px-3 text-center">
                    {m.isBest ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow-xs">
                        Utama (Production)
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        Benchmark
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <strong className="text-slate-900">Mengapa Hybrid Ensemble Lebih Akurat?</strong>
          <p className="mt-1 leading-relaxed text-[11px] text-slate-600">
            Model ekonometrika konvensional (seperti ARIMA atau DFM murni) hanya mengandalkan data historis yang mengalami lag publikasi (publication lag 30-45 hari). Dengan mengintegrasikan <strong>Sentimen Berita Keuangan FinBERT</strong>, model memperoleh sinyal *real-time* mengenai potensi gagal bayar debitur sindikasi korporasi atau pengetatan likuiditas hingga 1-2 kuartal sebelum tercermin pada pembukuan akuntansi bank.
          </p>
        </div>
      </div>
    </div>
  );
};
