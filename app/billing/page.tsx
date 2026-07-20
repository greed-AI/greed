import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
        membership,
        subscription_status,
        renews_at,
        ends_at,
        lemon_customer_id,
        lemon_subscription_id
      `,
    )
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Failed to load billing profile:", error);
  }

  const isRoyal = profile?.membership === "ROYAL";

  const formatDate = (value: string | null | undefined) => {
    if (!value) {
      return "Not available";
    }

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  };

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm tracking-[0.35em] text-[#b99a52]">
          GREED
        </p>

        <h1 className="text-4xl font-light">Billing</h1>

        <p className="mt-3 text-sm text-neutral-400">
          View your membership and subscription details.
        </p>

        <section className="mt-10 rounded-3xl border border-[#4d4023] bg-[#0d0b07] p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.25em] text-[#b99a52]">
                CURRENT PLAN
              </p>

              <h2 className="mt-3 text-3xl">
                {isRoyal ? "Royal Membership" : "Free Membership"}
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                {isRoyal
                  ? "Unlimited AI stock analyses are active."
                  : "Your account currently uses the free plan."}
              </p>
            </div>

            <span className="rounded-full border border-[#66542b] px-4 py-2 text-sm text-[#d6ba72]">
              {isRoyal ? "ROYAL" : "FREE"}
            </span>
          </div>

          <div className="mt-10 grid gap-6 border-t border-neutral-800 pt-8 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Subscription status
              </p>

              <p className="mt-2 text-lg">
                {profile?.subscription_status ?? "Not available"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Next renewal
              </p>

              <p className="mt-2 text-lg">
                {formatDate(profile?.renews_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Subscription ends
              </p>

              <p className="mt-2 text-lg">
                {formatDate(profile?.ends_at)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                Subscription ID
              </p>

              <p className="mt-2 break-all text-sm text-neutral-300">
                {profile?.lemon_subscription_id ?? "Not available"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}