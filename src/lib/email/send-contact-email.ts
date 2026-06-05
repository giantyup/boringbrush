import { Resend } from "resend";
import type { ContactInput } from "@/lib/validations/contact";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "solvex82@gmail.com";
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "BoringBrush <onboarding@resend.dev>";

export const isEmailConfigured = Boolean(RESEND_API_KEY);

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#211e1c;">${label}</td><td style="padding:6px 12px;color:#686663;">${value}</td></tr>`;
}

/**
 * Sends a formatted notification of a new inquiry. Returns silently (without
 * throwing) when Resend is not configured so the form still works in dev and
 * the request is at least stored in the database.
 */
export async function sendContactEmail(input: ContactInput) {
  if (!RESEND_API_KEY) {
    console.warn("[contact] RESEND_API_KEY not set — skipping email send.");
    return { skipped: true as const };
  }

  const resend = new Resend(RESEND_API_KEY);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:2px solid #211e1c;border-radius:16px;overflow:hidden;">
      <div style="height:8px;background:linear-gradient(90deg,#a5251b,#f09f29,#4caf50,#2196f3,#4f3869);"></div>
      <div style="padding:24px;background:#f0ddc2;">
        <h2 style="margin:0 0 4px;color:#211e1c;">New BoringBrush inquiry</h2>
        <p style="margin:0 0 16px;color:#686663;">A new message arrived from the contact form.</p>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;">
          ${row("Name", input.name)}
          ${row("Email", input.email)}
          ${row("X / Twitter", input.twitter_handle)}
          ${row("Collection", input.collection_interest)}
          ${row("Budget", input.budget)}
          ${row("Attachment", input.attachment_url)}
        </table>
        <h3 style="color:#211e1c;margin:20px 0 6px;">Message</h3>
        <p style="white-space:pre-wrap;color:#211e1c;background:#fff;padding:12px;border-radius:8px;">${input.message}</p>
      </div>
    </div>
  `;

  const text = [
    "New BoringBrush inquiry",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.twitter_handle ? `X/Twitter: ${input.twitter_handle}` : "",
    input.collection_interest ? `Collection: ${input.collection_interest}` : "",
    input.budget ? `Budget: ${input.budget}` : "",
    input.attachment_url ? `Attachment: ${input.attachment_url}` : "",
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL,
    replyTo: input.email,
    subject: `New inquiry from ${input.name}`,
    html,
    text,
  });

  return { skipped: false as const };
}
