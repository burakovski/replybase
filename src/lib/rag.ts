import OpenAI from "openai";
import { nanoid } from "nanoid";
import { listChunksForBot, matchChunksByEmbedding } from "./db";
import {
  NO_ANSWER_MESSAGE,
  NO_ANSWER_SENTINEL,
  type ReplyLocale,
} from "./no-answer";
import type { Chunk } from "./types";

const CHUNK_SIZE = 700;
const CHUNK_OVERLAP = 80;

export function chunkText(text: string): string[] {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  const parts: string[] = [];
  let i = 0;
  while (i < cleaned.length) {
    const end = Math.min(i + CHUNK_SIZE, cleaned.length);
    parts.push(cleaned.slice(i, end).trim());
    if (end === cleaned.length) break;
    i = Math.max(end - CHUNK_OVERLAP, i + 1);
  }
  return parts.filter(Boolean);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function keywordScore(query: string, text: string): number {
  const q = new Set(tokenize(query));
  if (q.size === 0) return 0;
  const tokens = tokenize(text);
  if (tokens.length === 0) return 0;
  let hits = 0;
  for (const t of tokens) if (q.has(t)) hits += 1;
  return hits / Math.sqrt(tokens.length);
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
  content: string;
}): Promise<Chunk[]> {
  const pieces = chunkText(input.content);
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
  const queryEmbedding = await embedQuery(query);
  if (queryEmbedding) {
    try {
      const matched = await matchChunksByEmbedding({
        botId,
        embedding: queryEmbedding,
        matchCount: topK,
      });
      if (matched.length) return matched;
    } catch {
      // fall through to keyword search
    }
  }

  const chunks = await listChunksForBot(botId);
  if (!chunks.length) return [];

  return chunks
    .map((chunk) => ({ chunk, score: keywordScore(query, chunk.text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((s) => s.score > 0)
    .map((s) => s.chunk);
}

export async function answerWithContext(input: {
  question: string;
  contextChunks: Chunk[];
  systemPrompt: string;
  botName: string;
  locale?: ReplyLocale;
}): Promise<{
  answer: string;
  mode: "openai" | "extractive";
  unanswered: boolean;
}> {
  const locale = input.locale || "ru";
  const noAnswer = NO_ANSWER_MESSAGE[locale];

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
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `${input.systemPrompt}

You are ${input.botName}, a product support assistant.
Answer ONLY using the provided context.
If the answer is not clearly supported by the context, reply with exactly ${NO_ANSWER_SENTINEL} and nothing else.
Do not invent facts. Keep answers concise and practical.`,
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${input.question}`,
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

  return {
    answer: `Based on your docs:\n\n${input.contextChunks
      .slice(0, 2)
      .map((c) => c.text)
      .join("\n\n---\n\n")}\n\n(Demo mode: add OPENROUTER_API_KEY or OPENAI_API_KEY for full LLM answers.)`,
    mode: "extractive",
    unanswered: false,
  };
}
