"use client";

import { useRef } from "react";
import type { ImageDisplaySettings } from "@/lib/image-display";
import {
  clampDisplayPos,
  defaultImageDisplay,
  imageDisplayAspectOptions,
  imageDisplayBgOptions,
} from "@/lib/image-display";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";
import { Button } from "@/components/ui/button";

export function ImageDisplayControls({
  value,
  onChange,
  previewSrc,
  previewAlt = "Preview",
  title = "Card display",
  description = "Drag to reposition. Resize with the slider. Frame shape only changes the card; your full image always stays visible.",
}: {
  value: ImageDisplaySettings;
  onChange: (value: ImageDisplaySettings) => void;
  previewSrc?: string;
  previewAlt?: string;
  title?: string;
  description?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(
    null,
  );

  function update<K extends keyof ImageDisplaySettings>(
    field: K,
    next: ImageDisplaySettings[K],
  ) {
    onChange({ ...value, [field]: next });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!previewSrc) return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: value.posX,
      posY: value.posY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragRef.current.y) / rect.height) * 100;
    onChange({
      ...value,
      posX: clampDisplayPos(dragRef.current.posX + dx),
      posY: clampDisplayPos(dragRef.current.posY + dy),
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  function resetPosition() {
    onChange({
      ...value,
      scale: defaultImageDisplay.scale,
      posX: defaultImageDisplay.posX,
      posY: defaultImageDisplay.posY,
    });
  }

  return (
    <div className="space-y-4 rounded-xl border-2 border-ink/15 bg-white/60 p-4">
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-0.5 text-xs text-charcoal">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Background"
          value={value.bg}
          options={imageDisplayBgOptions}
          onChange={(v) => update("bg", v as ImageDisplaySettings["bg"])}
        />
        <Select
          label="Frame shape"
          value={value.aspect}
          options={imageDisplayAspectOptions}
          onChange={(v) => update("aspect", v as ImageDisplaySettings["aspect"])}
        />
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-xs font-semibold">
          <span>Image size</span>
          <span className="text-charcoal">{value.scale}%</span>
        </span>
        <input
          type="range"
          min={50}
          max={200}
          step={5}
          value={value.scale}
          onChange={(e) => update("scale", Number(e.target.value))}
          className="w-full accent-gold"
        />
        <span className="mt-1 block text-xs text-charcoal">
          50% smaller · 100% default · 200% larger
        </span>
      </label>

      {previewSrc ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal">
            Live preview: drag to move
          </p>
          <div
            ref={frameRef}
            className="mx-auto max-w-xs touch-none select-none overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="cursor-grab active:cursor-grabbing">
              <ImageDisplayFrame
                src={previewSrc}
                alt={previewAlt}
                settings={value}
                sizes="320px"
                hover={false}
              />
            </div>
            <div className="flex items-center justify-between border-t-2 border-ink/10 px-3 py-2">
              <span className="text-xs font-semibold text-ink">Card preview</span>
              <Button type="button" variant="ghost" size="sm" onClick={resetPosition}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-charcoal">Upload an image to position and resize it.</p>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
