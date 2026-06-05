import { Button } from "@/components/ui/button";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <RainbowStripe className="max-w-[120px]" />
      <p className="mt-8 font-display text-7xl font-black text-gold bb-text-stroke">
        404
      </p>
      <h1 className="mt-4 text-3xl font-black">This piece isn&apos;t on the shelf</h1>
      <p className="mt-3 text-charcoal">
        The page you&apos;re looking for has been moved, sold, or never existed.
        Let&apos;s get you back to the gallery.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back home</Button>
        <Button href="/collections" variant="secondary">
          Browse collections
        </Button>
      </div>
    </div>
  );
}
