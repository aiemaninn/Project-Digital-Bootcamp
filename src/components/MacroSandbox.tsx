import React from "react";
import { MacroScenario } from "../types";
import { Sliders, RotateCcw, Zap, AlertOctagon, TrendingDown, Award } from "lucide-react";

interface MacroSandboxProps {
  scenario: MacroScenario;
  onScenarioChange: (newScenario: MacroScenario) => void;
  onResetBaseline: () => void;
}

export const MacroSandbox: React.FC<MacroSandboxProps> = ({
  scenario,
  onScenarioChange,
  onResetBaseline,
}) => {
  const handleChange = (field: keyof MacroScenario, value: number) => {
    onScenarioChange({
      ...scenario,
      [field]: value,
    });
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case "baseline":
        onResetBaseline();
        break;
      case "kurs_stress":
        onScenarioChange({
          biRate: 6.75,
          kursUsdIdr: 16650,
          pdbGrowth: 4.65,
          inflasi: 3.4,
          creditGrowth: 8.2,
          sentimentIndex: -0.48,
        });
        break;
      case "severe_kssk":
        onScenarioChange({
          biRate: 7.5,
          kursUsdIdr: 17200,
          pdbGrowth: 3.85,
          inflasi: 4.6,
          creditGrowth: 5.5,
          sentimentIndex: -0.85,
        });
        break;
      case "optimistic":
        onScenarioChange({
          biRate: 5.25,
          kursUsdIdr: 15300,
          pdbGrowth: 5.5,
          inflasi: 2.2,
          creditGrowth: 12.0,
          sentimentIndex: 0.6,
        });
        break;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            Sandbox Simulasi Makroekonomi & Uji Ketahanan (Stress Testing)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geser parameter untuk melihat respon elastisitas seketika pada Nowcasting NPL dan profil risiko perbankan
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1">Preset Skenario:</span>
          <button
            onClick={() => applyPreset("baseline")}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Baseline BI
          </button>
          <button
            onClick={() => applyPreset("kurs_stress")}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition flex items-center gap-1"
          >
            <TrendingDown className="w-3 h-3" />
            Tekanan Kurs (+75 bps)
          </button>
          <button
            onClick={() => applyPreset("severe_kssk")}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition flex items-center gap-1"
          >
            <AlertOctagon className="w-3 h-3" />
            Stres Berat (KSSK)
          </button>
          <button
            onClick={() => applyPreset("optimistic")}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center gap-1"
          >
            <Award className="w-3 h-3" />
            Optimis
          </button>
          <button
            onClick={onResetBaseline}
            title="Reset ke Default"
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {/* 1. BI Rate */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Suku Bunga Acuan (BI-Rate)
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {scenario.biRate.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="4.50"
            max="8.50"
            step="0.25"
            value={scenario.biRate}
            onChange={(e) => handleChange("biRate", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>4.50%</span>
            <span className="text-slate-500 font-medium">Netral: 6.00%</span>
            <span>8.50%</span>
          </div>
        </div>

        {/* 2. Kurs Rupiah */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Nilai Tukar (USD/IDR)
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Rp {scenario.kursUsdIdr.toLocaleString("id-ID")}
            </span>
          </div>
          <input
            type="range"
            min="14500"
            max="17500"
            step="50"
            value={scenario.kursUsdIdr}
            onChange={(e) => handleChange("kursUsdIdr", parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Rp 14.500</span>
            <span className="text-slate-500 font-medium">Asumsi APBN: Rp 15.800</span>
            <span>Rp 17.500</span>
          </div>
        </div>

        {/* 3. News Sentiment Index */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Sentimen Berita (NLP NSI)
            </label>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              scenario.sentimentIndex < -0.2 ? "bg-rose-50 text-rose-700" : scenario.sentimentIndex > 0.2 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
            }`}>
              {scenario.sentimentIndex > 0 ? `+${scenario.sentimentIndex.toFixed(2)}` : scenario.sentimentIndex.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="-1.00"
            max="1.00"
            step="0.05"
            value={scenario.sentimentIndex}
            onChange={(e) => handleChange("sentimentIndex", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span className="text-rose-600 font-semibold">-1.0 (Stres)</span>
            <span className="text-slate-500">0.0 (Netral)</span>
            <span className="text-emerald-600 font-semibold">+1.0 (Optimis)</span>
          </div>
        </div>

        {/* 4. Pertumbuhan PDB */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Pertumbuhan PDB Riil (% yoy)
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {scenario.pdbGrowth.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="3.00"
            max="6.50"
            step="0.10"
            value={scenario.pdbGrowth}
            onChange={(e) => handleChange("pdbGrowth", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>3.00%</span>
            <span className="text-slate-500 font-medium">Tren: 5.05%</span>
            <span>6.50%</span>
          </div>
        </div>

        {/* 5. Inflasi */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Inflasi IHK (% yoy)
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {scenario.inflasi.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="1.00"
            max="6.00"
            step="0.10"
            value={scenario.inflasi}
            onChange={(e) => handleChange("inflasi", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1.00%</span>
            <span className="text-slate-500 font-medium">Sasaran BI: 2.5 ± 1%</span>
            <span>6.00%</span>
          </div>
        </div>

        {/* 6. Pertumbuhan Kredit */}
        <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Pertumbuhan Kredit Perbankan
            </label>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {scenario.creditGrowth.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min="4.0"
            max="15.0"
            step="0.2"
            value={scenario.creditGrowth}
            onChange={(e) => handleChange("creditGrowth", parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>4.0%</span>
            <span className="text-slate-500 font-medium">Target BI: 10 - 12%</span>
            <span>15.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
