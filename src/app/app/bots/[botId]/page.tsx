"use client";

import Link from "next/link";
import {
  DragEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { Check, Copy, FileUp } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

const DOC_FILE_RE = /\.(txt|md|markdown|csv|json|log|tsv|pdf|docx)$/i;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type Doc = { id: string; title: string; createdAt: string };
type Bot = {
  id: string;
  name: string;
  publicKey: string;
  welcomeMessage: string;
  systemPrompt: string;
  primaryColor: string;
};

type Msg = {
  role: "user" | "assistant";
  text: string;
  contactOperator?: boolean;
};

function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-line/30 ${className ?? ""}`} />;
}

function BotDetailSkeleton() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <Bone className="h-4 w-28" />
          <Bone className="h-9 w-64 max-w-full" />
        </div>
        <Bone className="h-[2.875rem] w-40 shrink-0 rounded-full" />
      </div>

      <div className="grid min-h-[520px] flex-1 gap-6 lg:grid-cols-2">
        <section className="panel flex min-h-[520px] flex-col rounded-3xl p-5">
          <Bone className="h-7 w-36 shrink-0" />
          <Bone className="mt-3 h-4 w-full max-w-sm shrink-0" />
          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
            <Bone className="h-12 w-full shrink-0 rounded-2xl" />
            <Bone className="min-h-[140px] w-full flex-1 rounded-2xl" />
            <Bone className="h-11 w-48 shrink-0 rounded-full" />
          </div>
          <div className="mt-5 shrink-0 space-y-2">
            <Bone className="h-10 w-full rounded-2xl" />
          </div>
        </section>

        <section className="panel flex min-h-[520px] flex-col rounded-3xl p-5">
          <Bone className="h-7 w-40 shrink-0" />
          <div
            className="mt-4 flex min-h-0 flex-1 flex-col gap-3 rounded-2xl p-4"
            style={{ background: "var(--chat-surface)" }}
          >
            <Bone className="h-16 w-4/5 rounded-2xl bg-white/10" />
            <Bone className="ml-auto h-12 w-3/5 rounded-2xl bg-white/10" />
            <Bone className="h-20 w-3/4 rounded-2xl bg-white/10" />
          </div>
          <div className="mt-3 flex shrink-0 gap-2">
            <Bone className="h-12 flex-1 rounded-full" />
            <Bone className="h-12 w-24 rounded-full" />
          </div>
        </section>
      </div>

      <section className="panel shrink-0 rounded-3xl p-5">
        <Bone className="h-7 w-52" />
        <Bone className="mt-3 h-4 w-full max-w-xl" />
      </section>
    </div>
  );
}

export default function BotDetailPage() {
  const params = useParams<{ botId: string }>();
  const botId = params.botId;
  const { t, locale } = useLocale();
  const [bot, setBot] = useState<Bot | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [embedAllowed, setEmbedAllowed] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );

  function titleFromFilename(filename: string) {
    return filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || filename;
  }

  async function postDocument(docTitle: string, docContent: string) {
    const res = await fetch(`/api/bots/${botId}/docs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: docTitle, content: docContent }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || t.app.uploadFailed);
    }
    return data;
  }

  async function postDocumentFile(file: File, docTitle: string) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(`${file.name}: ${t.app.fileTooLarge}`);
    }
    const form = new FormData();
    form.append("file", file);
    form.append("title", docTitle);
    const res = await fetch(`/api/bots/${botId}/docs`, {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || t.app.uploadFailed);
    }
    return data;
  }

  async function ingestFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter(
      (f) =>
        DOC_FILE_RE.test(f.name) ||
        f.type.startsWith("text/") ||
        f.type === "application/pdf" ||
        f.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    if (files.length === 0) {
      setError(t.app.fileReadFailed);
      return;
    }

    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        const docTitle = titleFromFilename(file.name).slice(0, 120);
        await postDocumentFile(file, docTitle);
      }
      setTitle("");
      setContent("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.app.uploadFailed);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function load() {
    const res = await fetch(`/api/bots/${botId}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t.app.loadFailed);
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
    setBot(null);
    setDocs([]);
    setEmbedAllowed(false);
    setMessages([]);
    setError("");
    setQuestion("");

    void (async () => {
      const res = await fetch(`/api/bots/${botId}`);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        setError(data.error || t.app.loadFailed);
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
  }, [botId, t.app.loadFailed]);

  async function uploadDoc(e: FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setError("");
    setUploading(true);
    try {
      await postDocument(title, content);
      setTitle("");
      setContent("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.app.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files?.length) {
      void ingestFiles(e.dataTransfer.files);
    }
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
      body: JSON.stringify({ message: q, locale }),
    });
    const data = await res.json();
    setBusy(false);
    const unanswered = !!data.unanswered;
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: res.ok
          ? unanswered
            ? t.app.noAnswer
            : data.answer
          : data.error || t.app.chatFailed,
        contactOperator: res.ok && unanswered,
      },
    ]);
  }

  function contactOperator(questionText: string) {
    const subject = encodeURIComponent(t.app.contactOperatorSubject);
    const body = encodeURIComponent(questionText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setMessages((m) => [
      ...m,
      { role: "assistant", text: t.app.contactOperatorSent },
    ]);
  }

  if (!bot) {
    if (error) {
      return <p className="text-sm text-accent">{error}</p>;
    }
    return <BotDetailSkeleton />;
  }

  const embedSnippet = `<script
  src="${origin}/widget.js"
  data-bot-id="${bot.id}"
  data-key="${bot.publicKey}"
  data-origin="${origin}"
  async
></script>`;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-muted hover:text-ink">
            {t.app.backToBots}
          </Link>
          <h1 className="display mt-2 text-3xl font-bold">{bot.name}</h1>
        </div>
        <Link href="/app/billing" className="btn btn-ghost text-sm">
          {embedAllowed ? t.app.managePlan : t.app.upgradeForEmbed}
        </Link>
      </div>

      {error ? <p className="shrink-0 text-sm text-accent">{error}</p> : null}

      <div className="grid min-h-[520px] flex-1 gap-6 lg:grid-cols-2">
        <section
          className={`panel flex min-h-[520px] flex-col rounded-3xl p-5 ${
            dragging ? "ring-2 ring-moss" : ""
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <h2 className="display shrink-0 text-xl font-bold">
            {t.app.documentsTitle}
          </h2>
          <p className="mt-1 shrink-0 text-sm text-muted">{t.app.documentsHint}</p>
          <div className="mt-3 flex shrink-0 flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.markdown,.csv,.json,.log,.tsv,.pdf,.docx,text/plain,text/markdown,text/csv,application/json,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) void ingestFiles(e.target.files);
              }}
            />
            <button
              type="button"
              className="btn btn-ghost text-sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="size-4" aria-hidden />
              {uploading ? t.app.uploading : t.app.attachFile}
            </button>
            <span className="text-xs text-muted">
              {dragging ? t.app.dropHint : t.app.attachHint}
            </span>
          </div>
          <form
            onSubmit={uploadDoc}
            className="mt-4 flex min-h-0 flex-1 flex-col gap-3"
          >
            <input
              className="input shrink-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.app.docTitlePlaceholder}
              required
              disabled={uploading}
            />
            <textarea
              className="input textarea min-h-[140px] flex-1 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.app.docContentPlaceholder}
              required
              disabled={uploading}
            />
            <button
              className="btn btn-primary shrink-0 self-start"
              type="submit"
              disabled={uploading}
            >
              {uploading ? t.app.uploading : t.app.uploadIndex}
            </button>
          </form>
          <ul className="mt-5 shrink-0 space-y-2">
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
                  {t.app.deleteDoc}
                </button>
              </li>
            ))}
            {docs.length === 0 ? (
              <li className="text-sm text-muted">{t.app.noDocuments}</li>
            ) : null}
          </ul>
        </section>

        <section className="panel flex min-h-[520px] flex-col rounded-3xl p-5">
          <h2 className="display shrink-0 text-xl font-bold">{t.app.chatTitle}</h2>
          <div
            className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-2xl p-4 text-sm"
            style={{
              background: "var(--chat-surface)",
              color: "var(--chat-fg)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.role}`}
                className="flex max-w-[90%] flex-col gap-2"
                style={{
                  marginLeft: m.role === "user" ? "auto" : undefined,
                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="whitespace-pre-wrap rounded-2xl px-3 py-2"
                  style={{
                    background:
                      m.role === "user"
                        ? "var(--chat-bot)"
                        : "var(--chat-user)",
                  }}
                >
                  {m.text}
                </div>
                {m.contactOperator ? (
                  <button
                    type="button"
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--chat-fg)] transition hover:bg-white/15"
                    onClick={() => {
                      const prev = messages
                        .slice(0, i)
                        .reverse()
                        .find((x) => x.role === "user");
                      contactOperator(prev?.text || m.text);
                    }}
                  >
                    {t.app.contactOperator}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <form onSubmit={ask} className="mt-3 flex shrink-0 gap-2">
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.app.chatPlaceholder}
            />
            <button className="btn btn-primary" disabled={busy}>
              {t.app.send}
            </button>
          </form>
        </section>
      </div>

      <section className="panel shrink-0 rounded-3xl p-5">
        <h2 className="display text-xl font-bold">{t.app.embedTitle}</h2>
        {embedAllowed ? (
          <>
            <p className="mt-2 text-sm text-muted">
              {t.app.embedHintLead} <code>&lt;/body&gt;</code>{" "}
              {t.app.embedHintTrail}
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
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-primary text-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(embedSnippet);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1800);
                  } catch {
                    setError(t.app.loadFailed);
                  }
                }}
              >
                {copied ? (
                  <Check className="size-4" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )}
                {copied ? t.app.copied : t.app.copyCode}
              </button>
              <Link
                href={`/embed/${bot.id}?key=${bot.publicKey}`}
                className="btn btn-ghost text-sm"
                target="_blank"
              >
                {t.app.openPlayground}
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              {t.app.embedGated} {t.app.unlockScript}
            </p>
            <Link
              href="/app/billing"
              className="btn btn-primary mt-4 text-sm"
            >
              {t.app.upgradeForEmbed}
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
