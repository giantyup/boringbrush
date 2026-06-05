"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GalleryItemWithCollection } from "@/types/database";
import { galleryItemDisplaySettings } from "@/lib/image-display";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";

export function FeaturedPrintsCarousel({
  items,
}: {
  items: GalleryItemWithCollection[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);

    return () => {
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [items.length, updateControls]);

  function scrollByPage(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative mx-auto max-w-5xl">
      {canPrev ? (
        <button
          type="button"
          aria-label="Previous featured prints"
          onClick={() => scrollByPage(-1)}
          className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-cream-light text-lg font-bold shadow-card transition hover:bg-gold sm:flex lg:-left-5"
        >
          ‹
        </button>
      ) : null}

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={
              item.collection?.slug
                ? `/collections/${item.collection.slug}`
                : "/collections"
            }
            className="group w-[calc(50%-0.375rem)] shrink-0 snap-start overflow-hidden rounded-xl border-2 border-ink bg-cream-light shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)]"
          >
            <ImageDisplayFrame
              src={item.thumbnail_url || item.image_url}
              alt={item.title ?? "BoringBrush print"}
              settings={galleryItemDisplaySettings(item)}
              sizes="(max-width: 640px) 50vw, 22vw"
              loading="lazy"
            >
              <div className="absolute right-1 top-1 origin-top-right scale-[0.85]">
                <StatusBadge status={item.status} />
              </div>
            </ImageDisplayFrame>
          </Link>
        ))}
      </div>

      {canNext ? (
        <button
          type="button"
          aria-label="Next featured prints"
          onClick={() => scrollByPage(1)}
          className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-cream-light text-lg font-bold shadow-card transition hover:bg-gold sm:flex lg:-right-5"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
