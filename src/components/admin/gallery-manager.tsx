"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GalleryItemWithCollection, GalleryItem } from "@/types/database";
import { galleryItemDisplaySettings } from "@/lib/image-display";
import {
  deleteGalleryItem,
  reorderGalleryItems,
  setGalleryItemFeatured,
} from "@/app/admin/actions";
import { GalleryItemForm } from "./gallery-item-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ImageDisplayFrame } from "@/components/ui/image-display-frame";

type CollectionOption = { id: string; title: string; slug: string };

function Card({
  item,
  draggable,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  item: GalleryItemWithCollection;
  draggable: boolean;
  onEdit: (item: GalleryItemWithCollection) => void;
  onDelete: (item: GalleryItemWithCollection) => void;
  onToggleFeatured: (item: GalleryItemWithCollection) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, disabled: !draggable });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card ${
        isDragging ? "opacity-70 shadow-lift" : ""
      }`}
    >
      <ImageDisplayFrame
        src={item.thumbnail_url || item.image_url}
        alt={item.title ?? "Piece"}
        settings={galleryItemDisplaySettings(item)}
        sizes="(max-width:640px) 50vw, 200px"
        hover={false}
      >
        <div className="absolute right-1.5 top-1.5">
          <StatusBadge status={item.status} />
        </div>
        {draggable ? (
          <button
            type="button"
            aria-label="Drag to reorder"
            className="absolute left-1.5 top-1.5 cursor-grab touch-none rounded-md border-2 border-ink bg-cream-light px-1.5 text-sm active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            ⠿
          </button>
        ) : null}
      </ImageDisplayFrame>
      <div className="space-y-2 p-3">
        <p className="truncate text-sm font-semibold">{item.title ?? "Untitled"}</p>
        <p className="truncate text-xs text-charcoal">{item.collection?.title}</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onToggleFeatured(item)}
            className={`rounded-full border-2 border-ink px-2 py-0.5 text-xs font-semibold ${
              item.is_featured ? "bg-gold text-ink" : "bg-white text-charcoal"
            }`}
          >
            ★
          </button>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-semibold hover:bg-sky-soft/60"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-semibold text-red hover:bg-red hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function GalleryManager({
  initial,
  collections,
}: {
  initial: GalleryItemWithCollection[];
  collections: CollectionOption[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);
  const [filter, setFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [target, setTarget] = useState<GalleryItemWithCollection | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.collection_id === filter)),
    [items, filter],
  );

  const draggable = filter !== "all";

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = visible.map((i) => i.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    const reordered = arrayMove(visible, oldIndex, newIndex);

    setItems((prev) => {
      const others = prev.filter((i) => i.collection_id !== filter);
      return [...others, ...reordered];
    });
    startTransition(async () => {
      const result = await reorderGalleryItems(reordered.map((i) => i.id));
      if (result.ok) toast.success("Order saved");
      else toast.error(result.error ?? "Couldn't save order");
    });
  }

  function onToggleFeatured(item: GalleryItemWithCollection) {
    const value = !item.is_featured;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_featured: value } : i)),
    );
    startTransition(async () => {
      const result = await setGalleryItemFeatured(item.id, value);
      if (!result.ok) {
        toast.error(result.error ?? "Update failed");
        router.refresh();
      }
    });
  }

  function confirmDelete() {
    if (!target) return;
    const id = target.id;
    startTransition(async () => {
      const result = await deleteGalleryItem(id);
      if (result.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Piece deleted");
      } else {
        toast.error(result.error ?? "Delete failed");
      }
      setTarget(null);
    });
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: GalleryItemWithCollection) {
    setEditing(item);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm font-semibold">
            Collection
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border-2 border-ink bg-cream-light px-4 py-2 text-sm font-semibold outline-none"
          >
            <option value="all">All collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <Button size="sm" onClick={openCreate} disabled={collections.length === 0}>
          + Add piece
        </Button>
      </div>

      {draggable ? (
        <p className="text-xs text-charcoal">
          Drag pieces to reorder within this collection.
        </p>
      ) : (
        <p className="text-xs text-charcoal">
          Select a single collection to enable drag-to-reorder.
        </p>
      )}

      {visible.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={visible.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visible.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  draggable={draggable}
                  onEdit={openEdit}
                  onDelete={setTarget}
                  onToggleFeatured={onToggleFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyState
          title={collections.length === 0 ? "Create a collection first" : "No pieces yet"}
          description={
            collections.length === 0
              ? "Gallery pieces belong to a collection. Add a collection, then upload pieces here."
              : "Add your first piece to this collection."
          }
          action={
            collections.length === 0 ? (
              <Button href="/admin/collections/new">+ New collection</Button>
            ) : (
              <Button onClick={openCreate}>+ Add piece</Button>
            )
          }
        />
      )}

      <GalleryItemForm
        open={formOpen}
        item={editing}
        collections={collections}
        defaultCollectionId={filter !== "all" ? filter : undefined}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={target !== null}
        title="Delete this piece?"
        description="This permanently removes the gallery item. This cannot be undone."
        loading={pending}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
