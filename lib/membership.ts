import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Membership = "FREE" | "ROYAL";

export async function getCurrentMembership(): Promise<Membership> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Authentication required.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("membership")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        membership: "FREE",
      });

    if (insertError) {
      throw insertError;
    }

    return "FREE";
  }

  return data.membership === "ROYAL" ? "ROYAL" : "FREE";
}

export async function isRoyalMember(): Promise<boolean> {
  const membership = await getCurrentMembership();

  return membership === "ROYAL";
}