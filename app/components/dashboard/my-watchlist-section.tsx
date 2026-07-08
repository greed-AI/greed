import {
  CardShell,
  DecisionBadge,
  SectionLabel,
} from "@/app/components/ui/primitives";
import { WhyButton } from "@/app/components/ui/why-button";
import { MY_WATCHLIST } from "@/lib/dashboard-data";
import { simplifyDecision } from "@/lib/decision-why";

export function MyWatchlistSection() {
  return (
    <section>
      <SectionLabel>My Watchlist</SectionLabel>

      <ul className="mt-4 flex flex-col gap-3">
        {MY_WATCHLIST.map((stock) => {
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

                    <WhyButton content={stock.why} />
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
