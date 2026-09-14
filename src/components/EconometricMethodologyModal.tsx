import React from 'react';
import { X, BookOpen, Layers, Cpu, Landmark, CheckCircle, Calculator } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconometricMethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/40 text-cyan-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Metodologi Ekonometrika & Deep Learning Nowcasting NPL
              </h3>
              <p className="text-xs text-slate-400">
                Spesifikasi Model Makroprudensial Terintegrasi Bank Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1: MIDAS */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Calculator className="h-4 w-4 text-blue-600" />
              <h4>1. Model MIDAS (Mixed-Data Sampling)</h4>
            </div>
            <p className="text-slate-600">
              Tantangan utama dalam nowcasting kredit bermasalah (NPL) adalah <em>publication lag</em> data resmi OJK/BI yang baru dirilis 30-45 hari setelah akhir kuartal. Model MIDAS memadukan data target kuartalan (Y_t) secara langsung dengan variabel eksogen berfrekuensi harian (X_t harian) tanpa kehilangan variasi informasi melalui agregasi rata-rata sederhana.
            </p>
            <div className="bg-slate-900 text-cyan-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              NPL_t = α + ∑(i=1..p) β_i L^i NPL_t + γ ∑(k=0..K) w(k; θ) X_(t - k/m)^(daily) + ε_t
            </div>
            <p className="text-slate-600 text-xs">
              Fungsi bobot polinomial Almon eksponensial (Exponential Almon Lag) memastikan bobot informasi meluruh secara fleksibel untuk hari-hari perdagangan yang lebih lampau:
            </p>
            <div className="bg-slate-100 text-slate-800 p-2.5 rounded font-mono text-xs">
              w(k; θ₁, θ₂) = exp(θ₁ k + θ₂ k²) / ∑ exp(θ₁ j + θ₂ j²)
            </div>
          </div>

          {/* Section 2: Deep Learning FinBERT NLP */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <h4>2. Sentimen Analisis Berita Keuangan (IndoBERT + BiLSTM)</h4>
            </div>
            <p className="text-slate-600">
              Sentimen dari berita keuangan (Bisnis Indonesia, Kontan, Bloomberg Technoz, CNBC, dan Siaran Pers BI) mencerminkan kondisi riil likuiditas dan tekanan arus kas korporasi 1 hingga 2 kuartal sebelum tercatat secara formal sebagai kredit macet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg">
                <div className="font-bold text-indigo-900 mb-1">Financial Sentiment Index (FSI)</div>
                <p className="text-indigo-800 text-[11px]">
                  Skor polaritas ternormalisasi [-100 s/d +100] yang diagregasi harian untuk mengukur kepanikan vs optimisme pasar kredit.
                </p>
              </div>
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                <div className="font-bold text-blue-900 mb-1">Klasifikasi Aspek Kredit</div>
                <p className="text-blue-800 text-[11px]">
                  Pemisahan otomatis aspek: Default Risk, Liquidity Pressure, Interest Rate Burden, dan Restructuring Progress.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Hybrid Ensemble */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Layers className="h-4 w-4 text-emerald-600" />
              <h4>3. Model Hybrid Ensemble (Optimalisasi Bobot Error)</h4>
            </div>
            <p className="text-slate-600">
              Untuk meminimalkan varians prediksi, sistem menggunakan kombinasi linear terkontrol:
            </p>
            <div className="bg-slate-100 text-slate-800 p-2.5 rounded font-mono text-xs">
              NPL_Nowcast = 0.40 * MIDAS_Almon + 0.35 * DeepLearning_FinBERT + 0.25 * DFM_Kalman
            </div>
            <p className="text-xs text-slate-500">
              Hasil validasi out-of-sample membuktikan bahwa model gabungan ini menurunkan Root Mean Squared Error (RMSE) sebesar <strong>24%</strong> dibanding model ekonometrika tunggal, dengan akurasi arah mencapai <strong>92.4%</strong>.
            </p>
          </div>

          {/* Section 4: Bank Indonesia Macroprudential Framework */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Landmark className="h-4 w-4 text-amber-600" />
              <h4>4. Instrumen Kebijakan Makroprudensial Bank Indonesia</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Countercyclical Capital Buffer (CCyB):</strong> Tambahan modal 0% - 2.5% untuk meredam akselerasi pertumbuhan kredit berlebih atau penarikan cadangan saat siklus menurun.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Penyangga Likuiditas Makroprudensial (PLM):</strong> Fleksibilitas pemenuhan giro simpanan untuk menjaga likuiditas harian perbankan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Kebijakan Insentif Likuiditas Makroprudensial (KLM):</strong> Insentif pengurangan GWM hingga 4% bagi bank penyalur kredit ke sektor hilirisasi, perumahan, otomotif ramah lingkungan, dan UMKM.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Penyisihan CKPN PSAK 71 / IFRS 9:</strong> Model estimasi Expected Credit Loss (ECL) forward-looking yang memindahkan kredit dari Stage 1 (Performing), Stage 2 (Underperforming / SICR), ke Stage 3 (Non-Performing).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup Informasi Metodologi
          </button>
        </div>
      </div>
    </div>
  );
};
