/**
 * Hand-maintained types mirroring the Supabase schema in
 * `supabase/migrations`. Regenerate with the Supabase CLI if the schema grows:
 *   supabase gen types typescript --project-id <id> > src/types/database.ts
 */

import type {
  ImageDisplayAspect,
  ImageDisplayBg,
  ImageDisplayFit,
} from "@/lib/image-display";

export type GalleryStatus = "available" | "sold" | "archived" | "commission";

// NOTE: these are `type` aliases (not `interface`) on purpose. Supabase's typed
// client requires each Row to be assignable to `Record<string, unknown>`, which
// type aliases satisfy via an implicit index signature but interfaces do not.
export type Collection = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  cover_display_fit: ImageDisplayFit;
  cover_display_bg: ImageDisplayBg;
  cover_display_aspect: ImageDisplayAspect;
  cover_display_scale: number;
  cover_display_pos_x: number;
  cover_display_pos_y: number;
  tags: string[] | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  collection_id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  before_image_url: string | null;
  artist_notes: string | null;
  size: string | null;
  material: string | null;
  paint_finish: string | null;
  status: GalleryStatus;
  display_fit: ImageDisplayFit;
  display_bg: ImageDisplayBg;
  display_aspect: ImageDisplayAspect;
  display_scale: number;
  display_pos_x: number;
  display_pos_y: number;
  is_featured: boolean;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  twitter_handle: string | null;
  collection_interest: string | null;
  budget: string | null;
  message: string;
  attachment_url: string | null;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
};

export type CollectionWithCount = Collection & { item_count: number };
export type GalleryItemWithCollection = GalleryItem & {
  collection?: Pick<Collection, "title" | "slug"> | null;
};

type Writable<T> = { [K in keyof T]?: T[K] };

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: Collection;
        Insert: Writable<Collection>;
        Update: Writable<Collection>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: Writable<GalleryItem>;
        Update: Writable<GalleryItem>;
        Relationships: [];
      };
      contact_requests: {
        Row: ContactRequest;
        Insert: Writable<ContactRequest>;
        Update: Writable<ContactRequest>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
