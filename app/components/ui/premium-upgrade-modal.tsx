"use client";

import { useRouter } from "next/navigation";

export type PremiumFeature = "watchlist" | "strategy" | "radar";

type PremiumUpgradeModalProps = {
  open: boolean;
  feature: PremiumFeature;
  onClose: () => void;
};

const MODAL_CONTENT: Record<
  PremiumFeature,
  {
    eyebrow: string;
    title: string;
    description: string;
    benefits: string[];
  }
> = {
  watchlist: {
    eyebrow: "Royal Exclusive",
    title: "Unlock unlimited watchlists",
    description:
      "Free members can save up to 3 stocks. Upgrade to Royal to track every opportunity.",
    benefits: [
      "Unlimited watchlist stocks",
      "Unlimited daily analyses",
      "Full AI Strategy access",
      "Full Greed Radar access",
    ],
  },
  strategy: {
    eyebrow: "Royal AI Strategy",
    title: "Unlock short-term strategies",
    description:
      "Access today's, weekly, and monthly AI strategies with Royal membership.",
    benefits: [
      "Today's AI strategy",
      "1-week market outlook",
      "1-month positioning",
      "Unlimited daily analyses",
    ],
  },
  radar: {
    eyebrow: "Royal Greed Radar",
    title: "Unlock premium radar signals",
    description:
      "Reveal Timing, Risk, and Value signals to see the complete Greed Radar.",
    benefits: [
      "Timing signal",
      "Risk signal",
      "Value signal",
      "Full AI Strategy access",
    ],
  },
};

export function PremiumUpgradeModal({
  open,
  feature,
  onClose,
}: PremiumUpgradeModalProps) {
  const router = useRouter();
  const content = MODAL_CONTENT[feature];

  if (!open) {
    return null;
  }

  function handleUpgrade() {
    onClose();
    router.push("/pricing");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-upgrade-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-[#120f09] p-6 shadow-[0_0_80px_rgba(201,169,98,0.16)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xl">
          🔒
        </div>

        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.24em] text-gold/70">
          {content.eyebrow}
        </p>

        <h2
          id="premium-upgrade-title"
          className="mt-2 text-2xl font-light text-white"
        >
          {content.title}
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {content.description}
        </p>

        <ul className="mt-5 flex flex-col gap-2">
          {content.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-center gap-3 text-sm text-white/65"
            >
              <span className="text-gold-light" aria-hidden="true">
                ✓
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUpgrade}
            className="rounded-full bg-gold px-5 py-3 text-sm font-medium text-black transition hover:bg-gold-light"
          >
            Upgrade to Royal
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
          >
            Continue with Free
          </button>
        </div>
      </div>
    </div>
  );
}