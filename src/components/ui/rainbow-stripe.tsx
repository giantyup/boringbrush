import { cn } from "@/lib/utils";

/**
 * The recurring rainbow accent inspired by the avatar's suspenders. Used as a
 * thin divider on cards, sections, and buttons.
 */
export function RainbowStripe({
  className,
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bb-rainbow block rounded-full",
        vertical ? "w-1.5" : "h-1.5 w-full",
        className,
      )}
    />
  );
}
