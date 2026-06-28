import Link from "next/link";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { CollectionCard } from "@/components/collections/collection-card";
import { FeaturedPrintsCarousel } from "@/components/home/featured-prints-carousel";
import { PrintGrid } from "@/components/home/print-grid";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { PartnerCard } from "@/components/process/partner-card";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getFeaturedCollections,
  getFeaturedItems,
  getRecentItems,
} from "@/lib/data/collections";
import { PARTNERS } from "@/lib/site";

export default async function HomePage() {
  const [featuredCollections, featuredItems, recentItems] = await Promise.all([
    getFeaturedCollections(),
    getFeaturedItems(6),
    getRecentItems(6),
  ]);

  return (
    <>
      <HeroSection />

      <HowItWorks />

      {/* Featured collections */}
      <section className="border-y-2 border-ink bg-sky-soft/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Curated"
              title="Featured collections"
              subtitle="Series straight from the studio, printed, painted, and ready to collect."
            />
            <Button href="/collections" variant="secondary" size="sm">
              View all collections
            </Button>
          </div>
          {featuredCollections.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCollections.map((collection, i) => (
                <CollectionCard key={collection.id} collection={collection} index={i} />
              ))}
            </div>
          ) : (
            <div className="mt-12">
              <EmptyState
                title="No collections yet"
                description="Collections will appear here once they are added in the studio dashboard."
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured prints */}
      {featuredItems.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Highlights"
            title="Featured prints"
            subtitle="Stand-out pieces hand-picked from across the collections."
          />
          <div className="mt-12">
            <FeaturedPrintsCarousel items={featuredItems} />
          </div>
        </section>
      ) : null}

      {/* Process preview */}
      <section className="border-y-2 border-ink bg-cream-light/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="The studio"
              title="From avatar to art object"
              subtitle="Every BoringBrush piece passes through a precise, hands-on process, split between technical print control and artist finishing."
            />
            <div className="mt-6">
              <Button href="/about" variant="secondary">
                Read the full process
              </Button>
            </div>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {/* Recently added */}
      {recentItems.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Fresh off the brush"
            title="Recently added prints"
          />
          <div className="mt-12">
            <PrintGrid items={recentItems} size="compact" />
          </div>
        </section>
      ) : null}

      {/* Partners */}
      <section className="border-t-2 border-ink bg-sky-soft/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="The collaboration"
            title="Made by two hands and one machine"
            subtitle="BoringBrush is a partnership between precise printing and patient painting."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PARTNERS.map((partner, i) => (
              <PartnerCard key={partner.name} {...partner} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <FAQ />

      {/* Commission CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6">
        <div className="overflow-hidden rounded-card border-2 border-ink bg-gold p-8 text-center shadow-lift sm:p-12">
          <h2 className="text-3xl font-black sm:text-4xl">
            Turn your avatar into a collectible
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/80">
            Commission a one-of-a-kind, hand-painted print of your digital
            identity. Tell us about your piece and we will get back with a quote.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg" variant="secondary">
              Request a Commission
            </Button>
            <Link
              href="/collections"
              className="text-sm font-semibold underline underline-offset-4"
            >
              or browse the collections
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
