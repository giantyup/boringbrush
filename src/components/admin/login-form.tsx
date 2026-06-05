"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const urlError = searchParams.get("error");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await loginAdmin(password);
      if (result.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        setError(result.error ?? "Incorrect password.");
        setPassword("");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {urlError === "unauthorized" ? (
        <p className="rounded-lg border border-red bg-red/10 px-3 py-2 text-sm text-red">
          Your session expired. Sign in again.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red bg-red/10 px-3 py-2 text-sm text-red">
          {error}
        </p>
      ) : null}

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Studio password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter password"
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        />
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
