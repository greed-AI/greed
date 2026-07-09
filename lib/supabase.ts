import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (!url) {
      throw new Error(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL",
      );
    }

    if (!anonKey) {
      throw new Error(
        "Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }

    client = createBrowserClient(url, anonKey);
  }

  return client;
}
