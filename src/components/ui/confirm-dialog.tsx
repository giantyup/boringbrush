"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { RainbowStripe } from "./rainbow-stripe";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-card border-2 border-ink bg-cream-light shadow-lift"
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
          >
            <RainbowStripe className="rounded-none" />
            <div className="p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              {description ? (
                <p className="mt-2 text-sm text-charcoal">{description}</p>
              ) : null}
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={onCancel} disabled={loading}>
                  {cancelLabel}
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={loading}>
                  {loading ? "Working…" : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
