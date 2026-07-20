import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type LemonSubscriptionResponse = {
  data?: {
    attributes?: {
      urls?: {
        customer_portal?: string | null;
      };
    };
  };
};

export async function POST() {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

    if (!apiKey) {
      console.error("LEMON_SQUEEZY_API_KEY is missing.");

      return NextResponse.json(
        { error: "Lemon Squeezy API key is not configured." },
        { status: 500 },
      );
    }

    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("membership, lemon_subscription_id")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Failed to load billing profile:", profileError);

      return NextResponse.json(
        { error: "Failed to load subscription information." },
        { status: 500 },
      );
    }

    if (
      profile?.membership !== "ROYAL" ||
      !profile.lemon_subscription_id
    ) {
      return NextResponse.json(
        { error: "No active subscription was found." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions/${profile.lemon_subscription_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
      },
    );

    const result =
      (await response.json()) as LemonSubscriptionResponse;

    if (!response.ok) {
      console.error("Lemon Squeezy subscription request failed:", result);

      return NextResponse.json(
        { error: "Failed to open the subscription portal." },
        { status: response.status },
      );
    }

    const portalUrl =
      result.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      return NextResponse.json(
        { error: "Customer portal URL is unavailable." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      url: portalUrl,
    });
  } catch (error) {
    console.error("Customer portal error:", error);

    return NextResponse.json(
      { error: "Customer portal request failed." },
      { status: 500 },
    );
  }
}