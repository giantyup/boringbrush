import type { AdminStats } from "@/lib/data/admin";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

const cards: { key: keyof AdminStats; label: string; icon: string }[] = [
  { key: "collections", label: "Collections", icon: "🗂" },
  { key: "images", label: "Gallery images", icon: "🖼" },
  { key: "featured", label: "Featured collections", icon: "★" },
  { key: "unread", label: "Unread inquiries", icon: "✉" },
];

export function AdminStatsCards({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card"
        >
          <RainbowStripe className="rounded-none" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-charcoal">
                {card.label}
              </span>
              <span aria-hidden className="text-lg">
                {card.icon}
              </span>
            </div>
            <p className="mt-2 font-display text-4xl font-black">
              {stats[card.key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
