import "server-only";
import { getAdminSupabaseClient } from "@/lib/supabase/admin-client";
import { hasSupabaseEnv } from "@/lib/supabase/server";
import type {
  Collection,
  ContactRequest,
  GalleryItemWithCollection,
} from "@/types/database";

/**
 * Returns a Supabase client suitable for admin reads/writes. Prefers the
 * service-role client (bypasses RLS) so the panel works without requiring the
 * `app.admin_emails` database setting; access is already gated by
 * `requireAdmin()` at the application layer. Falls back to the authenticated
 * server client, which relies on the `is_admin()` RLS policy.
 */
export async function getAdminDb() {
  return getAdminSupabaseClient();
}

export interface AdminStats {
  collections: number;
  images: number;
  featured: number;
  unread: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!hasSupabaseEnv) return { collections: 0, images: 0, featured: 0, unread: 0 };
  const db = await getAdminDb();

  const [collections, images, featured, unread] = await Promise.all([
    db.from("collections").select("*", { count: "exact", head: true }),
    db.from("gallery_items").select("*", { count: "exact", head: true }),
    db
      .from("collections")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    db
      .from("contact_requests")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)
      .eq("is_archived", false),
  ]);

  return {
    collections: collections.count ?? 0,
    images: images.count ?? 0,
    featured: featured.count ?? 0,
    unread: unread.count ?? 0,
  };
}

export async function getAllCollections(): Promise<
  (Collection & { item_count: number })[]
> {
  if (!hasSupabaseEnv) return [];
  const db = await getAdminDb();
  const { data } = await db
    .from("collections")
    .select("*, gallery_items(count)")
    .order("sort_order", { ascending: true });

  return (
    data?.map((c) => {
      const { gallery_items, ...rest } = c as Collection & {
        gallery_items: { count: number }[];
      };
      return { ...rest, item_count: gallery_items?.[0]?.count ?? 0 };
    }) ?? []
  );
}

export async function getAdminCollection(id: string): Promise<Collection | null> {
  if (!hasSupabaseEnv) return null;
  const db = await getAdminDb();
  const { data } = await db.from("collections").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getCollectionOptions(): Promise<
  Pick<Collection, "id" | "title" | "slug">[]
> {
  if (!hasSupabaseEnv) return [];
  const db = await getAdminDb();
  const { data } = await db
    .from("collections")
    .select("id, title, slug")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAdminGalleryItems(
  collectionId?: string,
): Promise<GalleryItemWithCollection[]> {
  if (!hasSupabaseEnv) return [];
  const db = await getAdminDb();
  let query = db
    .from("gallery_items")
    .select("*, collection:collections(title, slug)")
    .order("collection_id", { ascending: true })
    .order("sort_order", { ascending: true });

  if (collectionId) query = query.eq("collection_id", collectionId);

  const { data } = await query;
  return (data as GalleryItemWithCollection[]) ?? [];
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  if (!hasSupabaseEnv) return [];
  const db = await getAdminDb();
  const { data } = await db
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getRecentContacts(limit = 5): Promise<ContactRequest[]> {
  if (!hasSupabaseEnv) return [];
  const db = await getAdminDb();
  const { data } = await db
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
