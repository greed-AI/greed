import type { StockAnalysis } from "@/lib/types/analysis";

type DemoEntry = Omit<StockAnalysis, "ticker">;

const DEMO_BY_KEY: Record<string, DemoEntry & { symbol: string }> = {
  tsla: {
    symbol: "TSLA",
    company: "Tesla",
    greedScore: 82,
    momentum: "Strong",
    risk: "High",
    confidence: 76,
    summary:
      "Tesla shows strong momentum, but volatility remains elevated. Greed suggests watching risk before entering.",
  },
  tesla: {
    symbol: "TSLA",
    company: "Tesla",
    greedScore: 82,
    momentum: "Strong",
    risk: "High",
    confidence: 76,
    summary:
      "Tesla shows strong momentum, but volatility remains elevated. Greed suggests watching risk before entering.",
  },
  aapl: {
    symbol: "AAPL",
    company: "Apple",
    greedScore: 74,
    momentum: "Moderate",
    risk: "Low",
    confidence: 88,
    summary:
      "Apple maintains steady institutional support with low volatility. Greed flags a balanced entry window.",
  },
  apple: {
    symbol: "AAPL",
    company: "Apple",
    greedScore: 74,
    momentum: "Moderate",
    risk: "Low",
    confidence: 88,
    summary:
      "Apple maintains steady institutional support with low volatility. Greed flags a balanced entry window.",
  },
  nvda: {
    symbol: "NVDA",
    company: "NVIDIA",
    greedScore: 91,
    momentum: "Very Strong",
    risk: "High",
    confidence: 69,
    summary:
      "NVIDIA rides exceptional momentum with elevated risk. Greed recommends sizing positions carefully.",
  },
  nvidia: {
    symbol: "NVDA",
    company: "NVIDIA",
    greedScore: 91,
    momentum: "Very Strong",
    risk: "High",
    confidence: 69,
    summary:
      "NVIDIA rides exceptional momentum with elevated risk. Greed recommends sizing positions carefully.",
  },
  msft: {
    symbol: "MSFT",
    company: "Microsoft",
    greedScore: 78,
    momentum: "Strong",
    risk: "Low",
    confidence: 84,
    summary:
      "Microsoft offers durable cloud-driven growth with contained risk. Greed views it as a quality compounder.",
  },
  microsoft: {
    symbol: "MSFT",
    company: "Microsoft",
    greedScore: 78,
    momentum: "Strong",
    risk: "Low",
    confidence: 84,
    summary:
      "Microsoft offers durable cloud-driven growth with contained risk. Greed views it as a quality compounder.",
  },
  goog: {
    symbol: "GOOG",
    company: "Alphabet",
    greedScore: 71,
    momentum: "Moderate",
    risk: "Medium",
    confidence: 79,
    summary:
      "Alphabet balances AI upside with regulatory headwinds. Greed sees moderate conviction at current levels.",
  },
  googl: {
    symbol: "GOOGL",
    company: "Alphabet",
    greedScore: 71,
    momentum: "Moderate",
    risk: "Medium",
    confidence: 79,
    summary:
      "Alphabet balances AI upside with regulatory headwinds. Greed sees moderate conviction at current levels.",
  },
};

const MOMENTUM_OPTIONS = ["Weak", "Moderate", "Strong", "Very Strong"] as const;
const RISK_OPTIONS = ["Low", "Medium", "High"] as const;

function hashTicker(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function toTitleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildGenericDemo(ticker: string): StockAnalysis {
  const key = ticker.trim().toLowerCase();
  const hash = hashTicker(key);
  const symbol =
    key.length <= 5 ? key.toUpperCase() : key.slice(0, 4).toUpperCase();
  const company = key.length <= 5 ? symbol : toTitleCase(key);
  const greedScore = 58 + (hash % 35);
  const momentum = MOMENTUM_OPTIONS[hash % MOMENTUM_OPTIONS.length];
  const risk = RISK_OPTIONS[(hash >> 3) % RISK_OPTIONS.length];
  const confidence = 62 + ((hash >> 5) % 28);

  return {
    ticker: symbol,
    company,
    greedScore,
    momentum,
    risk,
    confidence,
    summary: `${company} shows ${momentum.toLowerCase()} momentum with ${risk.toLowerCase()} overall risk. Greed recommends monitoring key levels before sizing a position.`,
  };
}

export function generateDemoAnalysis(ticker: string): StockAnalysis {
  const key = ticker.trim().toLowerCase();
  const known = DEMO_BY_KEY[key];

  if (known) {
    const { symbol, ...data } = known;
    return { ticker: symbol, ...data };
  }

  return buildGenericDemo(ticker);
}
