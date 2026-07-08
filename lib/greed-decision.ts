import type { StockAnalysis } from "@/lib/types/analysis";

export type GreedDecisionLabel =
  | "STRONG BUY"
  | "BUY"
  | "HOLD"
  | "WAIT"
  | "REDUCE"
  | "SELL";

export type DecisionBlock = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  accent: "gold" | "emerald" | "amber" | "orange" | "red";
};

export type GreedDecision = {
  label: GreedDecisionLabel;
  emoji: string;
  confidence: number;
  investmentHorizon: string;
  blocks: DecisionBlock[];
  badgeClass: string;
  glowClass: string;
};

export function getDecisionLabel(score: number): GreedDecisionLabel {
  if (score >= 90) return "STRONG BUY";
  if (score >= 80) return "BUY";
  if (score >= 65) return "HOLD";
  if (score >= 50) return "WAIT";
  if (score >= 35) return "REDUCE";
  return "SELL";
}

const DECISION_STYLE: Record<
  GreedDecisionLabel,
  { emoji: string; badgeClass: string; glowClass: string; horizon: string }
> = {
  "STRONG BUY": {
    emoji: "🟢",
    badgeClass:
      "border-emerald-400/30 bg-emerald-500/15 text-emerald-200 shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    glowClass: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    horizon: "6–12 months",
  },
  BUY: {
    emoji: "🟢",
    badgeClass:
      "border-emerald-400/25 bg-emerald-500/10 text-emerald-200/90 shadow-[0_0_32px_rgba(16,185,129,0.12)]",
    glowClass: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    horizon: "3–6 months",
  },
  HOLD: {
    emoji: "🟡",
    badgeClass:
      "border-amber-400/30 bg-amber-500/12 text-amber-100 shadow-[0_0_32px_rgba(245,158,11,0.12)]",
    glowClass: "from-amber-500/15 via-amber-500/5 to-transparent",
    horizon: "3–6 months",
  },
  WAIT: {
    emoji: "🟠",
    badgeClass:
      "border-orange-400/30 bg-orange-500/12 text-orange-100 shadow-[0_0_32px_rgba(249,115,22,0.12)]",
    glowClass: "from-orange-500/15 via-orange-500/5 to-transparent",
    horizon: "1–3 months",
  },
  REDUCE: {
    emoji: "🔴",
    badgeClass:
      "border-red-400/30 bg-red-500/12 text-red-200 shadow-[0_0_32px_rgba(239,68,68,0.12)]",
    glowClass: "from-red-500/15 via-red-500/5 to-transparent",
    horizon: "Immediate review",
  },
  SELL: {
    emoji: "🔴",
    badgeClass:
      "border-red-400/35 bg-red-500/15 text-red-100 shadow-[0_0_40px_rgba(239,68,68,0.15)]",
    glowClass: "from-red-500/20 via-red-500/5 to-transparent",
    horizon: "Immediate action",
  },
};

function scoreAccent(label: GreedDecisionLabel): DecisionBlock["accent"] {
  if (label === "STRONG BUY" || label === "BUY") return "emerald";
  if (label === "HOLD") return "amber";
  if (label === "WAIT") return "orange";
  return "red";
}

function momentumAccent(momentum: string): DecisionBlock["accent"] {
  if (momentum === "Very Strong" || momentum === "Strong") return "emerald";
  if (momentum === "Moderate") return "amber";
  return "orange";
}

function riskAccent(risk: string): DecisionBlock["accent"] {
  if (risk === "Low") return "emerald";
  if (risk === "Medium") return "amber";
  return "red";
}

function buildBlocks(
  analysis: StockAnalysis,
  label: GreedDecisionLabel,
): DecisionBlock[] {
  const { greedScore, momentum, risk, confidence, company } = analysis;

  const scoreTitles: Record<GreedDecisionLabel, string> = {
    "STRONG BUY": "Exceptional conviction",
    BUY: "Constructive bias",
    HOLD: "Maintain exposure",
    WAIT: "Patience advised",
    REDUCE: "Trim exposure",
    SELL: "Exit bias",
  };

  const momentumTitles: Record<string, string> = {
    "Very Strong": "Surging momentum",
    Strong: "Strong momentum",
    Moderate: "Steady momentum",
    Weak: "Weak momentum",
  };

  const riskTitles: Record<string, string> = {
    Low: "Contained risk",
    Medium: "Moderate risk",
    High: "Elevated risk",
  };

  return [
    {
      id: "score",
      icon: "◆",
      title: scoreTitles[label],
      subtitle: `${greedScore}/100 · ${confidence}% confidence`,
      accent: scoreAccent(label),
    },
    {
      id: "momentum",
      icon: "↗",
      title: momentumTitles[momentum] ?? "Momentum signal",
      subtitle: `${company} · ${momentum}`,
      accent: momentumAccent(momentum),
    },
    {
      id: "risk",
      icon: "◎",
      title: riskTitles[risk] ?? "Risk profile",
      subtitle:
        risk === "High"
          ? "Size positions carefully"
          : risk === "Low"
            ? "Flexible entry window"
            : "Balance opportunity & exits",
      accent: riskAccent(risk),
    },
  ];
}

export function buildGreedDecision(analysis: StockAnalysis): GreedDecision {
  const label = getDecisionLabel(analysis.greedScore);
  const style = DECISION_STYLE[label];

  return {
    label,
    emoji: style.emoji,
    confidence: analysis.confidence,
    investmentHorizon: style.horizon,
    blocks: buildBlocks(analysis, label),
    badgeClass: style.badgeClass,
    glowClass: style.glowClass,
  };
}
