"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { Logo } from "@/components/brand/logo";
import { SITE, SOCIALS } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-20 border-t-2 border-ink bg-ink text-cream-light">
      <RainbowStripe className="rounded-none" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo showWordmark={false} markSize={40} />
          <p className="mt-4 max-w-sm text-sm text-cream-light/80">
            {SITE.description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-cream-light">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-cream-light/80">
            <li><Link href="/collections" className="hover:text-gold">Collections</Link></li>
            <li><Link href="/about" className="hover:text-gold">Our Process</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Start a Commission</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold">Studio Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-cream-light">
            The Studio
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-cream-light/80">
            <li><a href={SOCIALS.brand} target="_blank" rel="noopener noreferrer" className="hover:text-gold">BoringBrush on X</a></li>
            <li><a href={SOCIALS.solvex} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Solvex Printing</a></li>
            <li><a href={SOCIALS.the1} target="_blank" rel="noopener noreferrer" className="hover:text-gold">The1 Painting</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-light/20 px-4 py-5 text-center text-xs text-cream-light/60 sm:px-6">
        © {new Date().getFullYear()} BoringBrush. Digital avatars, printed into reality.
      </div>
    </footer>
  );
}
