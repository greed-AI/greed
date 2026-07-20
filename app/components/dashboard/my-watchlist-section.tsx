"use client";

import { useState } from "react";

import {
  CardShell,
  DecisionBadge,
  SectionLabel,
} from "@/app/components/ui/primitives";

import { WhyButton } from "@/app/components/ui/why-button";
import { simplifyDecision } from "@/lib/decision-why";
import type {
  SavedStrategy,
  WatchlistItem,
} from "@/lib/dashboard-types";




const STRATEGY_ITEMS: {
  key: keyof SavedStrategy;
  label: string;
}[] = [
  {
    key: "today",
    label: "Today",
  },
  {
    key: "oneWeek",
    label: "1 Week",
  },
  {
    key: "oneMonth",
    label: "1 Month",
  },
  {
    key: "oneYear",
    label: "1 Year",
  },
];

export function MyWatchlistSection({
  watchlist,
  onRemove,
  onOpenAnalysis,
}: {
  watchlist: WatchlistItem[];
  onRemove: (ticker: string) => void;
  onOpenAnalysis: (ticker: string) => void;
}) {
  const [expandedTicker, setExpandedTicker] = useState<string | null>(
    null
  );

  function toggleStrategy(ticker: string) {
    setExpandedTicker((currentTicker) =>
      currentTicker === ticker ? null : ticker
    );
  }

  return (
    <section>
      <SectionLabel>My Watchlist</SectionLabel>

      <ul className="mt-4 flex flex-col gap-3">
        {watchlist.map((stock) => {
          const decision =
            stock.action ?? simplifyDecision(stock.greedScore);

          const strategy = stock.why?.strategy;
          const hasStrategy = Boolean(strategy);
          const isExpanded = expandedTicker === stock.ticker;

          return (
            <li key={stock.ticker}>
              <CardShell>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-white">
                      {stock.company}
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      {stock.ticker}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                          Greed Score
                        </p>

                        <p className="mt-1 text-xl font-extralight text-white">
                          {stock.greedScore}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                          Decision
                        </p>

                        <div className="mt-1.5">
                          <DecisionBadge
                            label={decision}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                          Confidence
                        </p>

                        <p className="mt-1 text-xl font-extralight text-white">
                          {stock.confidence ?? "-"}
                          {stock.confidence !== undefined && (
                            <span className="text-xs text-white/35">
                              %
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {stock.why && (
                        <WhyButton content={stock.why} />
                      )}
                      
                      <button
  type="button"
  onClick={() => onOpenAnalysis(stock.ticker)}
  className="text-xs text-sky-400 transition-colors hover:text-sky-300"
>
  Open Analysis
</button>

                      {hasStrategy && (
                        <button
                          type="button"
                          onClick={() =>
                            toggleStrategy(stock.ticker)
                          }
                          className="text-xs text-emerald-400 transition-colors hover:text-emerald-300"
                        >
                          {isExpanded
                            ? "Hide Strategy"
                            : "View Strategy"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onRemove(stock.ticker)}
                        className="text-xs text-red-400 transition-colors hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    {isExpanded && strategy && (
                      <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                          Saved AI Strategy
                        </p>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {STRATEGY_ITEMS.map((item) => {
                            const detail = strategy[item.key];

                            if (!detail) {
                              return null;
                            }

                            return (
                              <div
                                key={item.key}
                                className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                              >
                                <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                                  {item.label}
                                </p>

                                <div className="mt-2">
                                  <DecisionBadge
                                    label={detail.action}
                                    size="sm"
                                  />
                                </div>

                                <p className="mt-3 text-xs leading-5 text-white/55">
                                  {detail.reason}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardShell>
            </li>
          );
        })}
      </ul>
    </section>
  );
}