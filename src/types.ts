export interface MacroScenario {
  biRate: number; // e.g. 6.00 (%)
  kursUsdIdr: number; // e.g. 15850
  pdbGrowth: number; // e.g. 5.05 (%)
  inflasi: number; // e.g. 2.75 (%)
  creditGrowth: number; // e.g. 10.4 (%)
  sentimentIndex: number; // -1.0 to 1.0 (News Sentiment Index)
}

export interface FactorDecomposition {
  name: string;
  contributionBps: number;
  percentage: number;
  direction: "up" | "down" | "neutral";
  detail: string;
}

export interface QuarterlyProjection {
  quarter: string;
  baseline: number;
  moderateStress: number;
  severeStress: number;
  sentimentAdjusted: number;
  ciLower: number;
  ciUpper: number;
}

export interface SectorNplData {
  id: string;
  sector: string;
  currentNpl: number;
  nowcastNpl: number;
  deltaBps: number;
  creditSharePct: number;
  riskCategory: "Rendah" | "Moderat" | "Waspada" | "Tinggi";
  transmissionChannel: string;
  elasticityToSentiment: number;
}

export interface BankClusterNplData {
  cluster: string;
  displayName: string;
  currentGrossNpl: number;
  nowcastGrossNpl: number;
  netNpl: number;
  larRatio: number; // Loan at Risk %
  ckpnCoverage: number; // %
  capitalAdequacyRatio: number; // CAR %
  description: string;
}

export interface NowcastSummary {
  currentQuarter: string;
  officialLastNpl: number;
  nowcastGrossNpl: number;
  deltaBps: number;
  nowcastNetNpl: number;
  ci95: [number, number];
  riskStatus: "Aman" | "Waspada Moderat" | "Perhatian Khusus" | "Pelanggaran Ambang Batas";
  sentimentContributionBps: number;
  econometricConfidenceScore: number;
  decomposition: FactorDecomposition[];
  projections: QuarterlyProjection[];
  sectors: SectorNplData[];
  clusters: BankClusterNplData[];
}

export interface FinancialNewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: "Moneter & BI" | "Sektor Riil & UMKM" | "Perbankan" | "Global & Kurs" | "Komoditas & Properti";
  snippet: string;
  fullText: string;
  sentimentScore: number; // -1.0 to +1.0
  sentimentLabel: "Sangat Positif" | "Positif" | "Netral" | "Waspada / Risiko Moderat" | "Tekanan Sistemik Tinggi";
  confidenceScore: number;
  affectedSectors: string[];
  nplImpactBps: number;
  primaryTransmissionChannel: string;
  executiveSummary: string;
  macroprudentialRecommendation: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}
