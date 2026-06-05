"use server";

import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  getAdminSessionToken,
} from "@/lib/auth/session";
import { verifyAdminPassword } from "@/lib/auth/password";

export type LoginResult = { ok: boolean; error?: string };

function getAdminSupabaseEmail(): string {
  return (process.env.ADMIN_SUPABASE_EMAIL ?? "solvex82@gmail.com").trim();
}

async function ensureSupabaseAdminAuth(password: string): Promise<string | null> {
  if (createServiceClient()) return null;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: getAdminSupabaseEmail(),
    password,
  });

  if (error) {
    return `Studio password accepted but Supabase sign-in failed: ${error.message}`;
  }

  return null;
}

export async function loginAdmin(password: string): Promise<LoginResult> {
  if (!process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "Admin password is not configured on the server." };
  }

  if (!verifyAdminPassword(password)) {
    return { ok: false, error: "Incorrect password." };
  }

  const supabaseError = await ensureSupabaseAdminAuth(password);
  if (supabaseError) {
    return { ok: false, error: supabaseError };
  }

  const token = await getAdminSessionToken();
  if (!token) {
    return { ok: false, error: "Could not create a session. Check server env vars." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
