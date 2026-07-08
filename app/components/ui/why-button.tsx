"use client";

import { useState } from "react";
import type { WhyContent } from "@/lib/decision-why";

type WhyButtonProps = {
  content: WhyContent;
  size?: "sm" | "md";
};

export function WhyButton({ content, size = "sm" }: WhyButtonProps) {
  const [open, setOpen] = useState(false);

  const buttonClass =
    size === "sm"
      ? "text-[11px] tracking-wide"
      : "text-xs tracking-wide";

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={`rounded-full border border-gold/20 bg-gold/5 px-3 py-1 font-medium text-gold-light/80 transition-colors hover:border-gold/35 hover:bg-gold/10 ${buttonClass}`}
      >
        Why?
      </button>

      {open && (
        <ul className="mt-3 flex flex-col gap-2 rounded-xl border border-white/6 bg-black/20 px-4 py-3">
          <WhyBullet label="Momentum" text={content.momentum} />
          <WhyBullet label="Trend" text={content.trend} />
          <WhyBullet label="Risk" text={content.risk} />
          <WhyBullet label="Value" text={content.value} />
        </ul>
      )}
    </div>
  );
}

function WhyBullet({ label, text }: { label: string; text: string }) {
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-white/50">
      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
      <span>
        <span className="font-medium text-white/70">{label}</span>
        {" — "}
        {text}
      </span>
    </li>
  );
}
