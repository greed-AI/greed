import { getDecisionLabel } from "@/lib/greed-decision";
import type { GreedDecisionLabel } from "@/lib/greed-decision";
import { buildWhyContent, type WhyContent } from "@/lib/decision-why";
import type { StockAnalysis } from "@/lib/types/analysis";

export type TopOpportunity = {
  ticker: string;
  company: string;
  decision: GreedDecisionLabel;
  confidence: number;
  reason: string;
  greedScore: number;
  why: WhyContent;
};

export type WatchlistChange = {
  ticker: string;
  company: string;
  from: GreedDecisionLabel;
  to: GreedDecisionLabel;
  reason: string;
  why: WhyContent;
};

export type MarketPulse = {
  overall: "Bullish" | "Neutral" | "Bearish";
  aiConfidence: number;
  marketRisk: "Low" | "Medium" | "High";
};

export type WatchlistStock = StockAnalysis & {
  why: WhyContent;
};

const NVDA_STOCK: StockAnalysis = {
  ticker: "NVDA",
  company: "NVIDIA",
  greedScore: 91,
  momentum: "Very Strong",
  risk: "High",
  confidence: 69,
  summary: "Exceptional momentum, size positions carefully.",
};

const TSLA_STOCK: StockAnalysis = {
  ticker: "TSLA",
  company: "Tesla",
  greedScore: 82,
  momentum: "Strong",
  risk: "High",
  confidence: 76,
  summary: "Strong momentum with elevated risk.",
};

const AAPL_STOCK: StockAnalysis = {
  ticker: "AAPL",
  company: "Apple",
  greedScore: 74,
  momentum: "Moderate",
  risk: "Low",
  confidence: 88,
  summary: "Steady institutional support, balanced outlook.",
};

const MSFT_STOCK: StockAnalysis = {
  ticker: "MSFT",
  company: "Microsoft",
  greedScore: 78,
  momentum: "Strong",
  risk: "Low",
  confidence: 84,
  summary: "Durable cloud-driven growth with contained risk.",
};

const GOOG_STOCK: StockAnalysis = {
  ticker: "GOOG",
  company: "Alphabet",
  greedScore: 71,
  momentum: "Moderate",
  risk: "Medium",
  confidence: 79,
  summary: "AI upside balanced with regulatory headwinds.",
};

export const AI_BRIEF_INSIGHTS = [
  "Tech momentum continues to lead with AI names seeing the strongest inflows.",
  "Elevated volatility in high-beta stocks suggests tighter position sizing.",
  "Institutional support remains firm across large-cap quality names.",
] as const;

export const TOP_OPPORTUNITY: TopOpportunity = {
  ...NVDA_STOCK,
  decision: getDecisionLabel(NVDA_STOCK.greedScore),
  reason:
    "Exceptional momentum with AI demand tailwinds. Size positions carefully.",
  why: buildWhyContent(NVDA_STOCK),
};

export const WATCHLIST_CHANGES: WatchlistChange[] = [
  {
    ticker: "TSLA",
    company: "Tesla",
    from: "BUY",
    to: "HOLD",
    reason: "Risk increased.",
    why: buildWhyContent(TSLA_STOCK),
  },
  {
    ticker: "AAPL",
    company: "Apple",
    from: "HOLD",
    to: "HOLD",
    reason: "Stable outlook, no action needed.",
    why: buildWhyContent(AAPL_STOCK),
  },
  {
    ticker: "MSFT",
    company: "Microsoft",
    from: "WAIT",
    to: "BUY",
    reason: "Cloud momentum strengthening.",
    why: buildWhyContent(MSFT_STOCK),
  },
];

export const MY_WATCHLIST: WatchlistStock[] = [
  NVDA_STOCK,
  TSLA_STOCK,
  AAPL_STOCK,
  MSFT_STOCK,
  GOOG_STOCK,
].map((stock) => ({
  ...stock,
  why: buildWhyContent(stock),
}));

export const MARKET_PULSE: MarketPulse = {
  overall: "Bullish",
  aiConfidence: 78,
  marketRisk: "Medium",
};

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export const USER_NAME = "Donghwan";
