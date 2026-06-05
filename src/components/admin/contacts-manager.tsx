"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import type { ContactRequest } from "@/types/database";
import {
  deleteContact,
  setContactArchived,
  setContactRead,
} from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type View = "inbox" | "archived";

export function ContactsManager({ initial }: { initial: ContactRequest[] }) {
  const [rows, setRows] = useState(initial);
  const [view, setView] = useState<View>("inbox");
  const [active, setActive] = useState<ContactRequest | null>(null);
  const [target, setTarget] = useState<ContactRequest | null>(null);
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () => rows.filter((r) => (view === "inbox" ? !r.is_archived : r.is_archived)),
    [rows, view],
  );

  function patch(id: string, changes: Partial<ContactRequest>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }

  function open(contact: ContactRequest) {
    setActive(contact);
    if (!contact.is_read) {
      patch(contact.id, { is_read: true });
      startTransition(async () => {
        await setContactRead(contact.id, true);
      });
    }
  }

  function toggleRead(contact: ContactRequest) {
    const value = !contact.is_read;
    patch(contact.id, { is_read: value });
    startTransition(async () => {
      const result = await setContactRead(contact.id, value);
      if (!result.ok) toast.error(result.error ?? "Update failed");
    });
  }

  function toggleArchive(contact: ContactRequest) {
    const value = !contact.is_archived;
    patch(contact.id, { is_archived: value });
    if (active?.id === contact.id) setActive(null);
    startTransition(async () => {
      const result = await setContactArchived(contact.id, value);
      if (result.ok) toast.success(value ? "Archived" : "Restored to inbox");
      else toast.error(result.error ?? "Update failed");
    });
  }

  function confirmDelete() {
    if (!target) return;
    const id = target.id;
    startTransition(async () => {
      const result = await deleteContact(id);
      if (result.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        if (active?.id === id) setActive(null);
        toast.success("Inquiry deleted");
      } else {
        toast.error(result.error ?? "Delete failed");
      }
      setTarget(null);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(["inbox", "archived"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={cn(
              "rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold capitalize transition",
              view === v ? "bg-ink text-cream-light" : "bg-cream-light hover:bg-sky-soft/60",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={view === "inbox" ? "Inbox zero" : "Nothing archived"}
          description={
            view === "inbox"
              ? "New inquiries from the contact form will appear here."
              : "Archived inquiries will be kept here."
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-card">
            {visible.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => open(c)}
                className={cn(
                  "flex w-full items-start justify-between gap-3 border-b border-ink/10 px-4 py-3 text-left transition last:border-0 hover:bg-sky-soft/40",
                  active?.id === c.id && "bg-sky-soft/60",
                )}
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="truncate">{c.name}</span>
                    {!c.is_read ? (
                      <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-ink">
                        New
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-sm text-charcoal">{c.message}</p>
                </div>
                <span className="shrink-0 text-xs text-charcoal">
                  {formatDate(c.created_at)}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-card border-2 border-ink bg-cream-light p-5 shadow-card">
            {active ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{active.name}</h3>
                    <a
                      href={`mailto:${active.email}`}
                      className="text-sm font-semibold text-taupe underline underline-offset-4"
                    >
                      {active.email}
                    </a>
                  </div>
                  <span className="text-xs text-charcoal">
                    {formatDate(active.created_at)}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <Detail label="X / Twitter" value={active.twitter_handle} />
                  <Detail label="Collection" value={active.collection_interest} />
                  <Detail label="Budget" value={active.budget} />
                  <Detail label="Reference" value={active.attachment_url} link />
                </dl>

                <div className="rounded-xl border border-ink/15 bg-white p-3">
                  <p className="whitespace-pre-wrap text-sm text-ink">{active.message}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Action onClick={() => toggleRead(active)}>
                    Mark {active.is_read ? "unread" : "read"}
                  </Action>
                  <Action onClick={() => toggleArchive(active)}>
                    {active.is_archived ? "Restore" : "Archive"}
                  </Action>
                  <a
                    href={`mailto:${active.email}`}
                    className="rounded-full border-2 border-ink bg-gold px-3.5 py-1.5 text-sm font-semibold"
                  >
                    Reply by email
                  </a>
                  <button
                    type="button"
                    onClick={() => setTarget(active)}
                    className="rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-sm font-semibold text-red hover:bg-red hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center py-12 text-sm text-charcoal">
                Select an inquiry to read it.
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={target !== null}
        title="Delete this inquiry?"
        description="This permanently removes the message. This cannot be undone."
        loading={pending}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}

function Detail({
  label,
  value,
  link,
}: {
  label: string;
  value?: string | null;
  link?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-taupe">{label}</dt>
      <dd className="truncate">
        {link ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-taupe underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function Action({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-sm font-semibold transition hover:bg-sky-soft/60"
    >
      {children}
    </button>
  );
}
