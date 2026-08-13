"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "@/components/locale-provider";

export function FaqContactPopover() {
  const { t } = useLocale();
  const L = t.landing;
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    // Demo MVP — open mail client; no backend contact route yet.
    window.location.href = `mailto:hello@replybase.app?subject=${encodeURIComponent(
      L.contactSubject,
    )}&body=${encodeURIComponent(`From: ${email}\n\n`)}`;
    setSent(true);
  }

  return (
    <div className="relative mt-10 inline-block">
      <button
        type="button"
        className="btn btn-ghost text-sm"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {L.stillQuestions}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-3 w-[min(100vw-2.5rem,22rem)] rounded-2xl border border-line bg-[var(--panel)] p-4 shadow-[0_20px_50px_rgba(7,23,20,0.12)] backdrop-blur-md">
          <p className="text-sm text-muted">{L.stillQuestionsHint}</p>
          {sent ? (
            <p className="mt-3 text-sm font-medium text-moss-deep">
              {L.thanksContact}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
              <input
                className="input"
                name="email"
                type="email"
                required
                placeholder={L.emailPlaceholder}
              />
              <button type="submit" className="btn btn-primary text-sm">
                {L.sendQuestion}
              </button>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
