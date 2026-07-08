"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgotMessage, setShowForgotMessage] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => router.push("/"), 500);
  }

  const canSubmit = email.trim() && password.trim() && !submitting;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="animate-pulse-glow absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.12),transparent)]" />
      </div>

      <header className="relative z-10 mx-auto w-full max-w-lg px-6 pt-8 sm:px-8">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-gold-light"
        >
          ← Welcome
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-16 sm:px-8">
        <div className="animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-8 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold/70">
                Sign In
              </p>
              <p className="mt-3 text-sm font-light text-white/40">
                Access your private Greed dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotMessage((prev) => !prev)}
                  className="text-xs font-medium tracking-wide text-gold/60 transition-colors hover:text-gold-light"
                >
                  Forgot Password
                </button>
                {showForgotMessage && (
                  <p className="w-full rounded-xl border border-gold/15 bg-gold/5 px-4 py-3 text-left text-xs leading-relaxed text-white/50">
                    Password reset is available to approved members. Contact
                    membership support with your registered email.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
                <span className="relative">
                  {submitting ? "Signing in…" : "Sign In"}
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-white/30">
              No account?{" "}
              <Link
                href="/apply"
                className="font-medium text-gold/60 transition-colors hover:text-gold-light"
              >
                Request Membership
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
