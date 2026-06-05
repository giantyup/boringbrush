"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { slugify } from "@/lib/utils";

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Upload an admin image via the server using a service-role or authenticated
 * admin Supabase client.
 */
export async function uploadAdminImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "");
  const folder = String(formData.get("folder") ?? "uploads");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image file first." };
  }
  if (bucket !== "covers" && bucket !== "gallery") {
    return { ok: false, error: "Invalid storage bucket." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Only image files are supported." };
  }

  try {
    const supabase = await getAdminSupabaseClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const path = `${slugify(folder) || "uploads"}/${crypto.randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Upload failed.",
    };
  }
}
