import { createServerSupabaseClient } from "@/lib/supabase/server";

export const FREE_DAILY_ANALYSIS_LIMIT = 3;

export type DailyUsageResult = {
  allowed: boolean;
  used: number;
  remaining: number;
};

export async function consumeDailyAnalysis(): Promise<DailyUsageResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.rpc(
    "consume_daily_analysis"
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