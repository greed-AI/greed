import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[120px]" />
        <div className="animate-pulse-glow absolute -right-24 bottom-0 h-[480px] w-[480px] rounded-full bg-gold/6 blur-[100px] [animation-delay:3s]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="animate-fade-in-up w-full text-center">
          <p className="text-sm font-medium tracking-[0.35em] text-gold">
            GREED
          </p>

          <h1 className="mt-10 text-2xl font-extralight tracking-wide text-white sm:text-3xl">
            Private Investment Intelligence
          </h1>

          <p className="mt-4 text-sm font-light leading-relaxed text-white/40 sm:text-base">
            Not for everyone. For serious investors.
          </p>

          <div className="mt-10 rounded-2xl border border-gold/15 bg-gold/5 px-6 py-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-gold/50">
              Membership Status
            </p>
            <p className="mt-2 text-lg font-light text-gold-light">
              347 / 1000 Founder Spots Filled
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-linear-to-r from-gold-dark via-gold-light to-gold"
                style={{ width: "34.7%" }}
              />
            </div>
          </div>

          <div className="mt-12 flex w-full flex-col gap-3">
            <Link
              href="/apply"
              className="group relative w-full overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
              <span className="relative">Request Membership</span>
            </Link>

            <Link
              href="/sign-in"
              className="flex w-full items-center justify-center rounded-full border border-gold/25 bg-gold/5 px-10 py-4 text-sm font-medium tracking-wide text-gold-light transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
