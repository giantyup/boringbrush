import { createHash } from "crypto";

/**
 * Lightweight in-memory rate limiter. Sufficient for a single-instance
 * deployment and as a first line of defence; swap for Upstash/Redis if the
 * site scales horizontally.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true when the action is allowed, false when the limit is exceeded.
 */
export function rateLimit(
  key: string,
  { max = 3, windowMs = 60 * 60 * 1000 }: { max?: number; windowMs?: number } = {},
): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count += 1;
  return true;
}
