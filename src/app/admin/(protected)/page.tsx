import Link from "next/link";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { getAdminStats, getRecentContacts } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getRecentContacts(5),
  ]);

  return (
    <div className="space-y-8">
      <AdminStatsCards stats={stats} />

      <div className="flex flex-wrap gap-3">
        <Button href="/admin/collections/new" size="sm">
          + New collection
        </Button>
        <Button href="/admin/gallery" size="sm" variant="secondary">
          Manage gallery
        </Button>
        <Button href="/admin/contacts" size="sm" variant="secondary">
          View inquiries
        </Button>
      </div>

      <section className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card">
        <RainbowStripe className="rounded-none" />
        <div className="flex items-center justify-between p-5">
          <h2 className="text-lg font-bold">Recent inquiries</h2>
          <Link href="/admin/contacts" className="text-sm font-semibold text-taupe hover:text-ink">
            View all →
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="divide-y divide-ink/10 border-t border-ink/10">
            {recent.map((c) => (
              <Link
                key={c.id}
                href="/admin/contacts"
                className="flex items-center justify-between gap-4 px-5 py-3 transition hover:bg-sky-soft/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {c.name}
                    {!c.is_read ? (
                      <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">
                        New
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-sm text-charcoal">{c.message}</p>
                </div>
                <span className="shrink-0 text-xs text-charcoal">
                  {formatDate(c.created_at)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              title="No inquiries yet"
              description="New contact form submissions will show up here."
            />
          </div>
        )}
      </section>
    </div>
  );
}
