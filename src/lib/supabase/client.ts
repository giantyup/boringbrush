import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { hasSupabaseEnv, SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Browser-side Supabase client for client components (auth, uploads). */
export function createClient() {
  if (!hasSupabaseEnv) {
    throw new Error(
      "Supabase environment variables are not configured. See .env.example.",
    );
  }
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
