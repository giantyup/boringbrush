import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import {
  hasSupabaseEnv,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "./env";

/**
 * Server-side Supabase client bound to the request cookies. Use in Server
 * Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies cannot be set; the
          // middleware refreshes the session so this can be safely ignored.
        }
      },
    },
  });
}

/**
 * Service-role client that bypasses RLS. Server-only. Used for trusted writes
 * such as storing contact requests submitted by anonymous visitors.
 */
export function createServiceClient() {
  if (!hasSupabaseEnv || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export { hasSupabaseEnv };
