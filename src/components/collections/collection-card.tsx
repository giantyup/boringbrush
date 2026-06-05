"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CollectionWithCount } from "@/types/database";
import { collectionCoverDisplaySettings } from "@/lib/image-display";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";

export function CollectionCard({
  collection,
  index = 0,
}: {
  collection: CollectionWithCount;
  index?: number;
}) {
  const coverSettings = collectionCoverDisplaySettings(collection);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      className="group h-full"
    >
      <Link
        href={`/collections/${collection.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lift"
      >
        {collection.cover_image_url ? (
          <ImageDisplayFrame
            src={collection.cover_image_url}
            alt={collection.title}
            settings={coverSettings}
            sizes="(max-width: 768px) 100vw, 33vw"
          >
            {collection.is_featured ? (
              <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                Featured
              </span>
            ) : null}
            <span className="absolute bottom-3 right-3 rounded-full border-2 border-ink bg-cream-light px-3 py-1 text-xs font-semibold text-ink">
              {collection.item_count} {collection.item_count === 1 ? "piece" : "pieces"}
            </span>
          </ImageDisplayFrame>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-studio-grey text-charcoal">
            No cover yet
          </div>
        )}

        <RainbowStripe className="rounded-none" />

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-2xl font-bold">{collection.title}</h3>
          {collection.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-charcoal">
              {collection.description}
            </p>
          ) : null}

          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-taupe transition group-hover:text-ink">
            View album
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
