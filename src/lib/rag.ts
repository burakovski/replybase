import OpenAI from "openai";
import { nanoid } from "nanoid";
import {
  listChunksForBot,
  listDocuments,
  matchChunksByEmbedding,
} from "./db";
import {
  NO_ANSWER_SENTINEL,
  resolveNoAnswerMessage,
  type ReplyLocale,
} from "./no-answer";
import type { Chunk } from "./types";

const CHUNK_SIZE = 700;
const CHUNK_OVERLAP = 80;
const VECTOR_CANDIDATES = 16;
const MAX_PER_DOC = 2;

const TOKEN_ALIASES: Record<string, string[]> = {
  сео: ["seo"],
  seo: ["сео"],
};

export function chunkText(text: string): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const sections = cleaned
    .split(/\n(?:-{3,}|\*{3,})\n/)
    .flatMap((block) => block.split(/\n(?=#{1,3}\s)/))
    .map((s) => s.trim())
    .filter(Boolean);

  const parts: string[] = [];
  for (const section of sections) {
    if (section.length <= CHUNK_SIZE) {
      parts.push(section);
      continue;
    }

    const paras = section.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    let buf = "";
    for (const p of paras) {
      if (!buf) {
        buf = p;
        continue;
      }
      if (buf.length + 2 + p.length <= CHUNK_SIZE) {
        buf += `\n\n${p}`;
      } else {
        parts.push(...windowChunk(buf));
        buf = p;
      }
    }
    if (buf) parts.push(...windowChunk(buf));
  }
  return parts.filter(Boolean);
}

function windowChunk(text: string): string[] {
  if (text.length <= CHUNK_SIZE) return [text];
  const parts: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + CHUNK_SIZE, text.length);
    parts.push(text.slice(i, end).trim());
    if (end === text.length) break;
    i = Math.max(end - CHUNK_OVERLAP, i + 1);
  }
  return parts.filter(Boolean);
}

function labelChunk(title: string | undefined, text: string) {
  const t = title?.trim();
  if (!t) return text;
  if (text.startsWith(`Document: ${t}`)) return text;
  return `Document: ${t}\n\n${text}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function expandTokens(tokens: string[]): Set<string> {
  const out = new Set(tokens);
  for (const t of tokens) {
    for (const alias of TOKEN_ALIASES[t] || []) out.add(alias);
  }
  return out;
}

export function expandQuery(query: string): string {
  const extra: string[] = [];
  const tokens = expandTokens(tokenize(query));
  for (const t of tokens) {
    if (!query.toLowerCase().includes(t)) extra.push(t);
  }
  return extra.length ? `${query.trim()} ${extra.join(" ")}` : query;
}

function keywordScore(query: string, text: string): number {
  const q = expandTokens(tokenize(query));
  if (q.size === 0) return 0;
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;
  let hits = 0;
  for (const t of tokens) if (q.has(t)) hits += 1;
  return hits / Math.sqrt(tokens.length);
}

function diversify(
  ranked: { chunk: Chunk; score: number }[],
  topK: number,
  maxPerDoc: number,
): Chunk[] {
  const picked: Chunk[] = [];
  const seen = new Set<string>();
  const perDoc = new Map<string, number>();

  function tryAdd(item: { chunk: Chunk; score: number }, cap: number) {
    if (picked.length >= topK || item.score <= 0) return;
    if (seen.has(item.chunk.id)) return;
    const n = perDoc.get(item.chunk.documentId) ?? 0;
    if (n >= cap) return;
    picked.push(item.chunk);
    seen.add(item.chunk.id);
    perDoc.set(item.chunk.documentId, n + 1);
  }

  for (const cap of [1, maxPerDoc, topK]) {
    for (const item of ranked) tryAdd(item, cap);
  }
  return picked;
}

function getOpenAI() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const key = openRouterKey || openAiKey;
  if (!key) return null;

  if (openRouterKey) {
    return new OpenAI({
      apiKey: openRouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3012",
        "X-Title": "Replybase",
      },
    });
  }

  return new OpenAI({ apiKey: openAiKey });
}

function chatModel() {
  return (
    process.env.OPENAI_MODEL ||
    (process.env.OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : "gpt-4o-mini")
  );
}

function embeddingModel() {
  return (
    process.env.OPENAI_EMBEDDING_MODEL ||
    (process.env.OPENROUTER_API_KEY
      ? "openai/text-embedding-3-small"
      : "text-embedding-3-small")
  );
}

export async function embedTexts(
  texts: string[],
): Promise<(number[] | undefined)[]> {
  const client = getOpenAI();
  if (!client || texts.length === 0) return texts.map(() => undefined);
  try {
    const res = await client.embeddings.create({
      model: embeddingModel(),
      input: texts,
    });
    return res.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  } catch {
    return texts.map(() => undefined);
  }
}

export async function buildChunks(input: {
  botId: string;
  documentId: string;
  title?: string;
  content: string;
}): Promise<Chunk[]> {
  const pieces = chunkText(input.content).map((text) =>
    labelChunk(input.title, text),
  );
  const embeddings = await embedTexts(pieces);
  return pieces.map((text, i) => ({
    id: nanoid(),
    botId: input.botId,
    documentId: input.documentId,
    text,
    embedding: embeddings[i],
  }));
}

async function embedQuery(query: string): Promise<number[] | undefined> {
  const client = getOpenAI();
  if (!client) return undefined;
  try {
    const res = await client.embeddings.create({
      model: embeddingModel(),
      input: query,
    });
    return res.data[0]?.embedding;
  } catch {
    return undefined;
  }
}

export async function retrieveChunksForBot(
  botId: string,
  query: string,
  topK = 4,
): Promise<Chunk[]> {
  const expanded = expandQuery(query);
  const [all, docs] = await Promise.all([
    listChunksForBot(botId),
    listDocuments(botId),
  ]);
  if (!all.length) return [];

  const titleById = new Map(docs.map((d) => [d.id, d.title]));
  const vectorScore = new Map<string, number>();
  const queryEmbedding = await embedQuery(expanded);
  if (queryEmbedding) {
    try {
      const matched = await matchChunksByEmbedding({
        botId,
        embedding: queryEmbedding,
        matchCount: Math.max(topK * 4, VECTOR_CANDIDATES),
      });
      for (const c of matched) {
        if (typeof c.similarity === "number") {
          vectorScore.set(c.id, c.similarity);
        } else {
          vectorScore.set(c.id, 0.5);
        }
      }
    } catch {
      // keyword-only
    }
  }

  const ranked = all
    .map((chunk) => {
      const k = keywordScore(expanded, chunk.text);
      const v = vectorScore.get(chunk.id) ?? 0;
      const score = v > 0 ? 0.58 * v + 0.42 * k : k;
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score);

  return diversify(ranked, topK, MAX_PER_DOC).map((chunk) => ({
    ...chunk,
    documentTitle: titleById.get(chunk.documentId),
    text: labelChunk(titleById.get(chunk.documentId), chunk.text),
  }));
}

export async function answerWithContext(input: {
  question: string;
  contextChunks: Chunk[];
  systemPrompt: string;
  botName: string;
  locale?: ReplyLocale;
  noAnswerMessage?: string;
}): Promise<{
  answer: string;
  mode: "openai" | "extractive";
  unanswered: boolean;
}> {
  const locale = input.locale || "ru";
  const noAnswer = resolveNoAnswerMessage(locale, input.noAnswerMessage);

  if (!input.contextChunks.length) {
    return { answer: noAnswer, mode: "extractive", unanswered: true };
  }

  const context = input.contextChunks
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n\n");

  const client = getOpenAI();
  if (client) {
    try {
      const completion = await client.chat.completions.create({
        model: chatModel(),
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `${input.systemPrompt}

You are ${input.botName}, a product support assistant.
Answer ONLY using the provided context.
Each block is labeled with its source document. Do not mix facts across sources.
Prices, plans, and tariffs apply only to the service or product that source explicitly names. A website or landing package that includes “basic SEO” is not an SEO tariff. If the question is about a named service, ignore prices for other services.
If the context does not explicitly state the asked price or fact, reply with exactly ${NO_ANSWER_SENTINEL} and nothing else.
Do not invent facts. Keep answers concise and practical.
Always reply in the same language as the user's question (Russian → Russian, English → English). Do not switch languages.`,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${input.question}\n\nRespond in the same language as the question.`,
          },
        ],
      });
      const raw =
        completion.choices[0]?.message?.content?.trim() || NO_ANSWER_SENTINEL;
      if (
        raw === NO_ANSWER_SENTINEL ||
        raw.includes(NO_ANSWER_SENTINEL) ||
        /^i (don't|do not) (have|know)/i.test(raw)
      ) {
        return { answer: noAnswer, mode: "openai", unanswered: true };
      }
      return { answer: raw, mode: "openai", unanswered: false };
    } catch {
      // fall through
    }
  }

  const extractiveLead =
    locale === "ru" ? "По вашим документам:" : "Based on your docs:";
  const extractiveNote =
    locale === "ru"
      ? "(Демо-режим: добавьте OPENROUTER_API_KEY или OPENAI_API_KEY для полных ответов модели.)"
      : "(Demo mode: add OPENROUTER_API_KEY or OPENAI_API_KEY for full LLM answers.)";

  return {
    answer: `${extractiveLead}\n\n${input.contextChunks
      .slice(0, 2)
      .map((c) => c.text)
      .join("\n\n---\n\n")}\n\n${extractiveNote}`,
    mode: "extractive",
    unanswered: false,
  };
}
