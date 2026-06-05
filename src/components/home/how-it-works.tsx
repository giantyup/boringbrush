"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    n: "01",
    title: "Submit or select an avatar",
    body: "Bring your own avatar or choose from our collections. We confirm the look, pose, and details with you.",
  },
  {
    n: "02",
    title: "3D print, controlled by Solvex",
    body: "Solvex calibrates the printers and produces a clean, durable model, tuned layer by layer.",
  },
  {
    n: "03",
    title: "Hand-painted by The1",
    body: "The1 mixes paints by hand, building up shading, texture, and the small details that give each piece character.",
  },
  {
    n: "04",
    title: "Delivered as a collectible",
    body: "Sealed, protected, and packed with care, ready to live on your shelf as physical art.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="The process"
        title="How it works"
        subtitle="Four steps from pixels to a painted, shelf-worthy object."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative rounded-card border-2 border-ink bg-cream-light p-6 shadow-card"
          >
            <span className="font-display text-4xl font-black text-gold bb-text-stroke">
              {step.n}
            </span>
            <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
            <p className="mt-2 text-sm text-charcoal">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
