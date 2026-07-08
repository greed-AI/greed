import { CardShell, RiskBadge, SectionLabel } from "@/app/components/ui/primitives";
import { MARKET_PULSE } from "@/lib/dashboard-data";

const OVERALL_STYLES = {
  Bullish: "text-emerald-300",
  Neutral: "text-amber-200",
  Bearish: "text-red-300",
} as const;

export function MarketPulseSection() {
  const { overall, aiConfidence, marketRisk } = MARKET_PULSE;

  return (
    <section>
      <SectionLabel>Market Pulse</SectionLabel>

      <CardShell className="mt-4">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Overall Market
            </p>
            <p
              className={`mt-2 text-2xl font-extralight tracking-wide ${OVERALL_STYLES[overall]}`}
            >
              {overall}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              AI Confidence
            </p>
            <p className="mt-2 text-2xl font-extralight text-white">
              {aiConfidence}
              <span className="text-sm text-white/35">%</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">
              Market Risk
            </p>
            <div className="mt-2">
              <RiskBadge level={marketRisk} />
            </div>
          </div>
        </div>
      </CardShell>
    </section>
  );
}
