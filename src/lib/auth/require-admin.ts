import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasSupabaseEnv } from "@/lib/supabase/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/session";

export type AdminSession = { authenticated: true };

/**
 * Server-side guard for admin layouts and server actions. Redirects to the
 * login page unless a valid admin session cookie is present.
 */
export async function requireAdmin(): Promise<AdminSession> {
  if (!hasSupabaseEnv) {
    redirect("/admin/login");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifyAdminSessionToken(token);

  if (!valid) {
    redirect("/admin/login");
  }

  return { authenticated: true };
}
