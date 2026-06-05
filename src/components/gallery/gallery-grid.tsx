"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GalleryItem } from "@/types/database";
import { galleryItemDisplaySettings } from "@/lib/image-display";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";
import { GalleryLightbox } from "./gallery-lightbox";

export function GalleryGrid({
  items,
  collectionTitle,
  collectionSlug,
}: {
  items: GalleryItem[];
  collectionTitle: string;
  collectionSlug: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.25) }}
            className="group flex h-full w-full flex-col overflow-hidden rounded-card border-2 border-ink bg-cream-light text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <ImageDisplayFrame
              src={item.thumbnail_url || item.image_url}
              alt={item.title ?? collectionTitle}
              settings={galleryItemDisplaySettings(item)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            >
              <div className="absolute right-3 top-3">
                <StatusBadge status={item.status} />
              </div>
            </ImageDisplayFrame>
            <div className="flex flex-1 items-center justify-between gap-2 border-t-2 border-ink/10 px-4 py-3">
              <span className="truncate text-sm font-semibold">
                {item.title ?? "Untitled piece"}
              </span>
              <span aria-hidden className="shrink-0 text-taupe transition group-hover:translate-x-0.5">
                ⤢
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        activeIndex={activeIndex}
        collectionTitle={collectionTitle}
        collectionSlug={collectionSlug}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
