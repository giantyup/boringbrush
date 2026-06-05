"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

/**
 * Email capture placeholder. Stores nothing yet — wire to a provider
 * (Resend audiences, Mailchimp, etc.) when the studio is ready.
 */
export function NewsletterCapture() {
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("Thanks! We'll be in touch with new drops.");
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-card border-2 border-ink bg-ink text-cream-light shadow-lift">
        <RainbowStripe className="rounded-none" />
        <div className="grid gap-6 p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream-light">
              Get new drops first
            </h2>
            <p className="mt-2 text-sm text-cream-light/80">
              Be the first to see new collections, limited prints, and open
              commission slots.
            </p>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="w-full rounded-full border-2 border-cream-light bg-cream-light px-4 py-2.5 text-sm text-ink outline-none placeholder:text-charcoal"
            />
            <Button type="submit" size="md" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
