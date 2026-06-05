import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProcessTimeline } from "@/components/process/process-timeline";
import { PartnerCard } from "@/components/process/partner-card";
import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { PARTNERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "The BoringBrush studio story: precision 3D printing by Solvex and hand painting by The1, turning digital avatars into physical collectibles.",
  openGraph: {
    title: "Our Process · BoringBrush",
    description:
      "Precision 3D printing by Solvex and hand painting by The1, the BoringBrush studio story.",
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Story */}
      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <RainbowStripe className="mx-auto max-w-[120px]" />
          <h1 className="mt-6 text-4xl font-black sm:text-5xl">
            An art studio for digital identity
          </h1>
          <p className="mt-6 text-lg text-charcoal">
            BoringBrush turns digital identity into shelf-worthy physical art.
            Each piece begins as an avatar, passes through precise 3D printing,
            and finishes as a hand-painted collectible with character, texture,
            and presence.
          </p>
          <p className="mt-4 text-charcoal">
            We started BoringBrush because the avatars people love deserve more
            than a screen. A profile picture can mean identity, community, and
            years of memories, so we give it weight, edges, and a place on the
            shelf. We treat every commission like a small sculpture, not a
            product off a line.
          </p>
        </div>
      </section>

      {/* Collaboration */}
      <section className="border-b-2 border-ink bg-sky-soft/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="The collaboration"
            title="Two specialists, one piece"
            subtitle="Technical print control and patient hand painting, each piece is a handoff between two crafts."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PARTNERS.map((partner, i) => (
              <PartnerCard key={partner.name} {...partner} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Process detail */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Step by step"
              title="How a piece comes together"
              subtitle="From the first printed layer to the final sealed detail, here is what happens inside the studio."
            />
            <div className="mt-6">
              <Button href="/contact">Start your commission</Button>
            </div>
          </div>
          <ProcessTimeline />
        </div>
      </section>
    </div>
  );
}
