import { Button } from "@/components/ui/button";
import { CollectionsManager } from "@/components/admin/collections-manager";
import { getAllCollections } from "@/lib/data/admin";

export default async function AdminCollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">All collections</h2>
          <p className="text-sm text-charcoal">
            Drag to reorder. Toggle featured and published status inline.
          </p>
        </div>
        <Button href="/admin/collections/new" size="sm">
          + New collection
        </Button>
      </div>

      <CollectionsManager initial={collections} />
    </div>
  );
}
