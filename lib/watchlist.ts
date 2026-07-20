import { getSupabaseClient } from "@/lib/supabase";

type WatchlistInput = {
  userId: string;
  ticker: string;
  company: string;
  greedScore: number;
  risk: string;
  confidence: number;
  why: unknown;
  action: string;
};

export async function addWatchlistItem(input: WatchlistInput) {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
    .from("watchlists")
    .insert({
      user_id: input.userId,
      ticker: input.ticker,
      company: input.company,
      greed_score: input.greedScore,
      risk: input.risk,
      confidence: input.confidence,
      why: input.why,
      action: input.action,
    })
    .select()
    .single();
  
  console.log("SUPABASE INSERT RESULT:", data);

  if (error) {
    throw error;
  }
}
export async function getWatchlistItems(userId: string) {
    const supabase = getSupabaseClient();
  
    const { data, error } = await supabase
      .from("watchlists")
      .select("ticker, company, greed_score, risk, confidence, why, action")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  
    if (error) {
      throw error;
    }
  
    return data.map((item) => ({
      ticker: item.ticker,
      company: item.company,
      greedScore: item.greed_score,
      risk: item.risk,
      confidence: item.confidence,
      why: item.why,
      action: item.action,
    }));
  }
  export async function deleteWatchlistItem(userId: string, ticker: string) {
    const supabase = getSupabaseClient();
  
    const { error } = await supabase
      .from("watchlists")
      .delete()
      .eq("user_id", userId)
      .eq("ticker", ticker);
  
    if (error) {
      throw error;
    }
  }