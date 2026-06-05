"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminDb } from "@/lib/data/admin";
import { collectionSchema, galleryItemSchema } from "@/lib/validations/admin";
import { slugify } from "@/lib/utils";
import { deleteReplacedStorageUrls } from "@/lib/supabase/storage-utils";
import type { GalleryStatus } from "@/types/database";

export type ActionResult = { ok: boolean; error?: string; id?: string };

const WRITE_BLOCKED_ERROR =
  "Save was blocked by database permissions. Ensure ADMIN_SUPABASE_EMAIL matches the admin allowlist in Supabase (boringbrush_settings.admin_emails).";

function revalidateAll() {
  revalidatePath("/", "layout");
}

// --- Collections -----------------------------------------------------------

export async function saveCollection(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const db = await getAdminDb();
  const data = parsed.data;
  const payload = {
    title: data.title,
    slug: data.slug ? slugify(data.slug) : slugify(data.title),
    description: data.description || null,
    cover_image_url: data.cover_image_url || null,
    cover_display_fit: data.cover_display_fit,
    cover_display_bg: data.cover_display_bg,
    cover_display_aspect: data.cover_display_aspect,
    cover_display_scale: data.cover_display_scale,
    cover_display_pos_x: data.cover_display_pos_x,
    cover_display_pos_y: data.cover_display_pos_y,
    tags: [],
    is_featured: data.is_featured,
    is_published: data.is_published,
  };

  if (id) {
    const { data: updated, error } = await db
      .from("collections")
      .update(payload)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!updated) return { ok: false, error: WRITE_BLOCKED_ERROR };
    revalidateAll();
    return { ok: true, id };
  }

  const { data: created, error } = await db
    .from("collections")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id: created?.id };
}

export async function deleteCollection(id: string): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db.from("collections").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function setCollectionFlag(
  id: string,
  field: "is_featured" | "is_published",
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const payload =
    field === "is_featured" ? { is_featured: value } : { is_published: value };
  const { error } = await db.from("collections").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function reorderCollections(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const updates = ids.map((id, index) =>
    db.from("collections").update({ sort_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  revalidateAll();
  return { ok: true };
}

// --- Gallery items ---------------------------------------------------------

export async function saveGalleryItem(
  id: string | null,
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = galleryItemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const db = await getAdminDb();
  const data = parsed.data;

  let existing: {
    image_url: string;
    thumbnail_url: string | null;
    before_image_url: string | null;
  } | null = null;

  if (id) {
    const { data: row } = await db
      .from("gallery_items")
      .select("image_url, thumbnail_url, before_image_url")
      .eq("id", id)
      .maybeSingle();
    existing = row ?? null;
  }

  const payload = {
    collection_id: data.collection_id,
    title: data.title || null,
    slug: data.title ? slugify(data.title) : null,
    description: data.description || null,
    image_url: data.image_url,
    // Always mirror the main image so public grids/lightboxes stay in sync.
    thumbnail_url: data.image_url,
    before_image_url: data.before_image_url || null,
    artist_notes: data.artist_notes || null,
    size: data.size || null,
    material: data.material || null,
    paint_finish: data.paint_finish || null,
    status: data.status,
    display_fit: data.display_fit,
    display_bg: data.display_bg,
    display_aspect: data.display_aspect,
    display_scale: data.display_scale,
    display_pos_x: data.display_pos_x,
    display_pos_y: data.display_pos_y,
    is_featured: data.is_featured,
    completed_at: data.completed_at || null,
  };

  if (id) {
    const { data: updated, error } = await db
      .from("gallery_items")
      .update(payload)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    if (!updated) return { ok: false, error: WRITE_BLOCKED_ERROR };

    if (existing) {
      await deleteReplacedStorageUrls(
        db,
        [existing.image_url, existing.thumbnail_url, existing.before_image_url],
        [payload.image_url, payload.thumbnail_url, payload.before_image_url],
      );
    }

    revalidateAll();
    return { ok: true, id };
  }

  const { data: created, error } = await db
    .from("gallery_items")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true, id: created?.id };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();

  const { data: existing } = await db
    .from("gallery_items")
    .select("image_url, thumbnail_url, before_image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await db.from("gallery_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (existing) {
    await deleteReplacedStorageUrls(
      db,
      [existing.image_url, existing.thumbnail_url, existing.before_image_url],
      [],
    );
  }

  revalidateAll();
  return { ok: true };
}

export async function setGalleryItemFeatured(
  id: string,
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db.from("gallery_items").update({ is_featured: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function setGalleryItemStatus(
  id: string,
  status: GalleryStatus,
): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db.from("gallery_items").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}

export async function reorderGalleryItems(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const updates = ids.map((id, index) =>
    db.from("gallery_items").update({ sort_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, error: failed.error.message };
  revalidateAll();
  return { ok: true };
}

// --- Contact requests ------------------------------------------------------

export async function setContactRead(
  id: string,
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db.from("contact_requests").update({ is_read: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setContactArchived(
  id: string,
  value: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db
    .from("contact_requests")
    .update({ is_archived: value })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteContact(id: string): Promise<ActionResult> {
  await requireAdmin();
  const db = await getAdminDb();
  const { error } = await db.from("contact_requests").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/contacts");
  revalidatePath("/admin");
  return { ok: true };
}
