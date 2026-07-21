import type { AIStrategyItem } from "@/lib/ai-strategy";
import type { AIStrategy } from "@/lib/types/analysis";
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
  "STRONG BUY": {
  border: "border-emerald-400/30",
  text: "text-emerald-100",
  glow: "from-emerald-500/12",
},
  WAIT: {
    border: "border-orange-400/25",
    text: "text-orange-100",
    glow: "from-orange-500/10",
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

function StrategyCard({
  item,
  locked = false,
  onLockedClick,
}: {
  item: AIStrategyItem;
  locked?: boolean;
  onLockedClick?: () => void;
}) {
  const colors = ACTION_COLORS[item.action] ?? ACTION_COLORS.HOLD;

  return (
    <div
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
  className={`relative overflow-hidden rounded-xl border ${colors.border} bg-white/2 ${
    locked
      ? "cursor-pointer transition hover:border-gold/40 hover:bg-white/4"
      : ""
  }`}
>
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${colors.glow} to-transparent`}
        aria-hidden="true"
      />
      <div className="relative px-4 py-3.5">
  <div className={locked ? "select-none blur-[5px]" : ""}>
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

  {locked && (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 px-3 text-center backdrop-blur-[1px]">
      <span className="text-base" aria-hidden="true">
        🔒
      </span>

      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-gold-light">
        Royal Only
      </p>
    </div>
  )}
</div>
    </div>
  );
}
function getStrategyIntensity(
  action: AIStrategyItem["action"],
): AIStrategyItem["intensity"] {
  switch (action) {
    case "STRONG BUY":
      return 5;
    case "ACCUMULATE":
    case "BUY":
      return 4;
    case "HOLD":
      return 3;
    case "WATCH":
    case "WAIT":
      return 2;
    case "TRIM":
    case "EXIT":
      return 1;
    default:
      return 3;
  }
}
function normalizeStrategyDetail(
  value: unknown,
  fallbackReason: string,
): {
  action: AIStrategyItem["action"];
  reason: string;
} {
  if (
    typeof value === "string" &&
    value in ACTION_COLORS
  ) {
    return {
      action: value as AIStrategyItem["action"],
      reason: fallbackReason,
    };
  }

  if (value && typeof value === "object") {
    const detail = value as {
      action?: unknown;
      reason?: unknown;
    };

    if (
      typeof detail.action === "string" &&
      detail.action in ACTION_COLORS
    ) {
      return {
        action: detail.action as AIStrategyItem["action"],
        reason:
          typeof detail.reason === "string" && detail.reason.trim()
            ? detail.reason
            : fallbackReason,
      };
    }
  }

  return {
    action: "HOLD",
    reason: "Strategy data is temporarily unavailable.",
  };
}
export function AIStrategySection({
  strategy,
  membership,
  onLockedClick,
}: {
  strategy: AIStrategy;
  membership: "FREE" | "ROYAL";
  onLockedClick?: () => void;
}) {
  const today = normalizeStrategyDetail(
    strategy.today,
    "Short-term strategy based on the current Greed analysis.",
  );
  
  const oneWeek = normalizeStrategyDetail(
    strategy.oneWeek,
    "Weekly strategy based on the current Greed analysis.",
  );
  
  const oneMonth = normalizeStrategyDetail(
    strategy.oneMonth,
    "Monthly strategy based on the current Greed analysis.",
  );
  
  const oneYear = normalizeStrategyDetail(
    strategy.oneYear,
    "Long-term strategy based on the current Greed analysis.",
  );
  const strategyItems: AIStrategyItem[] = [
    {
      horizon: "today",
      label: "Today",
      action: today.action,
      signal: today.reason,
      intensity: getStrategyIntensity(today.action),
    },
    {
      horizon: "oneWeek",
      label: "1 Week",
      action: oneWeek.action,
      signal: oneWeek.reason,
      intensity: getStrategyIntensity(oneWeek.action),
    },
    {
      horizon: "oneMonth",
      label: "1 Month",
      action: oneMonth.action,
      signal: oneMonth.reason,
      intensity: getStrategyIntensity(oneMonth.action),
    },
    {
      horizon: "oneYear",
      label: "1 Year",
      action: oneYear.action,
      signal: oneYear.reason,
      intensity: getStrategyIntensity(oneYear.action),
    },
  ];
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
        {strategyItems.map((item) => {
  const locked =
    membership === "FREE" && item.horizon !== "oneYear";

  return (
    <StrategyCard
  key={item.horizon}
  item={item}
  locked={locked}
  onLockedClick={onLockedClick}
/>
  );
})}
        </div>
      </div>
    </div>
  );
}
