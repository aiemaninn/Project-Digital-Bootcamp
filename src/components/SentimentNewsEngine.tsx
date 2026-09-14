import React, { useState } from 'react';
import { FinancialNewsItem, NewsAnalysisResult } from '../types/npl';
import { FINANCIAL_NEWS_FEED } from '../data/macroprudentialData';
import { Newspaper, Sparkles, Send, RefreshCw, BarChart2, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Filter, ExternalLink } from 'lucide-react';

export const SentimentNewsEngine: React.FC = () => {
  const [newsFeed, setNewsFeed] = useState<FinancialNewsItem[]>(FINANCIAL_NEWS_FEED);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Input for live inference
  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NewsAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample quick headlines for testing
  const sampleArticles = [
    {
      title: 'Restrukturisasi BUMN Karya Berlanjut, Bank Himbara Tambah Provisi Cadangan Kerugian',
      content: 'Beberapa bank BUMN meningkatkan CKPN hingga 20% untuk mengantisipasi perpanjangan jatuh tempo kredit sindikasi jalan tol dan transmisi listrik.',
    },
    {
      title: 'BI Guyur Insentif Likuiditas Makroprudensial Rp256 Triliun ke Sektor Perumahan dan UMKM',
      content: 'Gubernur BI menyatakan pelonggaran Giro Wajib Minimum (GWM) berhasil mendorong ekspansi kredit baru dengan risiko gagal bayar yang tetap terkelola.',
    },
    {
      title: 'Dolar AS Menguat ke Rp16.350, Beban Bunga Utang Valas Korporasi Kimia Meningkat',
      content: 'Asosiasi produsen bahan kimia menyatakan pelemahan kurs menekan margin operasional dan meningkatkan risiko penurunan kolektibilitas kredit modal kerja valas.',
    },
  ];

  const handleApplySample = (sample: { title: string; content: string }) => {
    setInputTitle(sample.title);
    setInputContent(sample.content);
    setAnalysisResult(null);
  };

  const handleRunInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTitle.trim()) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: inputTitle,
          content: inputContent || inputTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses analisis berita');
      }

      const data = await response.json();
      setAnalysisResult(data);

      // Add to current feed
      const newFeedItem: FinancialNewsItem = {
        id: 'user-news-' + Date.now(),
        source: 'Bisnis Indonesia',
        title: inputTitle,
        snippet: inputContent || 'Analisis artikel kustom pengguna',
        publishedAt: 'Baru saja',
        sentimentScore: data.sentimentScore,
        polarity: data.sentimentScore > 0.15 ? 'Positif' : data.sentimentScore < -0.15 ? 'Negatif' : 'Netral',
        confidence: data.confidence || 0.90,
        primaryAspect: data.aspects?.[0]?.aspect || 'Kualitas Kredit',
        targetSector: data.affectedSectors?.[0]?.sector || 'Korporasi',
        nplImpactVector: data.sentimentScore < 0 ? +0.05 : -0.03,
      };

      setNewsFeed([newFeedItem, ...newsFeed]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredNews = selectedFilter === 'ALL'
    ? newsFeed
    : newsFeed.filter(item => item.polarity.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div id="sentiment-news-engine" className="space-y-6">
      {/* Top Banner explaining FinBERT & NLP */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600/30 border border-blue-500/40 text-cyan-300">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Deep Learning NLP Financial Sentiment Engine</h2>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold uppercase tracking-wider">
                  IndoBERT + BiLSTM Layer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Mengekstraksi polaritas sentimen, aspek risiko kredit (Credit Default, Liquidity, FX Risk), serta mengukur Financial Sentiment Index (FSI) harian sebagai variabel *leading indicator* terhadap probabilitas default kredit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Financial Sentiment Index (FSI)</div>
              <div className="text-xl font-extrabold text-cyan-400">+24.5 / 100</div>
            </div>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Lead-Lag Time</div>
              <div className="text-xl font-extrabold text-emerald-400">~90 Hari</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Article Sentiment Analyzer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Uji Inferensi Sentimen Berita Baru</h3>
              <p className="text-xs text-slate-500">Ketik atau tempel berita untuk memprediksi dampaknya ke NPL</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200">
              Model Live
            </span>
          </div>

          {/* Quick preset headlines */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Contoh Berita Terkini:
            </div>
            <div className="space-y-1.5">
              {sampleArticles.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(s)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-xs text-slate-700 transition-colors cursor-pointer truncate"
                >
                  <span className="font-medium text-slate-900 block truncate">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRunInference} className="space-y-3 flex-1 flex flex-col">
            <div>
              <label htmlFor="input-title" className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Berita Keuangan
              </label>
              <input
                id="input-title"
                type="text"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                placeholder="Contoh: Bunga Kredit Konstruksi Naik 50 Bps..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="input-content" className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Ringkas Berita / Cuplikan
              </label>
              <textarea
                id="input-content"
                rows={3}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Deskripsi singkat mengenai kondisi debitur, restrukturisasi, atau kebijakan moneter..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              id="btn-run-inference"
              type="submit"
              disabled={isAnalyzing || !inputTitle.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Menjalankan Inferensi Deep Learning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Jalankan Inferensi Sentimen & Dampak NPL</span>
                </>
              )}
            </button>
          </form>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="mt-4 pt-4 border-t border-slate-200 text-xs space-y-3 bg-slate-50 p-3.5 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Hasil Analisis Model FinBERT:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  analysisResult.sentimentScore < -0.15
                    ? 'bg-rose-100 text-rose-800'
                    : analysisResult.sentimentScore > 0.15
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {analysisResult.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Skor Sentimen (-1 s/d +1)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {analysisResult.sentimentScore > 0 ? `+${analysisResult.sentimentScore.toFixed(2)}` : analysisResult.sentimentScore.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block">Tingkat Keyakinan (Confidence)</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {(analysisResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Aspect breakdowns */}
              {analysisResult.aspects && analysisResult.aspects.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-800 block mb-1 text-[11px]">Dampak Aspek Spesifik:</span>
                  <div className="space-y-1">
                    {analysisResult.aspects.map((asp, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-slate-200 text-[11px]">
                        <div className="flex justify-between font-medium text-slate-900">
                          <span>{asp.aspect}</span>
                          <span className={`font-mono ${asp.score < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {asp.score > 0 ? `+${asp.score.toFixed(2)}` : asp.score.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[10px] mt-0.5">{asp.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Sectors */}
              {analysisResult.affectedSectors && analysisResult.affectedSectors.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-800 block mb-1 text-[11px]">Sektor Paling Terpengaruh:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.affectedSectors.map((sec, idx) => (
                      <span key={idx} className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] text-slate-800">
                        <strong>{sec.sector}</strong>: Dampak {sec.riskImpact} (NPL {sec.direction})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-slate-600 text-[11px] leading-relaxed italic border-t border-slate-200 pt-2">
                "{analysisResult.summary}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Real-time News Sentiment Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Arsip Feed Berita Keuangan & Skor Sentimen</h3>
              <p className="text-xs text-slate-500">Ekstraksi NLP otomatis dari portal berita ekonomi nasional</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  selectedFilter === 'ALL' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({newsFeed.length})
              </button>
              <button
                onClick={() => setSelectedFilter('Positif')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  selectedFilter === 'Positif' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Positif
              </button>
              <button
                onClick={() => setSelectedFilter('Negatif')}
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  selectedFilter === 'Negatif' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Negatif
              </button>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
            {filteredNews.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all text-xs space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {item.source}
                    </span>
                    <span className="text-[10px] text-slate-600">{item.publishedAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.polarity === 'Positif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.polarity === 'Negatif'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {item.polarity} ({item.sentimentScore > 0 ? `+${item.sentimentScore.toFixed(2)}` : item.sentimentScore.toFixed(2)})
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-xs leading-snug">
                  {item.title}
                </h4>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.snippet}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
                  <div className="flex items-center gap-3">
                    <span>Aspek: <strong className="text-slate-700">{item.primaryAspect}</strong></span>
                    <span>Sektor: <strong className="text-slate-700">{item.targetSector}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>Vektor NPL:</span>
                    <strong className={item.nplImpactVector > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {item.nplImpactVector > 0 ? `+${Math.round(item.nplImpactVector * 100)} bps` : `${Math.round(item.nplImpactVector * 100)} bps`}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
