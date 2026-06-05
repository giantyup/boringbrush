import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/collection-form";
import { getAdminCollection } from "@/lib/data/admin";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await getAdminCollection(id);
  if (!collection) notFound();

  return (
    <div className="space-y-6">
      <nav className="text-sm text-charcoal">
        <Link href="/admin/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="font-semibold text-ink">{collection.title}</span>
      </nav>
      <CollectionForm collection={collection} />
    </div>
  );
}
