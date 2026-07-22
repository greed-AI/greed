"use client";

import { AIStrategySection } from "@/app/components/ai-strategy";
import { DecisionBlocks } from "@/app/components/decision-blocks";
import { GreedRadarSection } from "@/app/components/greed-radar";
import {
  CardShell,
  DemoModeBadge,
  RiskBadge,
  SectionLabel,
} from "@/app/components/ui/primitives";
import { WhyButton } from "@/app/components/ui/why-button";
import { buildGreedDecision } from "@/lib/greed-decision";
import { buildWhyContent } from "@/lib/decision-why";
import type { AnalysisResponse, StockAnalysis } from "@/lib/types/analysis";

type RecentAnalysisItem = {
  ticker: string;
  company: string;
  greedScore: number;
  riskLevel: string;
};

type WatchlistItem = {
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
};

type AnalysisPanelProps = {
  viewState: "idle" | "loading" | "result";
  result: AnalysisResponse | null;
  recentHistory: RecentAnalysisItem[];
  watchlist: WatchlistItem[];

  membership: "FREE" | "ROYAL";

  onAddToWatchlist: (analysis: StockAnalysis) => void;
  onRemoveFromWatchlist: (ticker: string) => void;
  onPremiumFeatureClick: (
    feature: "watchlist" | "strategy" | "radar",
  ) => void;
};

export function AnalysisPanel({
  viewState,
  result,
  recentHistory,
  watchlist,
  membership,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onPremiumFeatureClick,
}: AnalysisPanelProps) {
  if (
    viewState === "idle" &&
    recentHistory.length === 0 &&
    watchlist.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {viewState === "loading" && <LoadingCard />}
      {viewState === "result" && result && (
        <>
          <AnalysisResultCard
            result={result}
            isDemo={result.isDemo}
            isInWatchlist={watchlist.some(
              (item) => item.ticker === result.ticker,
            )}
            onAddToWatchlist={() => onAddToWatchlist(result)}
          />
          <DecisionPlatformSection
  result={result}
  membership={membership}
  onPremiumFeatureClick={onPremiumFeatureClick}
/>
        </>
      )}

      {recentHistory.length > 0 && (
        <RecentAnalysisSection items={recentHistory} />
      )}
    </div>
  );
}

function RecentAnalysisSection({ items }: { items: RecentAnalysisItem[] }) {
  return (
    <CardShell>
      <SectionLabel>Recent Analysis</SectionLabel>

      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item.ticker}
            className="flex flex-col gap-2 rounded-2xl border border-white/6 bg-white/2 px-4 py-3 transition-colors hover:border-gold/15 hover:bg-white/3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gold-light">
                  {item.ticker}
                </span>
                <span className="truncate text-sm text-white/50">
                  {item.company}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-sm font-light text-white">
                {item.greedScore}
                <span className="text-white/30">/100</span>
              </span>
              <RiskBadge level={item.riskLevel} />
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

function DecisionPlatformSection({
  result,
  membership,
  onPremiumFeatureClick,
}: {
  result: StockAnalysis;
  membership: "FREE" | "ROYAL";
  onPremiumFeatureClick: (
    feature: "watchlist" | "strategy" | "radar",
  ) => void;
}) {
  const decision = buildGreedDecision(result);

  return (
    <section>
      <div className="mb-4">
        <SectionLabel>Decision Intelligence</SectionLabel>
        <h2 className="mt-2 text-xl font-extralight tracking-wide text-white sm:text-2xl">
          {result.company}
        </h2>
        <p className="mt-1 text-sm text-white/35">
          Greed Score {result.greedScore}/100
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <GreedDecisionPanel
          decision={decision}
          summary={result.summary}
          why={buildWhyContent(result)}
        />
        <GreedRadarSection
  analysis={result}
  membership={membership}
  onLockedClick={() => onPremiumFeatureClick("radar")}
/>
        <AIStrategySection
  strategy={result.strategy}
  membership={membership}
  onLockedClick={() => onPremiumFeatureClick("strategy")}
/>
      </div>
    </section>
  );
}

function GreedDecisionPanel({
  decision,
  summary,
  why,
}: {
  decision: ReturnType<typeof buildGreedDecision>;
  summary: string;
  why: ReturnType<typeof buildWhyContent>;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8">
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-b ${decision.glowClass}`}
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
          Greed Decision
        </p>

        <div
          className={`mt-4 flex items-center justify-center gap-3 rounded-2xl border px-6 py-5 ${decision.badgeClass}`}
        >
          <span className="text-2xl" aria-hidden="true">
            {decision.emoji}
          </span>
          <span className="text-xl font-medium tracking-[0.12em] sm:text-2xl">
            {decision.label}
          </span>
        </div>

        <WhyButton content={why} size="md" />

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/6 pt-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
              Confidence
            </p>
            <p className="mt-1 text-lg font-light text-white">
              {decision.confidence}
              <span className="text-sm text-white/40">%</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
              Investment Horizon
            </p>
            <p className="mt-1 text-sm font-light leading-snug text-white/80">
              {decision.investmentHorizon}
            </p>
          </div>
        </div>

        <DecisionBlocks blocks={decision.blocks} />

        <div className="mt-5 rounded-xl border border-gold/15 bg-gold/5 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-gold/50">
            AI Insight
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/55">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <CardShell>
      <div className="flex flex-col items-center py-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-white/6" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold border-r-gold-light" />
        </div>
        <p className="mt-6 text-sm font-medium tracking-wide text-gold-light">
          Analyzing market signals
        </p>
        <p className="mt-2 text-xs text-white/30">
          GPT is generating your Greed analysis…
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <div className="h-2 animate-pulse rounded-full bg-white/6" />
          <div className="h-2 w-4/5 animate-pulse rounded-full bg-white/6 [animation-delay:150ms]" />
          <div className="h-2 w-3/5 animate-pulse rounded-full bg-white/6 [animation-delay:300ms]" />
        </div>
      </div>
    </CardShell>
  );
}

function AnalysisResultCard({
  result,
  isDemo,
  isInWatchlist,
  onAddToWatchlist,
}: {
  result: StockAnalysis;
  isDemo: boolean;
  isInWatchlist: boolean;
  onAddToWatchlist: () => void;
}) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset =
    circumference - (result.greedScore / 100) * circumference;
  const decision = buildGreedDecision(result);
  const why = buildWhyContent(result);

  return (
    <CardShell>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              {isDemo ? "Demo Analysis" : "AI Analysis"}
            </p>
            {isDemo && <DemoModeBadge />}
          </div>
          <p className="mt-1 text-lg font-light text-white">{result.company}</p>
        </div>
        <span className="shrink-0 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-light">
          {result.ticker}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <ScoreRing
            score={result.greedScore}
            gradientId="goldGradientResult"
            strokeDashoffset={strokeDashoffset}
            animated
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 text-sm">
          <StatRow
            label="Greed Score"
            value={`${result.greedScore}/100`}
            highlight
          />
          <StatRow label="Momentum" value={result.momentum} />
          <StatRow label="Risk" value={result.risk} />
          <StatRow label="Confidence" value={`${result.confidence}%`} />
        </div>
      </div>

      <div className="mt-6 border-t border-white/6 pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold/60">
          Quick Decision
        </p>
        <div
          className={`mt-3 flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3 ${decision.badgeClass}`}
        >
          <span aria-hidden="true">{decision.emoji}</span>
          <span className="text-sm font-medium tracking-[0.1em]">
            {decision.label}
          </span>
        </div>
        <WhyButton content={why} size="md" />
      </div>

      <button
        type="button"
        onClick={onAddToWatchlist}
        disabled={isInWatchlist}
        className="mt-6 w-full rounded-full border border-gold/25 bg-gold/5 px-5 py-3 text-sm font-medium tracking-wide text-gold-light transition-colors hover:border-gold/40 hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gold/25 disabled:hover:bg-gold/5"
      >
        {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
      </button>
    </CardShell>
  );
}

function ScoreRing({
  score,
  gradientId,
  strokeDashoffset,
  animated = false,
}: {
  score: number;
  gradientId: string;
  strokeDashoffset: number;
  animated?: boolean;
}) {
  return (
    <>
      <svg
        className="h-28 w-28 -rotate-90"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 54}
          strokeDashoffset={strokeDashoffset}
          className={animated ? "transition-all duration-700 ease-out" : ""}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9a7b3c" />
            <stop offset="50%" stopColor="#e8d5a3" />
            <stop offset="100%" stopColor="#c9a962" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light tracking-tight text-white">
          {score}
        </span>
        <span className="text-xs text-white/40">/ 100</span>
      </div>
    </>
  );
}

function StatRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      <span
        className={highlight ? "font-medium text-gold-light" : "text-white/80"}
      >
        {value}
      </span>
    </div>
  );
}
