export type StrategyAction =
  | "BUY"
  | "HOLD"
  | "WAIT"
  | "TRIM"
  | "STRONG BUY";
  

  export type AIStrategy = {
    today: StrategyAction;
    oneWeek: StrategyAction;
    oneMonth: StrategyAction;
    oneYear: StrategyAction;
  };

  export type AIWhyContent = {
    momentum: string;
    trend: string;
    risk: string;
    value: string;
  };

export type StockAnalysis = {
  company: string;
  ticker: string; // e.g. "AAPL"  
  greedScore: number;
  momentum: string;
  risk: string;
  confidence: number;
  summary: string;
  strategy: AIStrategy;
  why?: AIWhyContent;
};

export type AnalysisResponse = StockAnalysis & {
  isDemo: boolean;
};

export type AnalysisApiError = {
  error: string;
};
