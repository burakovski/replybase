"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";

type Bot = {
  id: string;
  name: string;
  createdAt: string;
  primaryColor: string;
};

export default function AppHomePage() {
  const { t, locale } = useLocale();
  const [bots, setBots] = useState<Bot[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/bots");
    const data = await res.json();
    setBots(data.bots || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createBot(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t.app.createFailed);
      return;
    }
    setName("");
    await load();
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
        />
        <button className="btn btn-primary whitespace-nowrap" type="submit">
          {t.app.createBot}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-sm text-muted">{t.app.loading}</p>
        ) : bots.length === 0 ? (
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
