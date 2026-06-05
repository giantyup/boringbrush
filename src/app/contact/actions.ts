"use server";

import { headers } from "next/headers";
import { contactSchema } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import {
  createClient,
  createServiceClient,
  hasSupabaseEnv,
} from "@/lib/supabase/server";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    twitter_handle: String(formData.get("twitter_handle") ?? ""),
    collection_interest: String(formData.get("collection_interest") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
    attachment_url: String(formData.get("attachment_url") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // Honeypot: a filled hidden field means a bot. Pretend success silently.
  if (raw.website) {
    return { status: "success", message: "Thanks! We'll be in touch soon." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  // Rate limit by hashed IP: max 3 submissions per hour.
  const requestHeaders = await headers();
  const ip = getClientIp(requestHeaders);
  const ipHash = hashIp(ip);
  if (!rateLimit(`contact:${ipHash}`, { max: 3, windowMs: 60 * 60 * 1000 })) {
    return {
      status: "error",
      message: "You've sent several messages recently. Please try again later.",
    };
  }

  const data = parsed.data;

  // Persist to the database. Prefer the service client (bypasses RLS) so the
  // insert always succeeds even with strict policies; fall back to the
  // anon-key client which the RLS policy explicitly allows to INSERT.
  if (hasSupabaseEnv) {
    const db = createServiceClient() ?? (await createClient());
    const { error } = await db.from("contact_requests").insert({
      name: data.name,
      email: data.email,
      twitter_handle: data.twitter_handle || null,
      collection_interest: data.collection_interest || null,
      budget: data.budget || null,
      message: data.message,
      attachment_url: data.attachment_url || null,
    });
    if (error) {
      console.error("[contact] failed to store request:", error.message);
    }
  }

  try {
    await sendContactEmail(data);
  } catch (error) {
    console.error("[contact] email send failed:", error);
    // The request is stored; surface a soft error so the visitor can retry or
    // reach out directly, but do not lose their message.
    return {
      status: "error",
      message:
        "We saved your message but the email notification failed. We'll still see it, or email us directly.",
    };
  }

  return {
    status: "success",
    message: "Thanks! Your inquiry is in. We'll reply soon.",
  };
}
