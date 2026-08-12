"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EmbedInner() {
  const params = useParams<{ botId: string }>();
  const search = useSearchParams();
  const key = search.get("key") || "";

  useEffect(() => {
    if (!key) return;
    const existing = document.querySelector("script[data-replybase]");
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.src = "/widget.js";
    s.async = true;
    s.dataset.replybase = "1";
    s.setAttribute("data-bot-id", params.botId);
    s.setAttribute("data-key", key);
    s.setAttribute("data-origin", window.location.origin);
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [params.botId, key]);

  return (
    <div className="grain min-h-screen px-5 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.18em] text-muted">
          Widget playground
        </p>
        <h1 className="display mt-3 text-4xl font-bold">
          Pretend this is your marketing site
        </h1>
        <p className="mt-4 text-muted">
          The Replybase launcher should appear in the bottom-right. Ask a
          question from your uploaded docs.
        </p>
        <div className="panel mt-10 rounded-3xl p-8">
          <h2 className="display text-2xl font-bold">Acme Cloud</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Ship faster with reliable APIs. Need help? Chat with our docs bot —
            it only answers from published help articles.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">Loading…</div>}>
      <EmbedInner />
    </Suspense>
  );
}
