import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { getPublishedCollections } from "@/lib/data/collections";
import { SITE, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Commissions",
  description:
    "Commission a hand-painted, 3D printed collectible from your avatar, or ask the BoringBrush studio a question.",
  openGraph: {
    title: "Contact & Commissions · BoringBrush",
    description:
      "Commission a hand-painted, 3D printed collectible from your avatar.",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const [{ collection }, collections] = await Promise.all([
    searchParams,
    getPublishedCollections(),
  ]);

  const defaultCollection = collections.find((c) => c.slug === collection)?.title;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Commissions open"
        title="Start a custom order"
        subtitle="Tell us about the avatar you want to immortalize. We'll reply with feasibility, pricing, and a timeline."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm
          collectionOptions={collections.map((c) => ({ title: c.title, slug: c.slug }))}
          defaultCollection={defaultCollection}
        />

        <aside className="space-y-5">
          <div className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card">
            <RainbowStripe className="rounded-none" />
            <div className="space-y-3 p-6">
              <h3 className="text-lg font-bold">Reach the studio</h3>
              <p className="text-sm text-charcoal">
                Prefer email? Write to us directly.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-block font-semibold text-taupe underline underline-offset-4 hover:text-ink"
              >
                {SITE.email}
              </a>
              <ul className="space-y-2 pt-2 text-sm">
                <li>
                  <a href={SOCIALS.brand} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-taupe">
                    BoringBrush on X →
                  </a>
                </li>
                <li>
                  <a href={SOCIALS.solvex} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-taupe">
                    Solvex (printing) →
                  </a>
                </li>
                <li>
                  <a href={SOCIALS.the1} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-taupe">
                    The1 (painting) →
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-card border-2 border-ink bg-sky-soft/60 p-6 shadow-card">
            <h3 className="text-lg font-bold">What to include</h3>
            <ul className="mt-3 space-y-2 text-sm text-charcoal">
              <li>• A link or image of your avatar</li>
              <li>• Preferred size or scale</li>
              <li>• Any special detail or finish</li>
              <li>• Your rough budget and timeline</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
