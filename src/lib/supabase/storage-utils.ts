import { SUPABASE_URL } from "./env";

/**
 * Parse a Supabase Storage public URL into bucket + object path.
 * Example: …/storage/v1/object/public/gallery/yuppie-apes/abc.jpg
 */
export function parseSupabaseStorageUrl(
  url?: string | null,
): { bucket: string; path: string } | null {
  if (!url || !SUPABASE_URL) return null;
  try {
    const base = new URL(SUPABASE_URL).origin;
    if (!url.startsWith(base)) return null;
    const marker = "/storage/v1/object/public/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const rest = url.slice(idx + marker.length);
    const slash = rest.indexOf("/");
    if (slash === -1) return null;
    return {
      bucket: rest.slice(0, slash),
      path: decodeURIComponent(rest.slice(slash + 1)),
    };
  } catch {
    return null;
  }
}

/** Delete a stored object when its public URL points at this project's storage. */
export async function deleteStorageFileByUrl(
  supabase: { storage: { from: (bucket: string) => { remove: (paths: string[]) => Promise<{ error: unknown }> } } },
  url?: string | null,
) {
  const parsed = parseSupabaseStorageUrl(url);
  if (!parsed) return;
  await supabase.storage.from(parsed.bucket).remove([parsed.path]);
}

/** Delete replaced storage URLs (deduped, skips placeholders and external URLs). */
export async function deleteReplacedStorageUrls(
  supabase: Parameters<typeof deleteStorageFileByUrl>[0],
  previous: Array<string | null | undefined>,
  next: Array<string | null | undefined>,
) {
  const nextSet = new Set(next.filter(Boolean));
  const toDelete = [...new Set(previous.filter((url) => url && !nextSet.has(url)))];
  await Promise.all(toDelete.map((url) => deleteStorageFileByUrl(supabase, url)));
}
