import { z } from "zod";

/** Accepts any Postgres-style UUID (including seed IDs like 00000000-…-0001). */
const uuidLike = z
  .string()
  .trim()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Choose a collection.",
  );

/** Absolute URLs or site-relative paths such as /placeholders/foo.svg */
const imageUrl = z
  .string()
  .trim()
  .min(1, "An image is required.")
  .refine((v) => v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "An image is required.",
  });

const optionalImageUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Enter a valid image URL.",
  })
  .optional()
  .or(z.literal(""));

export const imageDisplayFitValues = ["contain", "cover"] as const;
export const imageDisplayBgValues = ["studio-grey", "white", "cream", "sky"] as const;
export const imageDisplayAspectValues = ["square", "portrait", "landscape", "wide"] as const;

export const collectionSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(120),
  slug: z.string().trim().min(2, "Slug is required.").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  cover_image_url: optionalImageUrl,
  cover_display_fit: z.enum(imageDisplayFitValues).default("contain"),
  cover_display_bg: z.enum(imageDisplayBgValues).default("studio-grey"),
  cover_display_aspect: z.enum(imageDisplayAspectValues).default("landscape"),
  cover_display_scale: z.coerce.number().int().min(50).max(200).default(100),
  cover_display_pos_x: z.coerce.number().min(-50).max(50).default(0),
  cover_display_pos_y: z.coerce.number().min(-50).max(50).default(0),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

export const galleryStatusValues = [
  "available",
  "sold",
  "archived",
  "commission",
] as const;

export const galleryItemSchema = z.object({
  collection_id: uuidLike,
  title: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  image_url: imageUrl,
  thumbnail_url: optionalImageUrl,
  before_image_url: optionalImageUrl,
  artist_notes: z.string().trim().max(2000).optional().or(z.literal("")),
  size: z.string().trim().max(120).optional().or(z.literal("")),
  material: z.string().trim().max(120).optional().or(z.literal("")),
  paint_finish: z.string().trim().max(120).optional().or(z.literal("")),
  status: z.enum(galleryStatusValues).default("available"),
  display_fit: z.enum(imageDisplayFitValues).default("contain"),
  display_bg: z.enum(imageDisplayBgValues).default("studio-grey"),
  display_aspect: z.enum(imageDisplayAspectValues).default("square"),
  display_scale: z.coerce.number().int().min(50).max(200).default(100),
  display_pos_x: z.coerce.number().min(-50).max(50).default(0),
  display_pos_y: z.coerce.number().min(-50).max(50).default(0),
  is_featured: z.boolean().default(false),
  completed_at: z.string().trim().optional().or(z.literal("")),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
