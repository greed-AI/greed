import { buildAIStrategy, type AIStrategyItem } from "@/lib/ai-strategy";

const ACTION_COLORS: Record<
  AIStrategyItem["action"],
  { border: string; text: string; glow: string }
> = {
  ACCUMULATE: {
    border: "border-emerald-400/25",
    text: "text-emerald-200",
    glow: "from-emerald-500/10",
  },
  BUY: {
    border: "border-emerald-400/20",
    text: "text-emerald-200/90",
    glow: "from-emerald-500/8",
  },
  HOLD: {
    border: "border-amber-400/25",
    text: "text-amber-100",
    glow: "from-amber-500/10",
  },
  WATCH: {
    border: "border-orange-400/25",
    text: "text-orange-100",
    glow: "from-orange-500/10",
  },
  TRIM: {
    border: "border-red-400/20",
    text: "text-red-200/90",
    glow: "from-red-500/8",
  },
  EXIT: {
    border: "border-red-400/30",
    text: "text-red-100",
    glow: "from-red-500/12",
  },
};

function StrategyCard({ item }: { item: AIStrategyItem }) {
  const colors = ACTION_COLORS[item.action];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${colors.border} bg-white/2`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${colors.glow} to-transparent`}
        aria-hidden="true"
      />
      <div className="relative px-4 py-3.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
          {item.label}
        </p>
        <p
          className={`mt-1.5 text-sm font-medium tracking-wide ${colors.text}`}
        >
          {item.action}
        </p>
        <p className="mt-1 text-xs text-white/40">{item.signal}</p>
        <div className="mt-3 flex gap-0.5">
          {([1, 2, 3, 4, 5] as const).map((step) => (
            <span
              key={step}
              className={`h-0.5 flex-1 rounded-full ${
                step <= item.intensity ? "bg-gold/70" : "bg-white/8"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AIStrategySection({ greedScore }: { greedScore: number }) {
  const strategy = buildAIStrategy(greedScore);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/2">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(201,169,98,0.06),transparent)]"
        aria-hidden="true"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
            AI Strategy
          </p>
          <span className="text-[10px] uppercase tracking-wider text-white/25">
            Score-driven
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {strategy.map((item) => (
            <StrategyCard key={item.horizon} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
