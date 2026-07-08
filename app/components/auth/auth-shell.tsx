import Link from "next/link";

export function AuthShell({
  children,
  backHref,
  backLabel = "Back",
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[120px]" />
        <div className="animate-pulse-glow absolute -right-24 bottom-0 h-[480px] w-[480px] rounded-full bg-gold/6 blur-[100px] [animation-delay:3s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {backHref && (
        <header className="relative z-10 mx-auto w-full max-w-lg px-6 pt-8 sm:px-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-gold-light"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backLabel}
          </Link>
        </header>
      )}

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16 sm:px-8">
        <div className="animate-fade-in-up">{children}</div>
      </main>
    </div>
  );
}
