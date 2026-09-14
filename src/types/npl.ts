export interface MacroIndicators {
  biRate: number; // e.g. 6.00%
  usdIdr: number; // e.g. 16250
  gdpGrowth: number; // e.g. 5.05%
  inflation: number; // e.g. 2.4%
  creditGrowth: number; // e.g. 10.85%
  dpkGrowth: number; // e.g. 7.4%
  indonias: number; // e.g. 5.85%
  sbn10y: number; // e.g. 6.78%
  fsiScore: number; // -100 to +100 Financial Sentiment Index
}

export interface SectorNPL {
  id: string;
  name: string;
  currentNpl: number; // percentage, e.g. 3.82%
  nowcastNpl: number;
  forecast6m: number;
  lar: number; // Loan at Risk %
  shareOfCredit: number; // % of total banking credit
  status: 'Aman' | 'Waspada' | 'Siaga' | 'Bahaya';
  sentimentTone: 'Positif' | 'Netral' | 'Negatif';
  keyRiskDriver: string;
}

export interface BankTierMetric {
  tier: 'KBMI 1' | 'KBMI 2' | 'KBMI 3' | 'KBMI 4' | 'BPR / BPRS';
  capitalMin: string;
  nplGross: number;
  nplNet: number;
  car: number;
  ckpnCoverage: number;
  nowcastDelta: number;
}

export interface TimeSeriesPoint {
  period: string; // e.g. '2023-Q1'
  label: string; // e.g. 'Q1 2023'
  isForecast?: boolean;
  isNowcast?: boolean;
  actualNpl: number | null;
  midasNpl: number;
  dfmNpl: number;
  deepLearningNpl: number;
  hybridEnsembleNpl: number;
  ciLower95: number;
  ciUpper95: number;
  fsiSentiment: number; // -100 to +100
  biRate: number;
  creditGrowth: number;
}

export interface FinancialNewsItem {
  id: string;
  source: 'Bisnis Indonesia' | 'Kontan' | 'CNBC Indonesia' | 'Bloomberg Technoz' | 'Bank Indonesia';
  title: string;
  snippet: string;
  publishedAt: string;
  sentimentScore: number; // -1.0 to +1.0
  polarity: 'Positif' | 'Netral' | 'Negatif';
  confidence: number;
  primaryAspect: string;
  targetSector: string;
  nplImpactVector: number; // estimated contribution to delta NPL (bps)
}

export interface NewsAnalysisResult {
  sentimentScore: number;
  label: 'BULLISH / RENDAH RISIKO' | 'NETRAL' | 'BEARISH / TINGGI RISIKO';
  confidence: number;
  aspects: { aspect: string; score: number; impact: string }[];
  affectedSectors: { sector: string; riskImpact: 'Rendah' | 'Sedang' | 'Tinggi'; direction: 'Naik' | 'Stabil' | 'Turun' }[];
  summary: string;
}

export interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  biRateShockBps: number;
  usdIdrShockPct: number;
  gdpGrowthShockPct: number;
  sentimentShock: number; // -1 to +1
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  recommendedActions?: string[];
  metricsSnapshot?: {
    nplNowcast: number;
    scenarioLabel?: string;
  };
}
