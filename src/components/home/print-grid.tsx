"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { GalleryItemWithCollection } from "@/types/database";
import { galleryItemDisplaySettings } from "@/lib/image-display";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";

export function PrintGrid({
  items,
  size = "default",
}: {
  items: GalleryItemWithCollection[];
  size?: "default" | "medium" | "compact";
}) {
  const compact = size === "compact";
  const medium = size === "medium";

  return (
    <div
      className={
        compact
          ? "mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          : medium
            ? "mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
            : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3"
      }
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
        >
          <Link
            href={
              item.collection?.slug
                ? `/collections/${item.collection.slug}`
                : "/collections"
            }
            className={
              compact || medium
                ? "group block overflow-hidden rounded-xl border-2 border-ink bg-cream-light shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                : "group block overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            }
          >
            <ImageDisplayFrame
              src={item.thumbnail_url || item.image_url}
              alt={item.title ?? "BoringBrush print"}
              settings={galleryItemDisplaySettings(item)}
              sizes={
                compact
                  ? "(max-width: 640px) 33vw, 12vw"
                  : medium
                    ? "(max-width: 640px) 50vw, 22vw"
                    : "(max-width: 640px) 50vw, 33vw"
              }
              loading="lazy"
            >
              <div
                className={
                  compact
                    ? "absolute right-1 top-1 origin-top-right scale-75"
                    : medium
                      ? "absolute right-1 top-1 origin-top-right scale-[0.85]"
                      : "absolute right-1.5 top-1.5 scale-90"
                }
              >
                <StatusBadge status={item.status} />
              </div>
            </ImageDisplayFrame>
            <p
              className={
                compact
                  ? "truncate px-2 py-1.5 text-[10px] font-semibold sm:text-xs"
                  : medium
                    ? "truncate px-2 py-1.5 text-xs font-semibold"
                    : "truncate px-2.5 py-2 text-xs font-semibold"
              }
            >
              {item.title ?? "Untitled"}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
