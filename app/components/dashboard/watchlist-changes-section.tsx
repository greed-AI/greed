import { DecisionBadge, SectionLabel } from "@/app/components/ui/primitives";
import { WhyButton } from "@/app/components/ui/why-button";
import { WATCHLIST_CHANGES } from "@/lib/dashboard-data";

export function WatchlistChangesSection() {
  return (
    <section>
      <SectionLabel>Watchlist Changes</SectionLabel>

      <ul className="mt-4 flex flex-col gap-3">
        {WATCHLIST_CHANGES.map((change) => (
          <li
            key={change.ticker}
            className="rounded-2xl border border-white/6 bg-white/2 px-5 py-4 backdrop-blur-xl transition-colors hover:border-gold/15"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gold-light">
                  {change.company}
                </p>
                <p className="mt-0.5 text-xs text-white/35">{change.ticker}</p>
              </div>

              <div className="flex items-center gap-2">
                <DecisionBadge label={change.from} size="sm" />
                <span className="text-white/25" aria-hidden="true">
                  →
                </span>
                <DecisionBadge label={change.to} size="sm" />
              </div>
            </div>

            <div className="mt-3 border-t border-white/5 pt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                Reason
              </p>
              <p className="mt-1 text-sm text-white/55">{change.reason}</p>
              <WhyButton content={change.why} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
