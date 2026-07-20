import type { WhyContent } from "@/lib/decision-why";

export type StrategyAction =
  | "BUY"
  | "HOLD"
  | "WAIT"
  | "TRIM"
  | "STRONG BUY";

export type StrategyDetail = {
  action: StrategyAction;
  reason: string;
};

export type SavedStrategy = {
  today?: StrategyDetail;
  oneWeek?: StrategyDetail;
  oneMonth?: StrategyDetail;
  oneYear?: StrategyDetail;
};

export type WatchlistWhy = WhyContent & {
  strategy?: SavedStrategy;
};

export type WatchlistItem = {
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
  confidence?: number;
  why?: WatchlistWhy;
  action?: StrategyAction;
};