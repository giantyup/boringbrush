import { RainbowStripe } from "./rainbow-stripe";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border-2 border-dashed border-ink/30 bg-cream-light/50 px-6 py-14 text-center">
      <RainbowStripe className="mb-5 max-w-[80px]" />
      {icon ? <div className="mb-3 text-4xl">{icon}</div> : null}
      <h3 className="text-xl font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-charcoal">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
