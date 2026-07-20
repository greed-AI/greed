import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const FREE_DAILY_LIMIT = 1;

export async function GET() {
  try {
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

    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_usage")
      .select("analysis_count")
      .eq("user_id", user.id)
      .eq("usage_date", today)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const used = Number(data?.analysis_count ?? 0);
    const remaining = Math.max(FREE_DAILY_LIMIT - used, 0);

    return NextResponse.json({
      used,
      remaining,
      limit: FREE_DAILY_LIMIT,
      allowed: used < FREE_DAILY_LIMIT,
    });
  } catch (error) {
    console.error("[/api/daily-usage] Failed to load usage:", error);

    return NextResponse.json(
      {
        error: "Unable to load daily usage.",
      },
      {
        status: 500,
      }
    );
  }
}