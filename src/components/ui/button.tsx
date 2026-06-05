import Link from "next/link";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 border-2 border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bb-paint-edge bg-gold text-ink hover:-translate-y-0.5 active:translate-y-0 shadow-[0_3px_0_0_#211e1c]",
  secondary:
    "bg-cream-light text-ink hover:bg-cream hover:-translate-y-0.5 shadow-[0_3px_0_0_#211e1c]",
  ghost: "border-transparent bg-transparent text-ink hover:bg-cream-light",
  danger:
    "bg-red text-white hover:-translate-y-0.5 shadow-[0_3px_0_0_#211e1c]",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type ButtonAsButton = ComponentProps<"button"> & {
  href?: undefined;
  variant?: Variant;
  size?: Size;
};

type ButtonAsLink = ComponentProps<typeof Link> & {
  href: string;
  variant?: Variant;
  size?: Size;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    return <Link className={classes} {...(props as ButtonAsLink)} />;
  }

  return <button className={classes} {...(props as ButtonAsButton)} />;
}
