import { getSupabaseClient } from "@/lib/supabase";

export async function signUp(
  email: string,
  password: string,
  metadata?: { fullName?: string },
) {
  const supabase = getSupabaseClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata?.fullName
        ? { full_name: metadata.fullName.trim() }
        : undefined,
    },
  });
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = getSupabaseClient();

  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  return { session: data.session, error };
}

export async function getUser() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  return { user: data.user, error };
}
