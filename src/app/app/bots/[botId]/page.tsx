"use client";

import Link from "next/link";
import {
  DragEvent,
  FormEvent,
  TextareaHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Copy, FileUp, Loader2, Pencil, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { LinkPendingSpinner } from "@/components/link-pending-spinner";
import {
  defaultNoAnswerMessage,
  defaultSystemPrompt,
} from "@/lib/bot-defaults";

const DOC_FILE_RE = /\.(txt|md|markdown|csv|json|log|tsv|pdf|docx)$/i;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type Doc = { id: string; title: string; fileExt?: string; createdAt: string };
type Bot = {
  id: string;
  name: string;
  publicKey: string;
  welcomeMessage: string;
  systemPrompt: string;
  noAnswerMessage: string;
  primaryColor: string;
};

type Msg = {
  role: "user" | "assistant";
  text: string;
  contactOperator?: boolean;
};

function AutoGrowField({
  value,
  className,
  invalid,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 50)}px`;
  }, [value]);

  return (
    <textarea
      {...props}
      ref={ref}
      rows={1}
      value={value}
      aria-invalid={invalid || undefined}
      className={`input mt-2 min-h-[3.125rem] resize-none overflow-hidden ${
        invalid
          ? "border-accent focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_28%,transparent)]"
          : ""
      } ${className ?? ""}`}
    />
  );
}

function Bone({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-line/30 ${className ?? ""}`} />;
}

function InlineSpinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={`size-4 shrink-0 animate-spin ${className ?? ""}`}
      aria-hidden
    />
  );
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

      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <section className="panel shrink-0 rounded-3xl p-5">
            <Bone className="h-7 w-40" />
            <Bone className="mt-3 h-4 w-full" />
            <Bone className="mt-4 h-[3.125rem] w-full rounded-2xl" />
            <Bone className="mt-4 h-[3.125rem] w-full rounded-2xl" />
            <Bone className="mt-4 h-11 w-full rounded-full" />
          </section>
          <section className="panel flex min-h-[520px] flex-col rounded-3xl p-5">
            <Bone className="h-7 w-36 shrink-0" />
            <Bone className="mt-3 h-4 w-full max-w-sm shrink-0" />
            <Bone className="mt-3 h-11 w-full rounded-full" />
            <Bone className="mt-1 h-3 w-40" />
            <div className="mt-3 shrink-0">
              <Bone className="h-12 w-full rounded-2xl" />
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
              <Bone className="h-12 w-full shrink-0 rounded-2xl" />
              <Bone className="min-h-[140px] w-full flex-1 rounded-2xl" />
              <Bone className="h-11 w-full shrink-0 rounded-full" />
            </div>
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <section className="panel flex min-h-[520px] flex-1 flex-col rounded-3xl p-5">
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
      </div>
      <section className="panel shrink-0 rounded-3xl p-5">
        <Bone className="h-7 w-52" />
        <Bone className="mt-3 h-4 w-full max-w-xl" />
        <Bone className="mt-4 h-28 w-full rounded-2xl" />
        <div className="mt-4 flex gap-2">
          <Bone className="h-11 flex-1 rounded-full" />
          <Bone className="h-11 flex-1 rounded-full" />
        </div>
      </section>
    </div>
  );
}

export default function BotDetailPage() {
  const params = useParams<{ botId: string }>();
  const botId = params.botId;
  const router = useRouter();
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
  const [prompt, setPrompt] = useState("");
  const [fallback, setFallback] = useState("");
  const [promptBusy, setPromptBusy] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(
    null,
  );
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState("");
  const [renameBusy, setRenameBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
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
      setPrompt(
        (data.bot.systemPrompt || "").trim() || defaultSystemPrompt(locale),
      );
      setFallback(
        (data.bot.noAnswerMessage || "").trim() ||
          defaultNoAnswerMessage(locale),
      );
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
  }, [botId, locale, t.app.loadFailed]);

  async function savePrompt() {
    if (promptBusy) return;
    if (prompt.length > 1000 || fallback.length > 280) return;
    setPromptBusy(true);
    setPromptSaved(false);
    setError("");
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: prompt.slice(0, 1000),
          noAnswerMessage: fallback.slice(0, 280),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.app.instructionsFailed);
      }
      setBot(data.bot);
      setPromptSaved(true);
      window.setTimeout(() => setPromptSaved(false), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.app.instructionsFailed);
    } finally {
      setPromptBusy(false);
    }
  }

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
    if (deletingDocId) return;
    setDeletingDocId(id);
    setError("");
    try {
      await fetch(`/api/bots/${botId}/docs/${id}`, { method: "DELETE" });
      await load();
    } catch {
      setError(t.app.loadFailed);
    } finally {
      setDeletingDocId(null);
    }
  }

  async function openDoc(id: string) {
    if (openingDocId) return;
    setOpeningDocId(id);
    setError("");
    try {
      const res = await fetch(`/api/bots/${botId}/docs/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.app.loadFailed);
      }
      setPreview({
        title: data.document.title,
        content: data.document.content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.app.loadFailed);
    } finally {
      setOpeningDocId(null);
    }
  }

  useEffect(() => {
    if (!preview && !editOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (preview) setPreview(null);
      else if (editOpen && !renameBusy && !deleteBusy) setEditOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview, editOpen, renameBusy, deleteBusy]);

  function openEdit() {
    if (!bot) return;
    setEditName(bot.name);
    setEditError("");
    setEditOpen(true);
  }

  async function saveBotName(e: FormEvent) {
    e.preventDefault();
    if (!bot || renameBusy || deleteBusy) return;
    const next = editName.trim();
    if (next.length < 2) {
      setEditError(t.app.botNameTooShort);
      return;
    }
    if (next === bot.name) {
      setEditOpen(false);
      return;
    }
    setRenameBusy(true);
    setEditError("");
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: next.slice(0, 80) }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : t.app.renameFailed,
        );
      }
      setBot(data.bot);
      setEditOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t.app.renameFailed);
    } finally {
      setRenameBusy(false);
    }
  }

  async function deleteBot() {
    if (!bot || deleteBusy || renameBusy) return;
    if (!window.confirm(t.app.deleteBotConfirm)) return;
    setDeleteBusy(true);
    setEditError("");
    try {
      const res = await fetch(`/api/bots/${botId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : t.app.deleteFailed,
        );
      }
      router.push("/app");
      router.refresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t.app.deleteFailed);
      setDeleteBusy(false);
    }
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
        text: res.ok ? data.answer : data.error || t.app.chatFailed,
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
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <LinkPendingSpinner />
            {t.app.backToBots}
          </Link>
          <h1 className="display mt-2 text-3xl font-bold">{bot.name}</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost inline-flex items-center gap-2 text-sm"
          onClick={openEdit}
        >
          <Pencil className="size-4" aria-hidden />
          {t.app.editBot}
        </button>
      </div>

      {error ? <p className="shrink-0 text-sm text-accent">{error}</p> : null}

      <div className="grid flex-1 gap-6 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-6">
          <section className="panel shrink-0 rounded-3xl p-5">
            <h2 className="display text-xl font-bold">
              {t.app.instructionsTitle}
            </h2>
            <p className="mt-1 text-sm text-muted">{t.app.instructionsHint}</p>
            <label className="mt-4 block text-sm font-medium text-ink">
              {t.app.toneTitle}
            </label>
            <AutoGrowField
              value={prompt}
              invalid={prompt.length > 1000}
              onChange={(e) => {
                setPrompt(e.target.value);
                setPromptSaved(false);
              }}
              onBlur={() => {
                if (
                  bot &&
                  prompt.length <= 1000 &&
                  fallback.length <= 280 &&
                  (prompt !== bot.systemPrompt ||
                    fallback !== (bot.noAnswerMessage || ""))
                ) {
                  void savePrompt();
                }
              }}
              placeholder={t.app.instructionsPlaceholder}
            />
            {prompt.length > 1000 ? (
              <p className="mt-1 text-xs text-accent" role="alert">
                {t.app.charLimitHint.replace("{n}", "1000")}
              </p>
            ) : null}
            <label className="mt-4 block text-sm font-medium text-ink">
              {t.app.fallbackTitle}
            </label>
            <AutoGrowField
              value={fallback}
              invalid={fallback.length > 280}
              onChange={(e) => {
                setFallback(e.target.value);
                setPromptSaved(false);
              }}
              onBlur={() => {
                if (
                  bot &&
                  prompt.length <= 1000 &&
                  fallback.length <= 280 &&
                  (prompt !== bot.systemPrompt ||
                    fallback !== (bot.noAnswerMessage || ""))
                ) {
                  void savePrompt();
                }
              }}
              placeholder={t.app.fallbackPlaceholder}
            />
            {fallback.length > 280 ? (
              <p className="mt-1 text-xs text-accent" role="alert">
                {t.app.charLimitHint.replace("{n}", "280")}
              </p>
            ) : null}
            <button
              className="btn btn-ghost mt-4 inline-flex w-full items-center justify-center gap-2 text-sm"
              type="button"
              disabled={
                promptBusy || prompt.length > 1000 || fallback.length > 280
              }
              onClick={() => void savePrompt()}
            >
              {promptBusy ? <InlineSpinner /> : null}
              {promptBusy
                ? t.app.instructionsSaving
                : promptSaved
                  ? t.app.instructionsSaved
                  : t.app.instructionsSave}
            </button>
          </section>

          <section
            className={`panel flex min-h-[520px] flex-1 flex-col rounded-3xl p-5 ${
              dragging ? "ring-2 ring-moss" : ""
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <h2 className="display shrink-0 text-xl font-bold">
              {t.app.documentsTitle}
            </h2>
            <p className="mt-1 shrink-0 text-sm text-muted">
              {t.app.documentsHint}
            </p>
            <div className="mt-3 shrink-0">
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
                className="btn btn-ghost inline-flex w-full items-center justify-center gap-2 text-sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <InlineSpinner />
                ) : (
                  <FileUp className="size-4" aria-hidden />
                )}
                {uploading ? t.app.uploading : t.app.attachFile}
              </button>
              <p className="mt-1 text-xs text-muted">
                {dragging ? t.app.dropHint : t.app.attachHint}
              </p>
            </div>
            <ul className="mt-3 max-h-40 shrink-0 space-y-2 overflow-y-auto">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex min-h-[3.125rem] items-center justify-between gap-3 rounded-[0.85rem] bg-foam/60 px-[0.9rem] py-0"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 truncate text-left text-sm underline decoration-ink/25 underline-offset-2 hover:decoration-ink/60 disabled:no-underline"
                    onClick={() => void openDoc(d.id)}
                    disabled={!!openingDocId || !!deletingDocId}
                    title={t.app.viewDoc}
                    aria-label={`${t.app.viewDoc}: ${d.title}`}
                  >
                    {openingDocId === d.id ? <InlineSpinner /> : null}
                    <span className="min-w-0 truncate">{d.title}</span>
                    {d.fileExt ? (
                      <span className="shrink-0 text-muted no-underline">
                        {d.fileExt}
                      </span>
                    ) : null}
                  </button>
                  <button
                    className="inline-flex shrink-0 items-center gap-1.5 text-sm text-accent"
                    type="button"
                    disabled={!!deletingDocId || !!openingDocId}
                    onClick={() => void removeDoc(d.id)}
                  >
                    {deletingDocId === d.id ? <InlineSpinner /> : null}
                    {t.app.deleteDoc}
                  </button>
                </li>
              ))}
              {docs.length === 0 ? (
                <li className="text-sm text-muted">{t.app.noDocuments}</li>
              ) : null}
            </ul>
            <form
              onSubmit={uploadDoc}
              className="mt-4 flex min-h-0 flex-1 flex-col gap-3"
            >
              <div className="flex shrink-0 items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="shrink-0 text-xs text-muted">
                  {t.app.pasteOrDescribe}
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>
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
                className="btn btn-primary inline-flex w-full shrink-0 items-center justify-center gap-2"
                type="submit"
                disabled={uploading}
              >
                {uploading ? <InlineSpinner /> : null}
                {uploading ? t.app.uploading : t.app.uploadIndex}
              </button>
            </form>
          </section>
        </div>

        <div className="flex min-h-0 flex-col gap-6">
          <section className="panel flex min-h-[520px] flex-1 flex-col rounded-3xl p-5">
            <h2 className="display shrink-0 text-xl font-bold">
              {t.app.chatTitle}
            </h2>
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
                disabled={busy}
              />
              <button
                className="btn btn-primary inline-flex items-center gap-2"
                disabled={busy}
              >
                {busy ? <InlineSpinner /> : null}
                {t.app.send}
              </button>
            </form>
          </section>
        </div>
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
            <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn btn-primary inline-flex w-full flex-1 items-center justify-center gap-2 text-sm"
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
                className="btn btn-ghost inline-flex w-full flex-1 items-center justify-center gap-2 text-sm"
                target="_blank"
              >
                <LinkPendingSpinner />
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
              className="btn btn-primary mt-4 inline-flex w-full items-center justify-center gap-2 text-sm sm:w-auto"
            >
              <LinkPendingSpinner />
              {t.app.upgradeForEmbed}
            </Link>
          </>
        )}
      </section>

      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--ink)_40%,transparent)] p-5"
          onClick={() => setPreview(null)}
        >
          <div
            className="panel flex max-h-[min(80vh,720px)] w-full max-w-2xl flex-col rounded-3xl p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="doc-preview-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3">
              <h2
                id="doc-preview-title"
                className="display min-w-0 text-xl font-bold"
              >
                {preview.title}
              </h2>
              <button
                type="button"
                className="btn btn-ghost shrink-0 px-3 text-sm"
                onClick={() => setPreview(null)}
                aria-label={t.app.closeDoc}
              >
                <X className="size-4" aria-hidden />
                {t.app.closeDoc}
              </button>
            </div>
            <pre className="mt-4 min-h-0 flex-1 overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
              {preview.content}
            </pre>
          </div>
        </div>
      ) : null}

      {editOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--ink)_40%,transparent)] p-5"
          onClick={() => {
            if (!renameBusy && !deleteBusy) setEditOpen(false);
          }}
        >
          <div
            className="panel w-full max-w-md rounded-3xl p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-bot-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="edit-bot-title"
                className="display text-xl font-bold"
              >
                {t.app.editBotTitle}
              </h2>
              <button
                type="button"
                className="btn btn-ghost shrink-0 px-3 text-sm"
                disabled={renameBusy || deleteBusy}
                onClick={() => setEditOpen(false)}
                aria-label={t.app.closeDoc}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <form onSubmit={saveBotName} className="mt-5 space-y-3">
              <label className="block text-sm font-medium text-ink">
                {t.app.botNameLabel}
                <input
                  className="input mt-2"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    setEditError("");
                  }}
                  maxLength={80}
                  required
                  disabled={renameBusy || deleteBusy}
                  autoFocus
                />
              </label>
              {editError ? (
                <p className="text-sm text-accent" role="alert">
                  {editError}
                </p>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary inline-flex w-full items-center justify-center gap-2 text-sm"
                disabled={renameBusy || deleteBusy}
              >
                {renameBusy ? <InlineSpinner /> : null}
                {renameBusy ? t.app.savingBotName : t.app.saveBotName}
              </button>
            </form>

            <div className="mt-6 border-t border-line pt-5">
              <button
                type="button"
                className="btn btn-ghost inline-flex w-full items-center justify-center gap-2 text-sm text-accent"
                disabled={renameBusy || deleteBusy}
                onClick={() => void deleteBot()}
              >
                {deleteBusy ? <InlineSpinner /> : null}
                {deleteBusy ? t.app.deletingBot : t.app.deleteBot}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
