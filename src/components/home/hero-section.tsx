"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

const shapes = [
  { className: "left-[8%] top-[18%] h-24 w-24 bg-gold", delay: 0 },
  { className: "right-[12%] top-[12%] h-16 w-16 bg-purple", delay: 0.4 },
  { className: "left-[16%] bottom-[14%] h-20 w-20 bg-red", delay: 0.8 },
  { className: "right-[18%] bottom-[20%] h-14 w-14 bg-taupe", delay: 1.2 },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink">
      {shapes.map((shape, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute hidden rounded-2xl border-2 border-ink/30 opacity-40 md:block ${shape.className}`}
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream-light px-4 py-1.5 text-sm font-semibold"
        >
          <span className="bb-rainbow h-2.5 w-8 rounded-full" />
          3D printed · hand-painted collectibles
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-balance text-4xl font-black leading-[1.05] sm:text-6xl"
        >
          Digital avatars, <span className="text-gold bb-text-stroke">printed</span> into reality.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-charcoal"
        >
          BoringBrush transforms 3D avatars into physical collectibles through
          precision printing, artist finishing, and hand-painted detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href="/collections" size="lg">
            Explore Collections
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Start a Custom Order
          </Button>
        </motion.div>

        <RainbowStripe className="mx-auto mt-12 max-w-xs" />
      </div>
    </section>
  );
}
