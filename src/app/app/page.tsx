"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { LinkPendingSpinner } from "@/components/link-pending-spinner";

type Bot = {
  id: string;
  name: string;
  createdAt: string;
  primaryColor: string;
};

function BotCardSkeleton({ name }: { name?: string }) {
  return (
    <div
      className="panel animate-pulse rounded-3xl p-5"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-line/40" />
        {name ? (
          <h2 className="display text-xl font-bold text-muted">{name}</h2>
        ) : (
          <span className="h-6 w-40 rounded-md bg-line/35" />
        )}
      </div>
      <div className="mt-3 h-3 w-48 rounded-md bg-line/30" />
    </div>
  );
}

export default function AppHomePage() {
  const { t, locale } = useLocale();
  const [bots, setBots] = useState<Bot[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingName, setPendingName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch("/api/bots");
      const data = await res.json();
      if (cancelled) return;
      setBots(data.bots || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createBot(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (pendingName) return;
    if (trimmed.length < 2) {
      setError(t.app.botNameTooShort);
      return;
    }

    setError("");
    setPendingName(trimmed);
    setName("");

    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed, locale }),
    });
    const data = await res.json();
    if (!res.ok) {
      const raw = data.error;
      const message =
        typeof raw === "string"
          ? raw
          : Array.isArray(raw)
            ? t.app.botNameTooShort
            : t.app.createFailed;
      setError(message);
      setPendingName(null);
      setName(trimmed);
      return;
    }

    const created = data.bot as Bot | undefined;
    if (created?.id) {
      setBots((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
    } else {
      const list = await fetch("/api/bots");
      const body = await list.json();
      setBots(body.bots || []);
    }
    setPendingName(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-3xl font-bold">{t.app.botsTitle}</h1>
          <p className="mt-2 text-sm text-muted">{t.app.botsSubtitle}</p>
        </div>
      </div>

      <form
        onSubmit={createBot}
        className="panel mt-8 flex flex-col gap-3 rounded-3xl p-5 sm:flex-row"
      >
        <input
          className="input"
          placeholder={t.app.botNamePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={!!pendingName}
        />
        <button
          className="btn btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap"
          type="submit"
          disabled={!!pendingName}
        >
          {pendingName ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : null}
          {pendingName ? t.app.loading : t.app.createBot}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {pendingName ? <BotCardSkeleton name={pendingName} /> : null}
        {loading ? (
          <>
            <BotCardSkeleton />
            <BotCardSkeleton />
          </>
        ) : bots.length === 0 && !pendingName ? (
          <p className="text-sm text-muted">{t.app.noBots}</p>
        ) : (
          bots.map((bot) => (
            <Link
              key={bot.id}
              href={`/app/bots/${bot.id}`}
              className="panel rounded-3xl p-5 transition hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: bot.primaryColor }}
                />
                <h2 className="display text-xl font-bold">{bot.name}</h2>
                <LinkPendingSpinner className="ml-auto text-muted" />
              </div>
              <p className="mt-2 text-xs text-muted">
                {t.app.created}{" "}
                {new Date(bot.createdAt).toLocaleString(
                  locale === "ru" ? "ru-RU" : "en-US",
                )}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
