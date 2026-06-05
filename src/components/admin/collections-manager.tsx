"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Collection } from "@/types/database";
import {
  deleteCollection,
  reorderCollections,
  setCollectionFlag,
} from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

type Row = Collection & { item_count: number };

function SortableRow({
  collection,
  onToggle,
  onDelete,
}: {
  collection: Row;
  onToggle: (id: string, field: "is_featured" | "is_published", value: boolean) => void;
  onDelete: (collection: Row) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: collection.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 border-b border-ink/10 bg-cream-light p-3 last:border-0 ${
        isDragging ? "opacity-70 shadow-lift" : ""
      }`}
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab touch-none px-1 text-xl text-charcoal active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-ink bg-sky-soft/40">
        {collection.cover_image_url ? (
          <Image
            src={collection.cover_image_url}
            alt={collection.title}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{collection.title}</p>
        <p className="truncate text-xs text-charcoal">
          {collection.item_count} pieces · /{collection.slug}
        </p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <button
          type="button"
          onClick={() => onToggle(collection.id, "is_featured", !collection.is_featured)}
          className={`rounded-full border-2 border-ink px-2.5 py-1 text-xs font-semibold transition ${
            collection.is_featured ? "bg-gold text-ink" : "bg-white text-charcoal"
          }`}
        >
          ★ Featured
        </button>
        <button
          type="button"
          onClick={() => onToggle(collection.id, "is_published", !collection.is_published)}
          className={`rounded-full border-2 border-ink px-2.5 py-1 text-xs font-semibold transition ${
            collection.is_published ? "bg-[#3f8f4f] text-white" : "bg-white text-charcoal"
          }`}
        >
          {collection.is_published ? "Published" : "Draft"}
        </button>
      </div>

      <Link
        href={`/admin/collections/${collection.id}/edit`}
        className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold transition hover:bg-sky-soft/60"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(collection)}
        className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-semibold text-red transition hover:bg-red hover:text-white"
      >
        Delete
      </button>
    </div>
  );
}

export function CollectionsManager({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [target, setTarget] = useState<Row | null>(null);
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);
    startTransition(async () => {
      const result = await reorderCollections(next.map((r) => r.id));
      if (result.ok) toast.success("Order saved");
      else toast.error(result.error ?? "Couldn't save order");
    });
  }

  function onToggle(
    id: string,
    field: "is_featured" | "is_published",
    value: boolean,
  ) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    startTransition(async () => {
      const result = await setCollectionFlag(id, field, value);
      if (result.ok) toast.success("Updated");
      else {
        toast.error(result.error ?? "Update failed");
        router.refresh();
      }
    });
  }

  function confirmDelete() {
    if (!target) return;
    const id = target.id;
    startTransition(async () => {
      const result = await deleteCollection(id);
      if (result.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        toast.success("Collection deleted");
      } else {
        toast.error(result.error ?? "Delete failed");
      }
      setTarget(null);
    });
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No collections yet"
        description="Create your first collection to start building albums."
        action={<Button href="/admin/collections/new">+ New collection</Button>}
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            {rows.map((collection) => (
              <SortableRow
                key={collection.id}
                collection={collection}
                onToggle={onToggle}
                onDelete={setTarget}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <ConfirmDialog
        open={target !== null}
        title={`Delete "${target?.title}"?`}
        description="This permanently removes the collection and all its gallery items. This cannot be undone."
        loading={pending}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
