"use client";

import Link from "next/link";
import { CardShell, SectionLabel } from "@/app/components/ui/primitives";
import { FormEvent } from "react";

type AnalyzeSectionProps = {
  ticker: string;
  onTickerChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
  showUpgrade?: boolean;
};

export function AnalyzeSection({
  ticker,
  onTickerChange,
  onSubmit,
  isLoading,
  disabled,
  showUpgrade,
}: AnalyzeSectionProps) {
  return (
    <section id="analyze">
      <SectionLabel>Analyze Any Stock</SectionLabel>

      <CardShell className="mt-4">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={ticker}
            onChange={(e) => onTickerChange(e.target.value)}
            placeholder="Enter ticker or company name"
            className="w-full rounded-full border border-surface-border bg-black/30 px-6 py-4 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
          <button
            type="submit"
            disabled={!ticker.trim() || isLoading || disabled}
            className="group relative w-full shrink-0 overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
          >
            <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0 bg-linear-to-r from-gold-light via-white/90 to-gold-light" />
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? "Analyzing…" : "Analyze"}
              {!isLoading && (
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </span>
          </button>
        </form>
        {showUpgrade && (
  <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 p-4">
    <p className="text-sm text-white/70">
      You've reached today's free analysis limit.
    </p>

    <p className="mt-1 text-xs text-white/45">
      Upgrade to Royal 1000 for unlimited AI analyses.
    </p>

    <Link
      href="/pricing"
      className="mt-4 inline-flex rounded-full bg-gold px-5 py-2 text-sm font-medium text-black transition hover:opacity-90"
    >
      Upgrade to Royal
    </Link>
  </div>
)}
      </CardShell>
    </section>
  );
}
