import {
  CardShell,
  DecisionBadge,
  SectionLabel,
} from "@/app/components/ui/primitives";


import { simplifyDecision } from "@/lib/decision-why";

type WatchlistItem = {
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
  confidence?: number;
  why?: string;
};

export function MyWatchlistSection({
  watchlist,
  onRemove,
}: {
  watchlist: WatchlistItem[];
  onRemove: (ticker: string) => void;
}) {
  return (
    <section>
      <SectionLabel>My Watchlist</SectionLabel>

      <ul className="mt-4 flex flex-col gap-3">
      {watchlist.map((stock) => {
          const decision = simplifyDecision(stock.greedScore);

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
                          <DecisionBadge label={decision} size="sm" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                          Confidence
                        </p>
                        <p className="mt-1 text-xl font-extralight text-white">
                          {stock.confidence}
                          <span className="text-xs text-white/35">%</span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
  <button
    type="button"
    onClick={() => onRemove(stock.ticker)}
    className="text-xs text-red-400 hover:text-red-300 transition-colors"
  >
    Remove
  </button>
</div>

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
