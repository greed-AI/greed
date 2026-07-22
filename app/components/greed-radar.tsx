import {
  buildGreedRadar,
  radarToMetrics,
  type RadarLevel,
} from "@/lib/greed-radar";
import type { StockAnalysis } from "@/lib/types/analysis";

const LEVEL_LABELS: Record<RadarLevel, string> = {
  1: "Low",
  2: "Fair",
  3: "Moderate",
  4: "Strong",
  5: "Peak",
};

function LevelRating({ level }: { level: RadarLevel }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${level} out of 5`}>
      {([1, 2, 3, 4, 5] as const).map((step) => (
        <span
          key={step}
          className={`h-1.5 w-4 rounded-full transition-colors ${
            step <= level
              ? "bg-linear-to-r from-gold-dark via-gold-light to-gold shadow-[0_0_8px_rgba(201,169,98,0.35)]"
              : "bg-white/8"
          }`}
        />
      ))}
    </div>
  );
}

export function GreedRadarSection({
  analysis,
  membership,
  onLockedClick,
}: {
  analysis: StockAnalysis;
  membership: "FREE" | "ROYAL";
  onLockedClick?: () => void;
}) {
  const scores = buildGreedRadar(analysis);
  const metrics = radarToMetrics(scores);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/2">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,169,98,0.08),transparent)]"
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
            Greed Radar
          </p>
          <span className="text-[10px] uppercase tracking-wider text-white/25">
            5-axis scan
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-4">
        {metrics.map((metric) => {
  const locked =
    membership === "FREE" &&
    ["timing", "risk", "value"].includes(metric.key);

  return (
    <div
      key={metric.key}
      role={locked ? "button" : undefined}
      tabIndex={locked ? 0 : undefined}
      onClick={locked ? onLockedClick : undefined}
      onKeyDown={
        locked
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onLockedClick?.();
              }
            }
          : undefined
      }
      className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border px-4 py-3 ${
        locked
          ? "cursor-pointer border-gold/20 bg-gold/[0.03] transition hover:border-gold/40"
          : "border-white/5 bg-black/20"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between gap-4 ${
          locked ? "select-none blur-[4px]" : ""
        }`}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/90">
            {metric.label}
          </p>

          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">
            {LEVEL_LABELS[metric.level]}
          </p>
        </div>

        <LevelRating level={metric.level} />
      </div>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <div className="flex items-center gap-2">
            <span className="text-sm" aria-hidden="true">
              🔒
            </span>

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-gold-light">
              Royal Only
            </span>
          </div>
        </div>
      )}
    </div>
  );
})}
        </div>
      </div>
    </div>
  );
}

export function GreedRadarPreview() {
  const previewLevels: RadarLevel[] = [4, 4, 3, 2, 4];
  const labels = ["Momentum", "Trend", "Timing", "Risk", "Value"];

  return (
    <div className="mt-6 border-t border-white/6 pt-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-gold/60">
        Greed Radar
      </p>
      <div className="flex flex-col gap-3">
        {labels.map((label, index) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 opacity-50"
          >
            <span className="text-xs text-white/40">{label}</span>
            <LevelRating level={previewLevels[index]!} />
          </div>
        ))}
      </div>
    </div>
  );
}
