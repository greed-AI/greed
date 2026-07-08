export type StockAnalysis = {
  company: string;
  ticker: string;
  greedScore: number;
  momentum: string;
  risk: string;
  confidence: number;
  summary: string;
};

export type AnalysisResponse = StockAnalysis & {
  isDemo: boolean;
};

export type AnalysisApiError = {
  error: string;
};
