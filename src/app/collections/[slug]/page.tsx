import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/ui/copy-link-button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCollectionBySlug, getGalleryItems } from "@/lib/data/collections";
import { SITE } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };

  const description =
    collection.description ??
    `Explore the ${collection.title} collection of hand-painted, 3D printed collectibles by BoringBrush.`;

  return {
    title: collection.title,
    description,
    openGraph: {
      title: `${collection.title} · BoringBrush`,
      description,
      images: collection.cover_image_url
        ? [{ url: collection.cover_image_url }]
        : undefined,
    },
  };
}

export default async function CollectionAlbumPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const items = await getGalleryItems(collection.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-charcoal">
        <Link href="/collections" className="hover:text-ink">
          Collections
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="font-semibold text-ink">{collection.title}</span>
      </nav>

      <header className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card">
        <RainbowStripe className="rounded-none" />
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-black sm:text-5xl">{collection.title}</h1>
            {collection.is_featured ? (
              <span className="rounded-full border-2 border-ink bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Featured
              </span>
            ) : null}
          </div>
          {collection.description ? (
            <p className="max-w-2xl text-charcoal">{collection.description}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-taupe">
              {items.length} {items.length === 1 ? "piece" : "pieces"}
            </span>
            {collection.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyLinkButton url={`${SITE.url}/collections/${collection.slug}`} />
            <Button href={`/contact?collection=${collection.slug}`} size="sm">
              Request a similar print
            </Button>
          </div>
        </div>
      </header>

      <section className="mt-10">
        {items.length > 0 ? (
          <GalleryGrid
            items={items}
            collectionTitle={collection.title}
            collectionSlug={collection.slug}
          />
        ) : (
          <EmptyState
            title="No pieces in this album yet"
            description="New prints for this collection are on the way. Check back soon."
            action={<Button href="/collections">Browse other collections</Button>}
          />
        )}
      </section>
    </div>
  );
}
