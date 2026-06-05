"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { logoutAdmin } from "@/app/admin/login/actions";
import { toast } from "sonner";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/contacts", label: "Inquiries" },
];

const titles: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/admin", title: "Dashboard" },
  { match: (p) => p.startsWith("/admin/collections"), title: "Collections" },
  { match: (p) => p.startsWith("/admin/gallery"), title: "Gallery" },
  { match: (p) => p.startsWith("/admin/contacts"), title: "Inquiries" },
];

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const title = titles.find((t) => t.match(pathname))?.title ?? "Studio";

  function signOut() {
    startTransition(async () => {
      try {
        await logoutAdmin();
        toast.success("Signed out");
        router.replace("/admin/login");
        router.refresh();
      } catch {
        toast.error("Couldn't sign out");
      }
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream-light/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          <h1 className="text-xl font-black">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-charcoal sm:inline">Studio admin</span>
          <button
            type="button"
            onClick={signOut}
            disabled={pending}
            className="rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-sm font-semibold transition hover:bg-sky-soft/60 disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/20 md:hidden"
          >
            <div className="flex flex-col p-3">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-sky-soft/60"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-sky-soft/60"
              >
                ← View live site
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
