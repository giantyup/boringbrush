import { cn } from "@/lib/utils";
import type { GalleryStatus } from "@/types/database";

const config: Record<GalleryStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-[#3f8f4f] text-white" },
  sold: { label: "Sold", className: "bg-red text-white" },
  commission: { label: "Commission", className: "bg-purple text-white" },
  archived: { label: "Archived", className: "bg-warm-gray text-white" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: GalleryStatus;
  className?: string;
}) {
  const { label, className: tone } = config[status] ?? config.available;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
