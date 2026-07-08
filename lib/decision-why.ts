import type { StockAnalysis } from "@/lib/types/analysis";
import { buildGreedRadar, type RadarLevel } from "@/lib/greed-radar";

export type WhyContent = {
  momentum: string;
  trend: string;
  risk: string;
  value: string;
};

const LEVEL_TEXT: Record<RadarLevel, string> = {
  1: "Weak",
  2: "Fair",
  3: "Moderate",
  4: "Strong",
  5: "Peak",
};

export function buildWhyContent(stock: StockAnalysis): WhyContent {
  const radar = buildGreedRadar(stock);

  return {
    momentum: `${LEVEL_TEXT[radar.momentum]} ${stock.momentum.toLowerCase()} momentum in play.`,
    trend: `${LEVEL_TEXT[radar.trend]} trend supported by a ${stock.greedScore}/100 Greed Score.`,
    risk: `${stock.risk} risk profile — ${riskNote(stock.risk)}.`,
    value: `${LEVEL_TEXT[radar.value]} value signal at current levels.`,
  };
}

function riskNote(risk: string): string {
  if (risk === "High") return "tighter sizing recommended";
  if (risk === "Low") return "contained downside";
  return "balance opportunity with discipline";
}

export type SimpleDecision = "BUY" | "HOLD" | "WAIT";

export function simplifyDecision(score: number): SimpleDecision {
  if (score >= 80) return "BUY";
  if (score >= 65) return "HOLD";
  return "WAIT";
}
