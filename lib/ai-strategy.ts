import { getDecisionLabel, type GreedDecisionLabel } from "@/lib/greed-decision";

export type StrategyHorizon =
  | "today"
  | "week"
  | "month"
  | "year"
  | "oneWeek"
  | "oneMonth"
  | "oneYear";

  export type StrategyAction =
  | "ACCUMULATE"
  | "BUY"
  | "HOLD"
  | "WATCH"
  | "WAIT"
  | "TRIM"
  | "EXIT"
  | "STRONG BUY";

export type AIStrategyItem = {
  horizon: StrategyHorizon;
  label: string;
  action: StrategyAction;
  signal: string;
  intensity: 1 | 2 | 3 | 4 | 5;
};

const ACTION_STYLE: Record<
  StrategyAction,
  { signal: string; intensity: AIStrategyItem["intensity"] }
> = {
  ACCUMULATE: { signal: "Strong entry", intensity: 5 },
  BUY: { signal: "Add exposure", intensity: 4 },
  HOLD: { signal: "Stay positioned", intensity: 3 },
  WATCH: { signal: "Wait for clarity", intensity: 2 },
  WAIT: { signal: "Wait for clarity", intensity: 2 },
  TRIM: { signal: "Reduce size", intensity: 2 },
  EXIT: { signal: "Close exposure", intensity: 1 },
  "STRONG BUY": { signal: "Strong entry", intensity: 5 },
};

function actionForHorizon(
  score: number,
  label: GreedDecisionLabel,
  horizon: StrategyHorizon,
): StrategyAction {
  const bullish = score >= 80;
  const neutral = score >= 50 && score < 80;
  const bearish = score < 50;

  if (horizon === "today") {
    if (bullish) return label === "STRONG BUY" ? "ACCUMULATE" : "BUY";
    if (neutral) return label === "WAIT" ? "WATCH" : "HOLD";
    return label === "SELL" ? "EXIT" : "TRIM";
  }

  if (horizon === "week") {
    if (score >= 85) return "ACCUMULATE";
    if (score >= 70) return "BUY";
    if (score >= 55) return "HOLD";
    if (score >= 40) return "WATCH";
    return bearish ? "TRIM" : "EXIT";
  }

  if (horizon === "month") {
    if (score >= 75) return "BUY";
    if (score >= 60) return "HOLD";
    if (score >= 45) return "WATCH";
    return score >= 35 ? "TRIM" : "EXIT";
  }

  // year — smoother, longer-term bias
  if (score >= 80) return "ACCUMULATE";
  if (score >= 65) return "HOLD";
  if (score >= 50) return "WATCH";
  if (score >= 35) return "TRIM";
  return "EXIT";
}

const HORIZON_LABELS: Record<StrategyHorizon, string> = {
  today: "Today",
  week: "1 Week",
  month: "1 Month",
  year: "1 Year",
  oneWeek: "1 Week",
  oneMonth: "1 Month",
  oneYear: "1 Year",
};

export function buildAIStrategy(greedScore: number): AIStrategyItem[] {
  const decisionLabel = getDecisionLabel(greedScore);
  const horizons: StrategyHorizon[] = ["today", "week", "month", "year"];

  return horizons.map((horizon) => {
    const action = actionForHorizon(greedScore, decisionLabel, horizon);
    const style = ACTION_STYLE[action];

    return {
      horizon,
      label: HORIZON_LABELS[horizon],
      action,
      signal: style.signal,
      intensity: style.intensity,
    };
  });
}
