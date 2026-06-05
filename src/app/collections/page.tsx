import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { CollectionsExplorer } from "@/components/collections/collections-explorer";
import { getPublishedCollections } from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse BoringBrush collections of 3D printed, hand-painted avatar collectibles: Yuppie Apes, Bored Apes, Mutants, Dengs and more.",
  openGraph: {
    title: "Collections · BoringBrush",
    description:
      "Browse BoringBrush collections of 3D printed, hand-painted avatar collectibles.",
  },
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await getPublishedCollections();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="The gallery"
        title="Collections"
        subtitle="Each series begins as a digital avatar and ends as a hand-painted, physical collectible. Explore the albums."
      />
      <div className="mt-12">
        <CollectionsExplorer collections={collections} />
      </div>
    </div>
  );
}
