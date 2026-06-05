"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import type { GalleryItem } from "@/types/database";
import { saveGalleryItem } from "@/app/admin/actions";
import { galleryStatusValues } from "@/lib/validations/admin";
import { defaultImageDisplay, galleryItemDisplaySettings, imageDisplayToGalleryFields } from "@/lib/image-display";
import { ImageUploader } from "./image-uploader";
import { ImageDisplayControls } from "./image-display-controls";
import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

type CollectionOption = { id: string; title: string; slug: string };

export function GalleryItemForm({
  open,
  item,
  collections,
  defaultCollectionId,
  onClose,
  onSaved,
}: {
  open: boolean;
  item?: GalleryItem | null;
  collections: CollectionOption[];
  defaultCollectionId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState(() => buildState(item, defaultCollectionId));

  // Re-seed the form when the target item changes.
  const seedKey = item?.id ?? `new-${defaultCollectionId ?? ""}`;
  const [key, setKey] = useState(seedKey);
  if (key !== seedKey) {
    setKey(seedKey);
    setForm(buildState(item, defaultCollectionId));
  }

  function update<K extends keyof ReturnType<typeof buildState>>(
    field: K,
    value: ReturnType<typeof buildState>[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url) {
      toast.error("Add an image first");
      return;
    }
    startTransition(async () => {
      const { display, ...rest } = form;
      const result = await saveGalleryItem(item?.id ?? null, {
        ...rest,
        ...imageDisplayToGalleryFields(display),
      });
      if (result.ok) {
        toast.success(item ? "Piece updated" : "Piece added");
        onSaved();
      } else {
        toast.error(result.error ?? "Couldn't save piece");
      }
    });
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            className="relative my-8 w-full max-w-2xl overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-lift"
          >
            <RainbowStripe className="rounded-none" />
            <form onSubmit={onSubmit} className="space-y-4 p-6">
              <h2 className="text-xl font-bold">
                {item ? "Edit piece" : "Add a piece"}
              </h2>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Collection</span>
                <select
                  value={form.collection_id}
                  onChange={(e) => update("collection_id", e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="">Choose a collection…</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>

              <ImageUploader
                bucket="gallery"
                label="Image"
                value={form.image_url}
                folder={collections.find((c) => c.id === form.collection_id)?.slug ?? "gallery"}
                onUploaded={(url) => {
                  update("image_url", url);
                  update("thumbnail_url", url);
                }}
              />

              <ImageDisplayControls
                value={form.display}
                onChange={(display) => update("display", display)}
                previewSrc={form.image_url || undefined}
                previewAlt={form.title || "Piece preview"}
              />

              <details className="rounded-xl border border-ink/20 bg-white/50 p-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  Optional &ldquo;before&rdquo; image (before/after)
                </summary>
                <div className="mt-3">
                  <ImageUploader
                    bucket="gallery"
                    label="Before image"
                    value={form.before_image_url}
                    folder={collections.find((c) => c.id === form.collection_id)?.slug ?? "gallery"}
                    onUploaded={(url) => update("before_image_url", url)}
                  />
                </div>
              </details>

              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="Title" value={form.title} onChange={(v) => update("title", v)} />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Status</span>
                  <select
                    value={form.status}
                    onChange={(e) => update("status", e.target.value as GalleryItem["status"])}
                    className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
                  >
                    {galleryStatusValues.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <Text label="Size" value={form.size} onChange={(v) => update("size", v)} />
                <Text label="Material" value={form.material} onChange={(v) => update("material", v)} />
                <Text label="Paint finish" value={form.paint_finish} onChange={(v) => update("paint_finish", v)} />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Completed date</span>
                  <input
                    type="date"
                    value={form.completed_at}
                    onChange={(e) => update("completed_at", e.target.value)}
                    className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Artist notes</span>
                <textarea
                  value={form.artist_notes}
                  onChange={(e) => update("artist_notes", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => update("is_featured", e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                Feature this piece on the home page
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving…" : item ? "Save changes" : "Add piece"}
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Text({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
      />
    </label>
  );
}

function buildState(item?: GalleryItem | null, defaultCollectionId?: string) {
  return {
    collection_id: item?.collection_id ?? defaultCollectionId ?? "",
    title: item?.title ?? "",
    description: item?.description ?? "",
    image_url: item?.image_url ?? "",
    thumbnail_url: item?.thumbnail_url ?? "",
    before_image_url: item?.before_image_url ?? "",
    artist_notes: item?.artist_notes ?? "",
    size: item?.size ?? "",
    material: item?.material ?? "",
    paint_finish: item?.paint_finish ?? "",
    status: item?.status ?? "available",
    display: item
      ? galleryItemDisplaySettings(item)
      : defaultImageDisplay,
    is_featured: item?.is_featured ?? false,
    completed_at: item?.completed_at ? item.completed_at.slice(0, 10) : "",
  };
}
