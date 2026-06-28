"use client";

import Link from "next/link";
import type { GalleryItemWithCollection } from "@/types/database";
import { galleryItemDisplaySettings } from "@/lib/image-display";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";

const CARD_CLASS =
  "group w-56 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-cream-light shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:w-64 lg:w-72";

function FeaturedPrintCard({ item }: { item: GalleryItemWithCollection }) {
  return (
    <Link
      href={
        item.collection?.slug
          ? `/collections/${item.collection.slug}`
          : "/collections"
      }
      className={CARD_CLASS}
    >
      <ImageDisplayFrame
        src={item.thumbnail_url || item.image_url}
        alt={item.title ?? "BoringBrush print"}
        settings={galleryItemDisplaySettings(item)}
        sizes="(max-width: 640px) 224px, 288px"
        loading="lazy"
      >
        <div className="absolute right-1 top-1 origin-top-right scale-[0.85]">
          <StatusBadge status={item.status} />
        </div>
      </ImageDisplayFrame>
    </Link>
  );
}

export function FeaturedPrintsCarousel({
  items,
}: {
  items: GalleryItemWithCollection[];
}) {
  const loopItems = [...items, ...items];

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden">
      <div className="bb-marquee-track flex w-max gap-3 motion-reduce:animate-none">
        {loopItems.map((item, index) => (
          <FeaturedPrintCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
