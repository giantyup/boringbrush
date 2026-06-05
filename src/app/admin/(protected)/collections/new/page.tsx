import Link from "next/link";
import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm text-charcoal">
        <Link href="/admin/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="font-semibold text-ink">New</span>
      </nav>
      <CollectionForm />
    </div>
  );
}
