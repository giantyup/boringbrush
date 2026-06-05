"use client";

import { useMemo, useState } from "react";
import type { CollectionWithCount } from "@/types/database";
import { CollectionCard } from "./collection-card";
import { EmptyState } from "@/components/ui/empty-state";

type Sort = "newest" | "oldest" | "featured" | "alpha";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "featured", label: "Featured" },
  { value: "alpha", label: "A to Z" },
];

export function CollectionsExplorer({
  collections,
}: {
  collections: CollectionWithCount[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const visible = useMemo(() => {
    let list = [...collections];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case "oldest":
        list.sort((a, b) => a.created_at.localeCompare(b.created_at));
        break;
      case "alpha":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
        list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        break;
      default:
        list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    return list;
  }, [collections, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-card border-2 border-ink bg-cream-light p-4 shadow-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search collections…"
            aria-label="Search collections"
            className="w-full rounded-full border-2 border-ink bg-sky-soft/40 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-charcoal focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-semibold">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border-2 border-ink bg-sky-soft/40 px-4 py-2.5 text-sm font-semibold outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {visible.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((collection, i) => (
              <CollectionCard key={collection.id} collection={collection} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No collections match"
            description="Try a different search term."
          />
        )}
      </div>
    </div>
  );
}
