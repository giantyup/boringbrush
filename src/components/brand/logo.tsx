import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  showWordmark?: boolean;
  wordmark?: string;
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
  onClick?: () => void;
};

export function Logo({
  href,
  showWordmark = true,
  wordmark = SITE.name,
  className,
  markSize = 36,
  wordmarkClassName,
  onClick,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={markSize} />
      {showWordmark ? (
        <span
          className={cn(
            "font-brand text-[1.05rem] font-extrabold tracking-tight sm:text-xl",
            wordmarkClassName,
          )}
          style={{ letterSpacing: "-0.025em", lineHeight: 1 }}
        >
          <span className="text-[#15110a]">Boring</span>
          <span className="bb-rainbow-text">Brush</span>
        </span>
      ) : (
        <span className="sr-only">{wordmark}</span>
      )}
    </>
  );

  const classes = cn("flex items-center gap-3 sm:gap-4", className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {content}
    </div>
  );
}
