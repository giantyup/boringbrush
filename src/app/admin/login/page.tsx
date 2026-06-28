import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { RainbowStripe } from "@/components/ui/rainbow-stripe";
import { Logo } from "@/components/brand/logo";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Studio Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-lift">
        <RainbowStripe className="rounded-none" />
        <div className="p-8">
          <Logo showWordmark={false} wordmark="BoringBrush Studio" />
          <h1 className="mt-6 text-2xl font-black">Sign in</h1>
          <p className="mt-2 text-sm text-charcoal">
            Enter the studio password to access the dashboard.
          </p>

          {hasSupabaseEnv ? (
            <Suspense>
              <LoginForm />
            </Suspense>
          ) : (
            <div className="mt-6 rounded-xl border-2 border-ink bg-sky-soft/60 p-4 text-sm">
              <p className="font-semibold">Supabase isn&apos;t configured yet.</p>
              <p className="mt-1 text-charcoal">
                Add your Supabase environment variables (see{" "}
                <code className="rounded bg-white px-1">.env.example</code>) and
                restart the dev server to enable studio login.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
