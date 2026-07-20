import { createServerSupabaseClient } from "@/lib/supabase/server";

export const FREE_DAILY_ANALYSIS_LIMIT = 1;

export type DailyUsageResult = {
  allowed: boolean;
  used: number;
  remaining: number;
};

export async function consumeDailyAnalysis(): Promise<DailyUsageResult> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authentication required.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("membership")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  // ROYAL 회원은 사용량을 차감하지 않고 항상 분석을 허용한다.
  if (profile?.membership === "ROYAL") {
    return {
      allowed: true,
      used: 0,
      remaining: Number.MAX_SAFE_INTEGER,
    };
  }

  // FREE 회원만 하루 1회 사용량을 차감한다.
  const { data, error } = await supabase.rpc(
    "consume_daily_analysis",
  );

  if (error) {
    throw error;
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result) {
    throw new Error("Daily usage result was not returned.");
  }

  return {
    allowed: Boolean(result.allowed),
    used: Number(result.used ?? 0),
    remaining: Number(result.remaining ?? 0),
  };
}