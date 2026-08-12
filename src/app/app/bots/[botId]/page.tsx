"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Doc = { id: string; title: string; createdAt: string };
type Bot = {
  id: string;
  name: string;
  publicKey: string;
  welcomeMessage: string;
  systemPrompt: string;
  primaryColor: string;
};

type Msg = { role: "user" | "assistant"; text: string };

const SAMPLE_DOC = `Acme API — Getting Started

Create an account, then open Settings → API Keys to generate a secret key.
Never commit secret keys to git. Rotate keys every 90 days.

Rotate API keys
1. Open Settings → API Keys
2. Click Rotate next to the active key
3. Update your servers within 24 hours
4. Old keys expire automatically after 24 hours

Rate limits
- Free: 60 requests / minute
- Pro: 600 requests / minute
Burst traffic above the limit returns HTTP 429.

Webhooks
Point webhooks to HTTPS endpoints only. We retry failed deliveries 3 times with exponential backoff.

Embed widget
Paste the Replybase script tag before </body>. The widget answers from your uploaded docs using the same knowledge base as the in-app chat.
`;

export default function BotDetailPage() {
  const params = useParams<{ botId: string }>();
  const botId = params.botId;
  const [bot, setBot] = useState<Bot | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [embedAllowed, setEmbedAllowed] = useState(false);
  const [title, setTitle] = useState("Getting started");
  const [content, setContent] = useState(SAMPLE_DOC);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );

  async function load() {
    const res = await fetch(`/api/bots/${botId}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load");
      return;
    }
    setBot(data.bot);
    setDocs(data.documents || []);
    setEmbedAllowed(!!data.embedAllowed);
    setMessages([
      {
        role: "assistant",
        text: data.bot.welcomeMessage,
      },
    ]);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(`/api/bots/${botId}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }
      setBot(data.bot);
      setDocs(data.documents || []);
      setEmbedAllowed(!!data.embedAllowed);
      setMessages([
        {
          role: "assistant",
          text: data.bot.welcomeMessage,
        },
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, [botId]);

  async function uploadDoc(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/bots/${botId}/docs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setTitle("");
    setContent("");
    await load();
  }

  async function removeDoc(id: string) {
    await fetch(`/api/bots/${botId}/docs/${id}`, { method: "DELETE" });
    await load();
  }

  async function ask(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || busy) return;
    const q = question.trim();
    setQuestion("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    const res = await fetch(`/api/bots/${botId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q }),
    });
    const data = await res.json();
    setBusy(false);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: res.ok ? data.answer : data.error || "Chat failed",
      },
    ]);
  }

  if (!bot) {
    return <p className="text-sm text-muted">{error || "Loading…"}</p>;
  }

  const embedSnippet = `<script
  src="${origin}/widget.js"
  data-bot-id="${bot.id}"
  data-key="${bot.publicKey}"
  data-origin="${origin}"
  async
></script>`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-muted hover:text-ink">
            ← All bots
          </Link>
          <h1 className="display mt-2 text-3xl font-bold">{bot.name}</h1>
        </div>
        <Link href="/app/billing" className="btn btn-ghost text-sm">
          {embedAllowed ? "Manage plan" : "Upgrade for embed"}
        </Link>
      </div>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel rounded-3xl p-5">
          <h2 className="display text-xl font-bold">Documents</h2>
          <p className="mt-1 text-sm text-muted">
            Paste help center content. Sample doc is prefilled for the demo.
          </p>
          <form onSubmit={uploadDoc} className="mt-4 space-y-3">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              required
            />
            <textarea
              className="input textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste docs…"
              required
            />
            <button className="btn btn-primary" type="submit">
              Upload & index
            </button>
          </form>
          <ul className="mt-5 space-y-2">
            {docs.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-2xl bg-foam/60 px-3 py-2 text-sm"
              >
                <span>{d.title}</span>
                <button
                  className="text-accent"
                  type="button"
                  onClick={() => removeDoc(d.id)}
                >
                  Delete
                </button>
              </li>
            ))}
            {docs.length === 0 ? (
              <li className="text-sm text-muted">No documents yet.</li>
            ) : null}
          </ul>
        </section>

        <section className="panel flex min-h-[520px] flex-col rounded-3xl p-5">
          <h2 className="display text-xl font-bold">In-app chat</h2>
          <div
            className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto rounded-2xl p-4 text-sm"
            style={{
              background: "var(--chat-surface)",
              color: "var(--chat-fg)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className="max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2"
                style={{
                  background:
                    m.role === "user" ? "var(--chat-bot)" : "var(--chat-user)",
                  marginLeft: m.role === "user" ? "auto" : undefined,
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={ask} className="mt-3 flex gap-2">
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask from your docs…"
            />
            <button className="btn btn-primary" disabled={busy}>
              Send
            </button>
          </form>
        </section>
      </div>

      <section className="panel rounded-3xl p-5">
        <h2 className="display text-xl font-bold">Embeddable widget</h2>
        {embedAllowed ? (
          <>
            <p className="mt-2 text-sm text-muted">
              Paste this before <code>&lt;/body&gt;</code> on any site.
            </p>
            <pre
              className="mt-4 overflow-x-auto rounded-2xl p-4 text-xs"
              style={{
                background: "var(--chat-surface)",
                color: "var(--chat-fg)",
              }}
            >
              {embedSnippet}
            </pre>
            <Link
              href={`/embed/${bot.id}?key=${bot.publicKey}`}
              className="btn btn-ghost mt-4 text-sm"
              target="_blank"
            >
              Open widget playground
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Embed is gated behind Starter/Growth.{" "}
            <Link href="/app/billing" className="font-semibold text-ink">
              Upgrade with mock Stripe
            </Link>{" "}
            to unlock the script tag.
          </p>
        )}
      </section>
    </div>
  );
}
