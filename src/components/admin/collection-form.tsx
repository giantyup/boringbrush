"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Collection } from "@/types/database";
import { saveCollection } from "@/app/admin/actions";
import {
  defaultImageDisplay,
  collectionCoverDisplaySettings,
  imageDisplayToCoverFields,
  type ImageDisplaySettings,
} from "@/lib/image-display";
import { ImageUploader } from "./image-uploader";
import { ImageDisplayControls } from "./image-display-controls";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

export function CollectionForm({ collection }: { collection?: Collection }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(collection?.title ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(collection));
  const [description, setDescription] = useState(collection?.description ?? "");
  const [cover, setCover] = useState(collection?.cover_image_url ?? "");
  const [coverDisplay, setCoverDisplay] = useState<ImageDisplaySettings>(() =>
    collection
      ? collectionCoverDisplaySettings(collection)
      : { ...defaultImageDisplay, aspect: "landscape" },
  );
  const [isFeatured, setIsFeatured] = useState(collection?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(collection?.is_published ?? true);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveCollection(collection?.id ?? null, {
        title,
        slug,
        description,
        cover_image_url: cover,
        ...imageDisplayToCoverFields(coverDisplay),
        is_featured: isFeatured,
        is_published: isPublished,
      });

      if (result.ok) {
        toast.success(collection ? "Collection updated" : "Collection created");
        router.push("/admin/collections");
        router.refresh();
      } else {
        toast.error(result.error ?? "Couldn't save collection");
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-2xl space-y-5 rounded-card border-2 border-ink bg-cream-light p-6 shadow-card"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Title</span>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Slug</span>
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          required
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
        <span className="mt-1 block text-xs text-charcoal">/collections/{slug || "…"}</span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
      </label>

      <ImageUploader
        bucket="covers"
        label="Cover image"
        value={cover}
        folder={slug || "covers"}
        onUploaded={setCover}
      />

      <ImageDisplayControls
        value={coverDisplay}
        onChange={setCoverDisplay}
        previewSrc={cover || undefined}
        previewAlt={title || "Collection cover preview"}
        title="Cover display"
        description="Drag the cover image to reposition it. Use the slider to resize."
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : collection ? "Save changes" : "Create collection"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/collections")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
