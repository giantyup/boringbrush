"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

export function PartnerCard({
  name,
  role,
  blurb,
  handle,
  href,
  image,
  index = 0,
}: {
  name: string;
  role: string;
  blurb: string;
  handle: string;
  href: string;
  image: string;
  index?: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="group block overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
    >
      <RainbowStripe className="rounded-none" />
      <div className="p-6">
        <div className="flex items-center gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-ink">
            <Image
              src={image}
              alt={`${name} profile`}
              fill
              sizes="56px"
              className="object-cover"
            />
          </span>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm font-medium text-taupe">{role}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-charcoal">{blurb}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
          {handle}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </motion.a>
  );
}
