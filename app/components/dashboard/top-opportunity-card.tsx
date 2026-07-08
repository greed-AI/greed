import { CardShell, DecisionBadge, SectionLabel } from "@/app/components/ui/primitives";
import { WhyButton } from "@/app/components/ui/why-button";
import { TOP_OPPORTUNITY } from "@/lib/dashboard-data";

export function TopOpportunityCard() {
  const { ticker, company, decision, confidence, reason, greedScore, why } =
    TOP_OPPORTUNITY;

  return (
    <section>
      <SectionLabel>Today&apos;s Top Opportunity</SectionLabel>

      <CardShell featured className="mt-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-light tracking-wide text-gold-light">
                {ticker}
              </p>
              <span className="text-sm text-white/40">{company}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                  Decision
                </p>
                <div className="mt-2">
                  <DecisionBadge label={decision} size="lg" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                  Confidence
                </p>
                <p className="mt-2 text-2xl font-extralight text-white">
                  {confidence}
                  <span className="text-sm text-white/35">%</span>
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/50">{reason}</p>
            <WhyButton content={why} size="md" />
          </div>

          <div className="flex shrink-0 flex-col items-end">
            <p className="text-5xl font-extralight text-white">{greedScore}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
              Greed Score
            </p>
          </div>
        </div>
      </CardShell>
    </section>
  );
}
