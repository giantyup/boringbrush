import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { createServiceClient } from "@/lib/supabase/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

function getAdminSupabaseEmail(): string {
  return (process.env.ADMIN_SUPABASE_EMAIL ?? "solvex82@gmail.com").trim();
}

/**
 * Supabase client for admin writes (database + storage).
 * 1. Service-role key from env (bypasses RLS)
 * 2. Fresh sign-in with studio credentials (passes is_admin() RLS)
 */
export async function getAdminSupabaseClient() {
  const service = createServiceClient();
  if (service) return service;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "Admin credentials missing. Set ADMIN_PASSWORD in .env.local.",
    );
  }

  const supabase = createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: getAdminSupabaseEmail(),
    password,
  });

  if (error) {
    throw new Error(`Supabase admin auth failed: ${error.message}`);
  }

  return supabase;
}
