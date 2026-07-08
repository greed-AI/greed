import { CardShell } from "@/app/components/ui/primitives";

export function AuthCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardShell featured className={className}>
      {children}
    </CardShell>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold/70">
        {title}
      </p>
      {subtitle && (
        <p className="mt-3 text-sm font-light leading-relaxed text-white/40">
          {subtitle}
        </p>
      )}
    </div>
  );
}
