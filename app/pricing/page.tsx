import Link from "next/link";

import UpgradeButton from "./upgrade-button";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            GREED Membership
          </p>

          <h1 className="mt-4 text-4xl font-light sm:text-5xl">
            Choose Your Access
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45">
            Start with free daily analyses or join Royal 1000 for unlimited
            access.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Free
            </p>

            <div className="mt-5">
              <span className="text-4xl font-light">$0</span>
              <span className="ml-2 text-sm text-white/35">forever</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/45">
              Explore GREED with essential AI stock analysis features.
            </p>

            <div className="mt-8 space-y-4 text-sm text-white/65">
              <p>✓ 3 AI analyses per day</p>
              <p>✓ AI strategy by time horizon</p>
              <p>✓ Personal watchlist</p>
              <p>✓ Daily AI brief</p>
            </div>

            <Link
              href="/dashboard"
              className="mt-10 flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Continue Free
            </Link>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-gold/35 bg-gold/[0.06] p-8">
            <div className="absolute right-6 top-6 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gold-light">
              Limited to 1000
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Royal 1000
            </p>

            <div className="mt-5">
              <span className="text-4xl font-light">$9.99</span>
              <span className="ml-2 text-sm text-white/35">per month</span>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/45">
              Unlimited access for early members of the GREED community.
            </p>

            <div className="mt-8 space-y-4 text-sm text-white/70">
              <p>✓ Unlimited AI analyses</p>
              <p>✓ Full AI strategy access</p>
              <p>✓ Personal watchlist</p>
              <p>✓ Daily AI brief</p>
              <p>✓ Early access to premium features</p>
              <p>✓ Royal founding-member status</p>
            </div>

            <UpgradeButton />
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-white/40 transition hover:text-white/70"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}