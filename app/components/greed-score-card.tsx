type GreedScoreCardProps = {
  score: number;
  maxScore?: number;
};

export function GreedScoreCard({ score, maxScore = 100 }: GreedScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -inset-px rounded-3xl bg-linear-to-b from-gold/30 via-gold/10 to-transparent opacity-60 blur-sm" />

      <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-8 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/80">
              Greed Score
            </p>
            <p className="mt-1 text-sm text-white/50">Market sentiment index</p>
          </div>
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-light">
            Live
          </span>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative shrink-0">
            <svg
              className="h-32 w-32 -rotate-90"
              viewBox="0 0 120 120"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9a7b3c" />
                  <stop offset="50%" stopColor="#e8d5a3" />
                  <stop offset="100%" stopColor="#c9a962" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-light tracking-tight text-white">
                {score}
              </span>
              <span className="text-xs text-white/40">/ {maxScore}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <Metric label="Momentum" value={78} />
            <Metric label="Volatility" value={65} />
            <Metric label="Confidence" value={91} />
          </div>
        </div>

        <div className="mt-6 border-t border-white/6 pt-5">
          <p className="text-sm leading-relaxed text-white/45">
            Elevated optimism detected across tech and growth sectors. Proceed
            with measured conviction.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-white/40">{label}</span>
        <span className="font-medium text-gold-light">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-linear-to-r from-gold-dark to-gold-light"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
