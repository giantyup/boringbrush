import "server-only";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";
import type {
  Collection,
  CollectionWithCount,
  GalleryItem,
  GalleryItemWithCollection,
} from "@/types/database";
import { SAMPLE_COLLECTIONS, SAMPLE_GALLERY } from "./sample-data";

/**
 * Public read layer. Every function falls back to bundled sample data when
 * Supabase is not configured, so the marketing site renders without a backend.
 */

export async function getPublishedCollections(): Promise<CollectionWithCount[]> {
  if (!hasSupabaseEnv) {
    return SAMPLE_COLLECTIONS.map((c) => ({
      ...c,
      item_count: SAMPLE_GALLERY.filter((g) => g.collection_id === c.id).length,
    }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*, gallery_items(count)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((c) => {
    const { gallery_items, ...rest } = c as Collection & {
      gallery_items: { count: number }[];
    };
    return { ...rest, item_count: gallery_items?.[0]?.count ?? 0 };
  });
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  if (!hasSupabaseEnv) {
    return SAMPLE_COLLECTIONS.find((c) => c.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  return data ?? null;
}

export async function getGalleryItems(
  collectionId: string,
): Promise<GalleryItem[]> {
  if (!hasSupabaseEnv) {
    return SAMPLE_GALLERY.filter((g) => g.collection_id === collectionId).filter(
      (g) => g.status !== "archived",
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("collection_id", collectionId)
    .neq("status", "archived")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getFeaturedCollections(): Promise<CollectionWithCount[]> {
  const all = await getPublishedCollections();
  const featured = all.filter((c) => c.is_featured);
  return (featured.length ? featured : all).slice(0, 3);
}

export async function getFeaturedItems(
  limit = 6,
): Promise<GalleryItemWithCollection[]> {
  if (!hasSupabaseEnv) {
    return SAMPLE_GALLERY.filter((g) => g.is_featured)
      .slice(0, limit)
      .map(attachSampleCollection);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*, collection:collections(title, slug)")
    .eq("is_featured", true)
    .neq("status", "archived")
    .limit(limit);

  return (data as GalleryItemWithCollection[]) ?? [];
}

export async function getRecentItems(
  limit = 6,
): Promise<GalleryItemWithCollection[]> {
  if (!hasSupabaseEnv) {
    return SAMPLE_GALLERY.slice(0, limit).map(attachSampleCollection);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("*, collection:collections(title, slug)")
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as GalleryItemWithCollection[]) ?? [];
}

function attachSampleCollection(
  item: GalleryItem,
): GalleryItemWithCollection {
  const collection = SAMPLE_COLLECTIONS.find((c) => c.id === item.collection_id);
  return {
    ...item,
    collection: collection
      ? { title: collection.title, slug: collection.slug }
      : null,
  };
}
