import { CardShell, SectionLabel } from "@/app/components/ui/primitives";
import { AI_BRIEF_INSIGHTS } from "@/lib/dashboard-data";

export function AIBriefCard() {
  return (
    <section>
      <CardShell>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold/70">
          Today&apos;s AI Brief
        </p>

        <ul className="mt-5 flex flex-col gap-4">
          {AI_BRIEF_INSIGHTS.map((insight, index) => (
            <li
              key={insight}
              className="flex gap-3 text-sm leading-relaxed text-white/55"
            >
              <span className="mt-0.5 shrink-0 text-xs font-medium text-gold/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </CardShell>
    </section>
  );
}
