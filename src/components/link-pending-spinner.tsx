"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

/** Must render as a descendant of `next/link` Link. */
export function LinkPendingSpinner({ className }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <Loader2
      className={`size-4 shrink-0 animate-spin ${className ?? ""}`}
      aria-hidden
    />
  );
}
