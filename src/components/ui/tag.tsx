import { cn } from "@/lib/utils";

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/30 bg-sky-soft/60 px-2.5 py-0.5 text-xs font-medium text-ink",
        className,
      )}
    >
      #{children}
    </span>
  );
}
