import { GalleryManager } from "@/components/admin/gallery-manager";
import { getAdminGalleryItems, getCollectionOptions } from "@/lib/data/admin";

export default async function AdminGalleryPage() {
  const [items, collections] = await Promise.all([
    getAdminGalleryItems(),
    getCollectionOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Gallery</h2>
        <p className="text-sm text-charcoal">
          Upload pieces, edit metadata, set status, feature highlights, and
          reorder within a collection.
        </p>
      </div>

      <GalleryManager initial={items} collections={collections} />
    </div>
  );
}
