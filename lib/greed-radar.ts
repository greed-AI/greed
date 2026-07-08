import type { StockAnalysis } from "@/lib/types/analysis";

export type RadarLevel = 1 | 2 | 3 | 4 | 5;

export type RadarDimension = "momentum" | "trend" | "timing" | "risk" | "value";

export type GreedRadarScores = Record<RadarDimension, RadarLevel>;

export type RadarMetric = {
  key: RadarDimension;
  label: string;
  level: RadarLevel;
};

const MOMENTUM_LEVEL: Record<string, RadarLevel> = {
  Weak: 1,
  Moderate: 2,
  Strong: 4,
  "Very Strong": 5,
};

const RISK_LEVEL: Record<string, RadarLevel> = {
  High: 1,
  Medium: 3,
  Low: 5,
};

function clampLevel(value: number): RadarLevel {
  return Math.min(5, Math.max(1, Math.round(value))) as RadarLevel;
}

function scoreToLevel(score: number): RadarLevel {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 45) return 2;
  return 1;
}

export function buildGreedRadar(analysis: StockAnalysis): GreedRadarScores {
  const { greedScore, momentum, risk, confidence } = analysis;

  const momentumBase = MOMENTUM_LEVEL[momentum] ?? 2;
  const riskLevel = RISK_LEVEL[risk] ?? 3;
  const trendLevel = scoreToLevel(greedScore);

  const timingRaw =
    (confidence / 100) * 3.5 + (greedScore >= 70 ? 1 : greedScore >= 50 ? 0.5 : 0);

  const valueRaw =
    trendLevel +
    (risk === "Low" ? 0.75 : risk === "High" ? -0.75 : 0) +
    (greedScore >= 80 ? 0.25 : 0);

  return {
    momentum: clampLevel(momentumBase + (greedScore >= 85 ? 0.5 : 0)),
    trend: trendLevel,
    timing: clampLevel(timingRaw),
    risk: riskLevel,
    value: clampLevel(valueRaw),
  };
}

export function radarToMetrics(scores: GreedRadarScores): RadarMetric[] {
  return [
    { key: "momentum", label: "Momentum", level: scores.momentum },
    { key: "trend", label: "Trend", level: scores.trend },
    { key: "timing", label: "Timing", level: scores.timing },
    { key: "risk", label: "Risk", level: scores.risk },
    { key: "value", label: "Value", level: scores.value },
  ];
}
