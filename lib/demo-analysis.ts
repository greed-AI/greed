import type { AIStrategy, StockAnalysis } from "@/lib/types/analysis";

type DemoEntry = Omit<StockAnalysis, "ticker" | "strategy">;

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
function buildDemoStrategy(greedScore: number): AIStrategy {
  return {
    today: {
      action:
        greedScore >= 80
          ? "STRONG BUY"
          : greedScore >= 65
            ? "BUY"
            : greedScore >= 45
              ? "HOLD"
              : greedScore >= 30
                ? "WAIT"
                : "TRIM",
      reason:
        greedScore >= 80
          ? "The high Greed Score supports a strong short-term stance."
          : greedScore >= 65
            ? "The Greed Score supports a constructive short-term stance."
            : greedScore >= 45
              ? "Mixed conditions favor holding in the short term."
              : greedScore >= 30
                ? "The score suggests waiting for clearer confirmation."
                : "Weak conditions support reducing short-term exposure.",
    },

    oneWeek: {
      action:
        greedScore >= 75
          ? "BUY"
          : greedScore >= 55
            ? "HOLD"
            : greedScore >= 40
              ? "WAIT"
              : "TRIM",
      reason:
        greedScore >= 75
          ? "The current score supports a positive one-week outlook."
          : greedScore >= 55
            ? "The one-week outlook remains balanced."
            : greedScore >= 40
              ? "More confirmation is needed over the coming week."
              : "Weak conditions support trimming over one week.",
    },

    oneMonth: {
      action:
        greedScore >= 70
          ? "BUY"
          : greedScore >= 50
            ? "HOLD"
            : greedScore >= 35
              ? "WAIT"
              : "TRIM",
      reason:
        greedScore >= 70
          ? "The score supports a constructive one-month position."
          : greedScore >= 50
            ? "The one-month outlook favors maintaining the position."
            : greedScore >= 35
              ? "The score favors waiting for stronger confirmation."
              : "Weak conditions support reducing medium-term exposure.",
    },

    oneYear: {
      action:
        greedScore >= 65
          ? "BUY"
          : greedScore >= 45
            ? "HOLD"
            : greedScore >= 30
              ? "WAIT"
              : "TRIM",
      reason:
        greedScore >= 65
          ? "The score supports a positive long-term stance."
          : greedScore >= 45
            ? "The long-term outlook remains balanced."
            : greedScore >= 30
              ? "The score suggests waiting before taking a long-term position."
              : "Weak conditions support reducing long-term exposure.",
    },
  };
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
    strategy: buildDemoStrategy(greedScore),
  };
}

export function generateDemoAnalysis(ticker: string): StockAnalysis {
  const key = ticker.trim().toLowerCase();
  const known = DEMO_BY_KEY[key];

  if (known) {
    const { symbol, ...data } = known;
  
    return {
      ticker: symbol,
      ...data,
      strategy: buildDemoStrategy(data.greedScore),
    };
  }

  return buildGenericDemo(ticker);
}
