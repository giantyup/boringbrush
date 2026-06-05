"use client";

import { motion } from "framer-motion";

const stages = [
  {
    title: "3D printing",
    body: "Solvex prepares the model, tunes supports, and prints at high resolution for crisp, faithful geometry.",
    by: "Solvex",
  },
  {
    title: "Surface prep",
    body: "Supports are removed, seams sanded, and the surface primed so paint sits evenly and lasts.",
    by: "Studio",
  },
  {
    title: "Painting",
    body: "The1 hand-mixes colors and layers base coats, washes, and highlights to build depth and personality.",
    by: "The1",
  },
  {
    title: "Final detailing",
    body: "Eyes, accents, and the rainbow micro-details get the steady-handed treatment, then a protective seal.",
    by: "The1",
  },
  {
    title: "Packaging & delivery",
    body: "Each piece is sealed, cushioned, and packed as a collectible, ready to ship anywhere.",
    by: "Studio",
  },
];

export function ProcessTimeline() {
  return (
    <ol className="relative space-y-6 border-l-2 border-ink/30 pl-6">
      {stages.map((stage, i) => (
        <motion.li
          key={stage.title}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="relative"
        >
          <span className="absolute -left-[33px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-gold" />
          <div className="rounded-card border-2 border-ink bg-cream-light p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">{stage.title}</h3>
              <span className="rounded-full border border-ink/30 bg-sky-soft/60 px-2.5 py-0.5 text-xs font-semibold">
                {stage.by}
              </span>
            </div>
            <p className="mt-2 text-sm text-charcoal">{stage.body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
