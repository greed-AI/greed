"use client";

import { getGreeting, USER_NAME } from "@/lib/dashboard-data";

export function GreetingSection() {
  const greeting = getGreeting();

  return (
    <section>
      <h1 className="text-3xl font-extralight tracking-wide text-white sm:text-4xl">
        {greeting}, {USER_NAME}.
      </h1>
      <p className="mt-3 max-w-lg text-base font-light leading-relaxed text-white/45 sm:text-lg">
        AI has detected today&apos;s most important market changes.
      </p>
    </section>
  );
}
