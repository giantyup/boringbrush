import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import {
  createClient,
  createServiceClient,
  hasSupabaseEnv,
} from "@/lib/supabase/server";
import { getClientIp, hashIp, rateLimit } from "@/lib/rate-limit";

/**
 * REST fallback for the contact form (the site itself uses a server action).
 * Useful for external integrations. Accepts JSON matching the contact schema.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) {
    // Honeypot tripped — pretend success.
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const ipHash = hashIp(getClientIp(request.headers));
  if (!rateLimit(`contact-api:${ipHash}`, { max: 3, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const data = parsed.data;

  if (hasSupabaseEnv) {
    const db = createServiceClient() ?? (await createClient());
    await db.from("contact_requests").insert({
      name: data.name,
      email: data.email,
      twitter_handle: data.twitter_handle || null,
      collection_interest: data.collection_interest || null,
      budget: data.budget || null,
      message: data.message,
      attachment_url: data.attachment_url || null,
    });
  }

  try {
    await sendContactEmail(data);
  } catch {
    return NextResponse.json(
      { ok: true, warning: "stored but email failed" },
      { status: 202 },
    );
  }

  return NextResponse.json({ ok: true });
}
