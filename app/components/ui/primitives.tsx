export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
      {children}
    </p>
  );
}

export function CardShell({
  children,
  className = "",
  featured = false,
}: {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`absolute -inset-px rounded-3xl bg-linear-to-b opacity-60 blur-sm ${
          featured
            ? "from-gold/40 via-gold/15 to-transparent"
            : "from-gold/30 via-gold/10 to-transparent"
        }`}
      />
      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
        {children}
      </div>
    </div>
  );
}

export function DemoModeBadge() {
  return (
    <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-200/90">
      Demo Mode
    </span>
  );
}

export function RiskBadge({ level }: { level: string }) {
  const styles =
    level === "Low"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300/80"
      : level === "High"
        ? "border-red-500/20 bg-red-500/10 text-red-300/80"
        : "border-amber-500/20 bg-amber-500/10 text-amber-300/80";

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles}`}
    >
      {level} Risk
    </span>
  );
}

export function DecisionBadge({
  label,
  size = "md",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const isBuy = label === "STRONG BUY" || label === "BUY";
  const isHold = label === "HOLD" || label === "WAIT";
  const isSell = label === "REDUCE" || label === "SELL";

  const color = isBuy
    ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-200"
    : isHold
      ? "border-amber-400/25 bg-amber-500/10 text-amber-100"
      : isSell
        ? "border-red-400/25 bg-red-500/10 text-red-200"
        : "border-orange-400/25 bg-orange-500/10 text-orange-100";

  const sizeClass =
    size === "lg"
      ? "px-5 py-2.5 text-base tracking-[0.12em]"
      : size === "sm"
        ? "px-2.5 py-1 text-[10px] tracking-wider"
        : "px-4 py-2 text-sm tracking-[0.1em]";

  return (
    <span
      className={`inline-flex rounded-full border font-medium uppercase ${color} ${sizeClass}`}
    >
      {label}
    </span>
  );
}
