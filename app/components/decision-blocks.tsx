import type { DecisionBlock } from "@/lib/greed-decision";

const ACCENT_STYLES: Record<
  DecisionBlock["accent"],
  { border: string; icon: string; glow: string }
> = {
  gold: {
    border: "border-gold/20",
    icon: "text-gold-light",
    glow: "from-gold/10",
  },
  emerald: {
    border: "border-emerald-400/20",
    icon: "text-emerald-300",
    glow: "from-emerald-500/10",
  },
  amber: {
    border: "border-amber-400/20",
    icon: "text-amber-200",
    glow: "from-amber-500/10",
  },
  orange: {
    border: "border-orange-400/20",
    icon: "text-orange-200",
    glow: "from-orange-500/10",
  },
  red: {
    border: "border-red-400/20",
    icon: "text-red-300",
    glow: "from-red-500/10",
  },
};

export function DecisionBlocks({ blocks }: { blocks: DecisionBlock[] }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {blocks.map((block) => {
        const style = ACCENT_STYLES[block.accent];

        return (
          <div
            key={block.id}
            className={`relative overflow-hidden rounded-xl border ${style.border} bg-black/20`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-linear-to-br ${style.glow} to-transparent`}
              aria-hidden="true"
            />
            <div className="relative px-4 py-3.5">
              <span
                className={`text-lg leading-none ${style.icon}`}
                aria-hidden="true"
              >
                {block.icon}
              </span>
              <p className="mt-2 text-sm font-medium text-white/90">
                {block.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">
                {block.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
