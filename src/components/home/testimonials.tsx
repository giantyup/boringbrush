"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { X_REVIEWS } from "@/lib/reviews";

export function Testimonials() {
  return (
    <section className="border-y-2 border-ink bg-sky-soft/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Social proof"
          title="Collectors love the result"
          subtitle="Real posts from collectors who received their BoringBrush prints."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {X_REVIEWS.map((review, i) => (
            <motion.figure
              key={review.url}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="h-full"
            >
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-card border-2 border-ink bg-cream-light p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span aria-hidden className="font-display text-5xl leading-none text-gold">
                  &ldquo;
                </span>
                <blockquote className="mt-2 line-clamp-6 flex-1 text-sm text-charcoal">
                  {review.excerpt}
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    <p className="text-xs text-taupe">{review.handle}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-ink transition group-hover:text-gold">
                    Read on X →
                  </span>
                </figcaption>
              </a>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
