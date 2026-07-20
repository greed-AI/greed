import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type LemonSqueezyWebhook = {
  meta?: {
    event_name?: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      customer_id?: number;
      variant_id?: number;
      renews_at?: string | null;
      ends_at?: string | null;
    };
  };
};

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
) {
  const expectedSignature = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const receivedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!webhookSecret) {
      console.error("LEMON_SQUEEZY_WEBHOOK_SECRET is missing.");

      return NextResponse.json(
        { error: "Webhook secret is not configured." },
        { status: 500 },
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase server environment variables are missing.");

      return NextResponse.json(
        { error: "Supabase server configuration is missing." },
        { status: 500 },
      );
    }

    const signature = request.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing X-Signature header." },
        { status: 401 },
      );
    }

    const rawBody = await request.text();

    const isValidSignature = verifyWebhookSignature(
      rawBody,
      signature,
      webhookSecret,
    );

    if (!isValidSignature) {
      console.error("Invalid Lemon Squeezy webhook signature.");

      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 },
      );
    }

    const payload = JSON.parse(rawBody) as LemonSqueezyWebhook;

    const eventName = payload.meta?.event_name;
    const userId = payload.meta?.custom_data?.user_id;
    const subscriptionStatus = payload.data?.attributes?.status;

    console.log("Lemon Squeezy webhook received:", {
      eventName,
      userId,
      subscriptionStatus,
    });

    if (!eventName) {
      return NextResponse.json(
        { error: "Webhook event name is missing." },
        { status: 400 },
      );
    }

    /*
     * 현재 Checkout에서 custom_data.user_id를 전달했다고 가정한다.
     * 이 값으로 Supabase profiles 사용자를 찾는다.
     */
    if (!userId) {
      console.error("Webhook custom_data.user_id is missing.");

      return NextResponse.json(
        { error: "User ID is missing from webhook custom data." },
        { status: 400 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let membership: "FREE" | "ROYAL" | null = null;

    if (
      eventName === "subscription_created" ||
      eventName === "subscription_updated"
    ) {
      membership =
        subscriptionStatus === "expired" ||
        subscriptionStatus === "unpaid"
          ? "FREE"
          : "ROYAL";
    }

    /*
     * subscription_cancelled는 즉시 FREE로 변경하지 않는다.
     * 취소 후에도 결제 종료일까지 구독이 유효할 수 있기 때문이다.
     */
    if (eventName === "subscription_cancelled") {
      membership = "ROYAL";
    }

    if (eventName === "subscription_expired") {
      membership = "FREE";
    }

    if (!membership) {
      return NextResponse.json({
        received: true,
        ignored: true,
        eventName,
      });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        membership,
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update membership:", error);

      return NextResponse.json(
        { error: "Failed to update membership." },
        { status: 500 },
      );
    }

    console.log("Membership updated:", {
      userId,
      membership,
      eventName,
    });

    return NextResponse.json({
      received: true,
      updated: true,
      membership,
    });
  } catch (error) {
    console.error("Lemon Squeezy webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}