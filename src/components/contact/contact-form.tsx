"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";

const initialState: ContactState = { status: "idle" };

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">
        {label} {required ? <span className="text-red">*</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none placeholder:text-charcoal/60 focus:ring-2 focus:ring-gold"
      />
      {error ? <span className="mt-1 block text-xs text-red">{error}</span> : null}
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Sending…" : "Send inquiry"}
    </Button>
  );
}

export function ContactForm({
  collectionOptions,
  defaultCollection,
}: {
  collectionOptions: { title: string; slug: string }[];
  defaultCollection?: string;
}) {
  const [state, formAction] = useActionState(submitContact, initialState);

  useEffect(() => {
    if (state.status === "success" && state.message) toast.success(state.message);
    if (state.status === "error" && state.message) toast.error(state.message);
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="rounded-card border-2 border-ink bg-cream-light p-8 text-center shadow-card">
        <span className="text-4xl" aria-hidden>
          🎨
        </span>
        <h2 className="mt-3 text-2xl font-bold">Message received</h2>
        <p className="mt-2 text-charcoal">{state.message}</p>
        <p className="mt-4 text-sm text-charcoal">
          In the meantime, feel free to browse the collections.
        </p>
        <div className="mt-5">
          <Button href="/collections" variant="secondary">
            View collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-card border-2 border-ink bg-cream-light p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required placeholder="Your name" error={state.errors?.name} />
        <Field label="Email" name="email" type="email" required placeholder="you@email.com" error={state.errors?.email} />
        <Field label="X / Twitter handle" name="twitter_handle" placeholder="@yourhandle" error={state.errors?.twitter_handle} />
        <Field label="Project budget (optional)" name="budget" placeholder="e.g. $150 to $300" error={state.errors?.budget} />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Collection interest</span>
        <select
          name="collection_interest"
          defaultValue={defaultCollection ?? ""}
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">No preference / custom avatar</option>
          {collectionOptions.map((c) => (
            <option key={c.slug} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">
          Message <span className="text-red">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about the avatar or piece you have in mind…"
          className="w-full rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-sm outline-none placeholder:text-charcoal/60 focus:ring-2 focus:ring-gold"
        />
        {state.errors?.message ? (
          <span className="mt-1 block text-xs text-red">{state.errors.message}</span>
        ) : null}
      </label>

      {/* Reference upload placeholder — direct uploads can be wired to Supabase
          Storage; for now collectors can paste a link to their avatar. */}
      <Field
        label="Reference image URL (optional)"
        name="attachment_url"
        placeholder="https://…"
        error={state.errors?.attachment_url}
      />

      {/* Honeypot: hidden from humans, must stay empty. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-charcoal">
          We&apos;ll reply by email. Your details are never shared.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
