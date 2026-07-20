import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type LemonSqueezyCheckoutResponse = {
  data?: {
    attributes?: {
      url?: string;
    };
  };
  errors?: Array<{
    detail?: string;
    title?: string;
  }>;
};

export async function POST() {
  try {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json(
        {
          error: "Lemon Squeezy environment variables are missing.",
        },
        {
          status: 500,
        }
      );
    }

    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          error: "The signed-in user does not have an email address.",
        },
        {
          status: 400,
        }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              product_options: {
                redirect_url: `${appUrl}/dashboard`,
              },
              checkout_options: {
                embed: false,
                media: false,
                logo: true,
                desc: true,
                discount: true,
                locale: "en",
              },
              checkout_data: {
                email: user.email,
                custom: {
                  user_id: user.id,
                },
              },
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId,
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId,
                },
              },
            },
          },
        }),
        cache: "no-store",
      }
    );

    const checkout =
      (await response.json()) as LemonSqueezyCheckoutResponse;

    if (!response.ok) {
      console.error(
        "[/api/checkout] Lemon Squeezy error:",
        checkout.errors
      );

      return NextResponse.json(
        {
          error:
            checkout.errors?.[0]?.detail ??
            checkout.errors?.[0]?.title ??
            "Unable to create checkout.",
        },
        {
          status: response.status,
        }
      );
    }

    const checkoutUrl = checkout.data?.attributes?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        {
          error: "Checkout URL was not returned.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      url: checkoutUrl,
    });
  } catch (error) {
    console.error("[/api/checkout] Failed to create checkout:", error);

    return NextResponse.json(
      {
        error: "Unable to create checkout.",
      },
      {
        status: 500,
      }
    );
  }
}