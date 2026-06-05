"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/types/database";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { formatDate } from "@/lib/utils";
import { SITE, SOCIALS } from "@/lib/site";

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-ink/10 py-2 text-sm">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="text-right text-charcoal">{value}</dd>
    </div>
  );
}

export function GalleryLightbox({
  items,
  activeIndex,
  collectionTitle,
  collectionSlug,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  activeIndex: number | null;
  collectionTitle: string;
  collectionSlug: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [showBefore, setShowBefore] = useState(false);
  const open = activeIndex !== null;
  const item = open ? items[activeIndex] : null;

  const goTo = useCallback(
    (dir: 1 | -1) => {
      if (activeIndex === null) return;
      const next = (activeIndex + dir + items.length) % items.length;
      setShowBefore(false);
      onNavigate(next);
    },
    [activeIndex, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "ArrowLeft") goTo(-1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, goTo, onClose]);

  const shareUrl = item
    ? `${SITE.url}/collections/${collectionSlug}#${item.slug ?? item.id}`
    : SITE.url;

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? "Gallery image"}
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur" onClick={onClose} />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-cream-light text-cream-light transition hover:bg-cream-light hover:text-ink"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream-light bg-ink/40 text-2xl text-cream-light transition hover:bg-cream-light hover:text-ink sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cream-light bg-ink/40 text-2xl text-cream-light transition hover:bg-cream-light hover:text-ink sm:right-6"
          >
            ›
          </button>

          <motion.div
            key={item.id}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative grid max-h-[90vh] w-full max-w-5xl grid-rows-[1fr_auto] overflow-hidden rounded-card border-2 border-ink bg-cream-light md:grid-cols-[1.4fr_1fr] md:grid-rows-1"
          >
            <div className="relative min-h-[40vh] bg-ink/5">
              <Image
                src={
                  showBefore && item.before_image_url
                    ? item.before_image_url
                    : item.image_url
                }
                alt={item.title ?? collectionTitle}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-contain"
                priority
              />
              {item.before_image_url ? (
                <button
                  type="button"
                  onClick={() => setShowBefore((v) => !v)}
                  className="absolute bottom-3 left-3 rounded-full border-2 border-ink bg-cream-light px-3 py-1 text-xs font-semibold"
                >
                  {showBefore ? "Show finished" : "Show before"}
                </button>
              ) : null}
            </div>

            <div className="flex flex-col overflow-y-auto border-t-2 border-ink md:border-l-2 md:border-t-0">
              <RainbowStripe className="rounded-none" />
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-bold">
                      {item.title ?? "Untitled piece"}
                    </h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-taupe">{collectionTitle}</p>
                </div>

                {item.description ? (
                  <p className="text-sm text-charcoal">{item.description}</p>
                ) : null}

                {item.artist_notes ? (
                  <div className="rounded-xl border border-ink/15 bg-sky-soft/40 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-taupe">
                      Artist notes
                    </p>
                    <p className="mt-1 text-sm text-charcoal">{item.artist_notes}</p>
                  </div>
                ) : null}

                <dl>
                  <MetaRow label="Size" value={item.size} />
                  <MetaRow label="Material" value={item.material} />
                  <MetaRow label="Paint finish" value={item.paint_finish} />
                  <MetaRow label="Completed" value={formatDate(item.completed_at)} />
                </dl>

                <div className="mt-auto space-y-3 pt-2">
                  <div className="flex flex-wrap gap-2">
                    <CopyLinkButton url={shareUrl} className="text-xs" />
                    <a
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                        `${item.title ?? "A BoringBrush print"}, hand-painted by ${SOCIALS.the1}`,
                      )}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream-light px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                    >
                      Share on X
                    </a>
                  </div>
                  <Link
                    href={`/contact?collection=${collectionSlug}&piece=${item.id}`}
                    className="bb-paint-edge flex w-full items-center justify-center rounded-full border-2 border-ink bg-gold px-5 py-3 text-sm font-bold text-ink shadow-[0_3px_0_0_#211e1c] transition hover:-translate-y-0.5"
                  >
                    Request a similar print
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
