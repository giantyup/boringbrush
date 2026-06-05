import { RainbowStripe } from "./rainbow-stripe";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      {eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-taupe">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
      <RainbowStripe
        className={cn("mt-4 max-w-[120px]", align === "center" && "mx-auto")}
      />
      {subtitle ? (
        <p className="mt-4 text-pretty text-charcoal">{subtitle}</p>
      ) : null}
    </div>
  );
}
