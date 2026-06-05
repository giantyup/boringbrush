"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadAdminImage } from "@/app/admin/upload-actions";
import { cn } from "@/lib/utils";

/**
 * Uploads an image through a server action (admin-guarded). This avoids client-side
 * storage RLS issues and works with either the service-role key or a signed-in
 * admin session.
 */
export function ImageUploader({
  bucket,
  value,
  onUploaded,
  label = "Image",
  folder = "uploads",
}: {
  bucket: "covers" | "gallery";
  value?: string;
  onUploaded: (url: string) => void;
  label?: string;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", bucket);
      formData.set("folder", folder);

      const result = await uploadAdminImage(formData);
      if (!result.ok) {
        throw new Error(result.error);
      }

      onUploaded(result.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Upload failed. Paste a URL instead.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-sky-soft/40">
          {value ? (
            <Image src={value} alt="Preview" fill className="object-cover" sizes="112px" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-charcoal">
              No image
            </span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-ink bg-white px-4 py-3 text-sm font-semibold transition hover:bg-sky-soft/40",
              uploading && "opacity-60",
            )}
          >
            {uploading ? "Uploading…" : "Choose file to upload"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          <input
            type="url"
            value={value ?? ""}
            onChange={(e) => onUploaded(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>
    </div>
  );
}
