import Link from "next/link";

export default function ApplicationSuccessPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16 sm:px-8">
        <div className="animate-fade-in-scale">
          <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-gold/10">
                <svg
                  className="h-7 w-7 text-gold-light animate-draw-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="mt-8 text-2xl font-extralight tracking-wide text-white sm:text-3xl">
                Application Received.
              </h1>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
                We will review your application.
              </p>

              <div className="mt-10 flex w-full flex-col gap-3">
                <Link
                  href="/welcome"
                  className="group relative w-full overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
                  <span className="relative">Return to Welcome</span>
                </Link>

                <Link
                  href="/sign-in"
                  className="flex w-full items-center justify-center rounded-full border border-gold/25 bg-gold/5 px-10 py-4 text-sm font-medium tracking-wide text-gold-light transition-all duration-300 hover:border-gold/40 hover:bg-gold/10"
                >
                  Sign In
                </Link>
              </div>

              <Link
                href="/"
                className="mt-6 text-xs font-medium uppercase tracking-wider text-white/25 transition-colors hover:text-gold-light"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
