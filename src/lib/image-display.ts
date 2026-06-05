import type { CSSProperties } from "react";

export type ImageDisplayFit = "contain" | "cover";
export type ImageDisplayBg = "studio-grey" | "white" | "cream" | "sky";
export type ImageDisplayAspect = "square" | "portrait" | "landscape" | "wide";

export type ImageDisplaySettings = {
  fit: ImageDisplayFit;
  bg: ImageDisplayBg;
  aspect: ImageDisplayAspect;
  scale: number;
  posX: number;
  posY: number;
};

export const defaultImageDisplay: ImageDisplaySettings = {
  fit: "contain",
  bg: "studio-grey",
  aspect: "square",
  scale: 100,
  posX: 0,
  posY: 0,
};

export const imageDisplayFitOptions: { value: ImageDisplayFit; label: string }[] = [
  { value: "contain", label: "Show full image" },
  { value: "cover", label: "Fill frame (crop edges)" },
];

export const imageDisplayBgOptions: { value: ImageDisplayBg; label: string }[] = [
  { value: "studio-grey", label: "Studio grey" },
  { value: "white", label: "White" },
  { value: "cream", label: "Cream" },
  { value: "sky", label: "Sky blue" },
];

export const imageDisplayAspectOptions: { value: ImageDisplayAspect; label: string }[] = [
  { value: "square", label: "Square (1:1)" },
  { value: "portrait", label: "Portrait (3:4)" },
  { value: "landscape", label: "Landscape (4:3)" },
  { value: "wide", label: "Wide (16:9)" },
];

const aspectClasses: Record<ImageDisplayAspect, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-video",
};

const bgClasses: Record<ImageDisplayBg, string> = {
  "studio-grey": "bg-studio-grey",
  white: "bg-white",
  cream: "bg-cream-light",
  sky: "bg-sky",
};

export function clampDisplayScale(value: number): number {
  return Math.min(200, Math.max(50, Math.round(value)));
}

export function clampDisplayPos(value: number): number {
  return Math.min(50, Math.max(-50, Math.round(value * 10) / 10));
}

export function resolveImageDisplay(
  settings?: Partial<ImageDisplaySettings> | null,
): ImageDisplaySettings {
  return {
    fit: settings?.fit ?? defaultImageDisplay.fit,
    bg: settings?.bg ?? defaultImageDisplay.bg,
    aspect: settings?.aspect ?? defaultImageDisplay.aspect,
    scale: clampDisplayScale(settings?.scale ?? defaultImageDisplay.scale),
    posX: clampDisplayPos(settings?.posX ?? defaultImageDisplay.posX),
    posY: clampDisplayPos(settings?.posY ?? defaultImageDisplay.posY),
  };
}

export function getImageDisplayContainerClass(
  settings?: Partial<ImageDisplaySettings> | null,
): string {
  const resolved = resolveImageDisplay(settings);
  return `relative overflow-hidden ${aspectClasses[resolved.aspect]} ${bgClasses[resolved.bg]}`;
}

export function getImageDisplayImageClass(): string {
  return "object-contain object-center drop-shadow-sm";
}

export function getImageDisplayTransformStyle(
  settings?: Partial<ImageDisplaySettings> | null,
): CSSProperties {
  const resolved = resolveImageDisplay(settings);
  return {
    transform: `translate(${resolved.posX}%, ${resolved.posY}%) scale(${resolved.scale / 100})`,
    transformOrigin: "center center",
  };
}

export function galleryItemDisplaySettings(
  item: Partial<
    Pick<
      import("@/types/database").GalleryItem,
      | "display_fit"
      | "display_bg"
      | "display_aspect"
      | "display_scale"
      | "display_pos_x"
      | "display_pos_y"
    >
  >,
): ImageDisplaySettings {
  return resolveImageDisplay({
    fit: item.display_fit,
    bg: item.display_bg,
    aspect: item.display_aspect,
    scale: item.display_scale,
    posX: item.display_pos_x != null ? Number(item.display_pos_x) : undefined,
    posY: item.display_pos_y != null ? Number(item.display_pos_y) : undefined,
  });
}

export function collectionCoverDisplaySettings(
  collection: Partial<
    Pick<
      import("@/types/database").Collection,
      | "cover_display_fit"
      | "cover_display_bg"
      | "cover_display_aspect"
      | "cover_display_scale"
      | "cover_display_pos_x"
      | "cover_display_pos_y"
    >
  >,
): ImageDisplaySettings {
  return resolveImageDisplay({
    fit: collection.cover_display_fit,
    bg: collection.cover_display_bg,
    aspect: collection.cover_display_aspect,
    scale: collection.cover_display_scale,
    posX:
      collection.cover_display_pos_x != null
        ? Number(collection.cover_display_pos_x)
        : undefined,
    posY:
      collection.cover_display_pos_y != null
        ? Number(collection.cover_display_pos_y)
        : undefined,
  });
}

export function imageDisplayToGalleryFields(settings: ImageDisplaySettings) {
  return {
    display_fit: "contain" as const,
    display_bg: settings.bg,
    display_aspect: settings.aspect,
    display_scale: settings.scale,
    display_pos_x: settings.posX,
    display_pos_y: settings.posY,
  };
}

export function imageDisplayToCoverFields(settings: ImageDisplaySettings) {
  return {
    cover_display_fit: "contain" as const,
    cover_display_bg: settings.bg,
    cover_display_aspect: settings.aspect,
    cover_display_scale: settings.scale,
    cover_display_pos_x: settings.posX,
    cover_display_pos_y: settings.posY,
  };
}
