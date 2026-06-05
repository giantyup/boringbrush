"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    q: "How much does a custom print cost?",
    a: "Pricing depends on size, complexity, and paint detail. Most collectible pieces start in the mid double digits and scale up for larger, highly detailed commissions. Send us your avatar through the contact form for a tailored quote.",
  },
  {
    q: "How long does a commission take?",
    a: "Typical turnaround is two to four weeks: a few days for printing and prep, then the bulk of the time for careful hand painting, detailing, and sealing.",
  },
  {
    q: "What materials do you use?",
    a: "We print in high-quality resin and PLA depending on the piece, then finish with artist-grade acrylics and a protective satin or matte seal for durability.",
  },
  {
    q: "Can you print any avatar?",
    a: "Most 3D and 2D avatars can be adapted into a printable model. Share a reference and we will confirm feasibility before any work begins.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. Each piece is cushioned and packed as a collectible. Shipping costs and timelines are confirmed before your order is finalized.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Good to know"
        title="Frequently asked questions"
        subtitle="Pricing, timing, materials, and custom avatars."
      />
      <div className="mt-10 space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.q}
              className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold">{faq.q}</span>
                <span
                  aria-hidden
                  className={`text-xl transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-ink/10 px-5 py-4 text-sm text-charcoal">
                      {faq.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
