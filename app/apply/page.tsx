"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner — Less than 1 year" },
  { value: "intermediate", label: "Intermediate — 1 to 5 years" },
  { value: "experienced", label: "Experienced — 5 to 10 years" },
  { value: "professional", label: "Professional — 10+ years" },
];

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "SG", label: "Singapore" },
  { value: "KR", label: "South Korea" },
  { value: "JP", label: "Japan" },
  { value: "OTHER", label: "Other" },
];

export default function ApplyPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  const [reason, setReason] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accepted) return;
    setSubmitting(true);
    setTimeout(() => router.push("/application-success"), 600);
  }

  const canSubmit =
    fullName.trim() &&
    email.trim() &&
    country &&
    experience &&
    reason.trim() &&
    accepted &&
    !submitting;

  const inputClass =
    "w-full rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20";

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

      <main className="relative z-10 mx-auto w-full max-w-lg px-6 py-12 sm:px-8">
        <div className="animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-8 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold/70">
                Request Membership
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

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
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Investment Experience
                </label>
                <select
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
                >
                  Why do you want to join Greed?
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tell us what you're looking for…"
                  required
                  rows={4}
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              <label
                htmlFor="terms"
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/6 bg-white/2 px-4 py-3.5"
              >
                <input
                  id="terms"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a962]"
                />
                <span className="text-sm leading-relaxed text-white/50">
                  I understand Greed is a private premium membership.
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-full px-10 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-linear-to-r from-gold-dark via-gold-light to-gold animate-shimmer bg-size-[200%_auto]" />
                <span className="relative">
                  {submitting ? "Submitting…" : "Submit Application"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
