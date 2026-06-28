"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { Logo } from "@/components/brand/logo";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "▦", exact: true },
  { href: "/admin/collections", label: "Collections", icon: "🗂" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼" },
  { href: "/admin/contacts", label: "Inquiries", icon: "✉" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r-2 border-ink bg-ink text-cream-light md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <Logo
          href="/admin"
          showWordmark={false}
          className="border-b border-cream-light/20 p-5"
        />
        <RainbowStripe className="rounded-none" />

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-gold text-ink"
                    : "text-cream-light/80 hover:bg-cream-light/10 hover:text-cream-light",
                )}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cream-light/20 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-cream-light/80 transition hover:bg-cream-light/10 hover:text-cream-light"
          >
            ← View live site
          </Link>
        </div>
      </div>
    </aside>
  );
}
