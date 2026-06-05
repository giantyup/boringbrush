import type { Collection, GalleryItem } from "@/types/database";

/**
 * Bundled sample content used when Supabase is not configured yet, so the site
 * is fully browsable out of the box. Mirrors the seed migration. The admin
 * panel replaces all of this once a database is connected.
 */
const now = new Date().toISOString();

export const SAMPLE_COLLECTIONS: Collection[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Yuppie Apes",
    slug: "yuppie-apes",
    description:
      "Sharp suits, sharper attitudes. Boardroom primates rendered in crisp resin and finished with a glossy, corporate sheen.",
    cover_image_url: "/placeholders/collection-yuppie-apes.svg",
    cover_display_fit: "contain",
    cover_display_bg: "studio-grey",
    cover_display_aspect: "landscape",
    cover_display_scale: 100,
    cover_display_pos_x: 0,
    cover_display_pos_y: 0,
    tags: ["apes", "yuppie", "premium"],
    is_featured: true,
    is_published: true,
    sort_order: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Bored Apes",
    slug: "bored-apes",
    description:
      "The originals, unbothered and iconic. Hand-painted fur texture and that famous half-lidded stare.",
    cover_image_url: "/placeholders/collection-bored-apes.svg",
    cover_display_fit: "contain",
    cover_display_bg: "studio-grey",
    cover_display_aspect: "landscape",
    cover_display_scale: 100,
    cover_display_pos_x: 0,
    cover_display_pos_y: 0,
    tags: ["apes", "classic", "iconic"],
    is_featured: true,
    is_published: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "Mutants",
    slug: "mutants",
    description:
      "Glitched, dripping, and gloriously strange. A series for collectors who like their art a little radioactive.",
    cover_image_url: "/placeholders/collection-mutants.svg",
    cover_display_fit: "contain",
    cover_display_bg: "studio-grey",
    cover_display_aspect: "landscape",
    cover_display_scale: 100,
    cover_display_pos_x: 0,
    cover_display_pos_y: 0,
    tags: ["mutant", "experimental", "neon"],
    is_featured: false,
    is_published: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Dengs",
    slug: "dengs",
    description:
      "Playful, rounded, and full of charm. The friendliest faces in the BoringBrush studio.",
    cover_image_url: "/placeholders/collection-dengs.svg",
    cover_display_fit: "contain",
    cover_display_bg: "studio-grey",
    cover_display_aspect: "landscape",
    cover_display_scale: 100,
    cover_display_pos_x: 0,
    cover_display_pos_y: 0,
    tags: ["deng", "cute", "colorful"],
    is_featured: false,
    is_published: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
];

const statuses: GalleryItem["status"][] = [
  "available",
  "sold",
  "commission",
  "available",
];

export const SAMPLE_GALLERY: GalleryItem[] = SAMPLE_COLLECTIONS.flatMap(
  (collection, ci) =>
    Array.from({ length: 4 }).map((_, i) => ({
      id: `${collection.id}-item-${i + 1}`,
      collection_id: collection.id,
      title: `${collection.title} #${i + 1}`,
      slug: `${collection.slug}-${i + 1}`,
      description: `A hand-painted ${collection.title.toLowerCase()} print, finished in the BoringBrush studio.`,
      image_url: `/placeholders/collection-${collection.slug}.svg`,
      thumbnail_url: `/placeholders/collection-${collection.slug}.svg`,
      before_image_url: null,
      artist_notes:
        "Layered base coat, dry-brushed highlights, and a satin sealant for shelf-ready durability.",
      size: '4.5" tall',
      material: "Resin + PLA core",
      paint_finish: "Hand-painted acrylic, satin seal",
      status: statuses[(ci + i) % statuses.length],
      display_fit: "contain",
      display_bg: "studio-grey",
      display_aspect: "square",
      display_scale: 100,
      display_pos_x: 0,
      display_pos_y: 0,
      is_featured: i === 0 && collection.is_featured,
      sort_order: i,
      completed_at: now,
      created_at: now,
      updated_at: now,
    })),
);
