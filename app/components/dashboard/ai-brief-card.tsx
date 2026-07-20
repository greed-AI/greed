"use client";

import { useEffect, useState } from "react";

import {
  CardShell,
  SectionLabel,
} from "@/app/components/ui/primitives";

import type { WatchlistItem } from "@/lib/dashboard-types";

type DashboardBriefResponse = {
  brief?: unknown;
  isFallback?: boolean;
};

const EMPTY_BRIEF = [
  "Add stocks to your watchlist to generate a personalized AI brief.",
];

export function AIBriefCard({
  watchlist,
}: {
  watchlist: WatchlistItem[];
}) {
  const [insights, setInsights] = useState<string[]>(
    watchlist.length === 0 ? EMPTY_BRIEF : []
  );

  const [isLoading, setIsLoading] = useState(
    watchlist.length > 0
  );

  useEffect(() => {
    if (watchlist.length === 0) {
      setInsights(EMPTY_BRIEF);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBrief() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/dashboard-brief", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            watchlist,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load dashboard brief.");
        }

        const data =
          (await response.json()) as DashboardBriefResponse;

        const nextInsights = Array.isArray(data.brief)
          ? data.brief.filter(
              (item): item is string =>
                typeof item === "string"
            )
          : [];

        setInsights(
          nextInsights.length > 0
            ? nextInsights
            : [
                "Your watchlist brief is temporarily unavailable.",
              ]
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Failed to load AI brief:", error);

        setInsights([
          "Your watchlist brief is temporarily unavailable.",
        ]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadBrief();

    return () => {
      controller.abort();
    };
  }, [watchlist]);

  return (
    <section>
      <CardShell>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
            Today&apos;s AI Brief
          </p>

          <p className="text-[10px] uppercase tracking-wider text-white/25">
            {isLoading ? "Generating" : "AI Generated"}
          </p>
        </div>

        <ul className="mt-5 flex flex-col gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((item) => (
                <li
                  key={item}
                  className="flex animate-pulse gap-3"
                >
                  <span className="mt-0.5 h-3 w-5 rounded bg-white/10" />
                  <span className="h-4 flex-1 rounded bg-white/10" />
                </li>
              ))}
            </>
          ) : (
            insights.map((insight, index) => (
              <li
                key={`${index}-${insight}`}
                className="flex gap-3 text-sm leading-relaxed text-white/55"
              >
                <span className="mt-0.5 shrink-0 text-xs font-medium text-gold/50">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{insight}</span>
              </li>
            ))
          )}
        </ul>
      </CardShell>
    </section>
  );
}