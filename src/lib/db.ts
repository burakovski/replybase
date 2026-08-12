import { nanoid } from "nanoid";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Bot, Chunk, Document, PlanId, User } from "./types";

type BotRow = {
  id: string;
  user_id: string;
  name: string;
  public_key: string;
  system_prompt: string;
  welcome_message: string;
  primary_color: string;
  created_at: string;
};

type DocRow = {
  id: string;
  bot_id: string;
  title: string;
  content: string;
  created_at: string;
};

type ChunkRow = {
  id: string;
  bot_id: string;
  document_id: string;
  content: string;
  embedding: number[] | string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  plan: PlanId;
  created_at: string;
};

function mapBot(row: BotRow): Bot {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    publicKey: row.public_key,
    systemPrompt: row.system_prompt,
    welcomeMessage: row.welcome_message,
    primaryColor: row.primary_color,
    createdAt: row.created_at,
  };
}

function mapDoc(row: DocRow): Document {
  return {
    id: row.id,
    botId: row.bot_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

function parseEmbedding(value: ChunkRow["embedding"]): number[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function mapChunk(row: ChunkRow): Chunk {
  return {
    id: row.id,
    botId: row.bot_id,
    documentId: row.document_id,
    text: row.content,
    embedding: parseEmbedding(row.embedding),
  };
}

function mapUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    plan: row.plan,
    createdAt: row.created_at,
  };
}

export async function listBotsForUser(userId: string): Promise<Bot[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("bots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BotRow[]).map(mapBot);
}

export async function countBotsForUser(userId: string): Promise<number> {
  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("bots")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function createBot(input: {
  userId: string;
  name: string;
  welcomeMessage: string;
  systemPrompt: string;
  primaryColor: string;
}): Promise<Bot> {
  const admin = createSupabaseAdmin();
  const row = {
    id: nanoid(),
    user_id: input.userId,
    name: input.name,
    public_key: nanoid(16),
    system_prompt: input.systemPrompt,
    welcome_message: input.welcomeMessage,
    primary_color: input.primaryColor,
  };
  const { data, error } = await admin.from("bots").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return mapBot(data as BotRow);
}

export async function getBotForUser(
  botId: string,
  userId: string,
): Promise<Bot | null> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("bots")
    .select("*")
    .eq("id", botId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapBot(data as BotRow) : null;
}

export async function getBotById(botId: string): Promise<Bot | null> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("bots")
    .select("*")
    .eq("id", botId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapBot(data as BotRow) : null;
}

export async function updateBotForUser(
  botId: string,
  userId: string,
  patch: Partial<{
    name: string;
    welcomeMessage: string;
    systemPrompt: string;
    primaryColor: string;
  }>,
): Promise<Bot | null> {
  const admin = createSupabaseAdmin();
  const payload: Record<string, string> = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.welcomeMessage !== undefined)
    payload.welcome_message = patch.welcomeMessage;
  if (patch.systemPrompt !== undefined)
    payload.system_prompt = patch.systemPrompt;
  if (patch.primaryColor !== undefined)
    payload.primary_color = patch.primaryColor;

  const { data, error } = await admin
    .from("bots")
    .update(payload)
    .eq("id", botId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapBot(data as BotRow) : null;
}

export async function deleteBotForUser(botId: string, userId: string) {
  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("bots")
    .delete()
    .eq("id", botId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function listDocuments(botId: string): Promise<Document[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("documents")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DocRow[]).map(mapDoc);
}

export async function countDocuments(botId: string): Promise<number> {
  const admin = createSupabaseAdmin();
  const { count, error } = await admin
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("bot_id", botId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function createDocumentWithChunks(input: {
  botId: string;
  title: string;
  content: string;
  buildChunks: (documentId: string) => Promise<Chunk[]>;
}): Promise<{ document: Document; chunkCount: number }> {
  const admin = createSupabaseAdmin();
  const documentId = nanoid();
  const doc = {
    id: documentId,
    bot_id: input.botId,
    title: input.title,
    content: input.content,
  };

  const { data, error } = await admin
    .from("documents")
    .insert(doc)
    .select("*")
    .single();
  if (error) throw new Error(error.message);

  const chunks = await input.buildChunks(documentId);
  if (chunks.length) {
    const rows = chunks.map((c) => ({
      id: c.id,
      bot_id: input.botId,
      document_id: documentId,
      content: c.text,
      embedding: c.embedding ?? null,
    }));
    const { error: chunkError } = await admin.from("chunks").insert(rows);
    if (chunkError) {
      await admin.from("documents").delete().eq("id", documentId);
      throw new Error(chunkError.message);
    }
  }

  return { document: mapDoc(data as DocRow), chunkCount: chunks.length };
}

export async function deleteDocumentForUser(
  botId: string,
  docId: string,
  userId: string,
): Promise<boolean> {
  const bot = await getBotForUser(botId, userId);
  if (!bot) return false;
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("documents")
    .delete()
    .eq("id", docId)
    .eq("bot_id", botId)
    .select("id");
  if (error) throw new Error(error.message);
  return (data?.length ?? 0) > 0;
}

export async function getProfileById(userId: string): Promise<User | null> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("id,email,name,plan,created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUser(data as ProfileRow) : null;
}

export async function matchChunksByEmbedding(input: {
  botId: string;
  embedding: number[];
  matchCount?: number;
}): Promise<Chunk[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin.rpc("match_chunks", {
    query_embedding: input.embedding,
    match_bot_id: input.botId,
    match_count: input.matchCount ?? 4,
  });
  if (error) throw new Error(error.message);
  return ((data as ChunkRow[]) || []).map((row) => ({
    id: row.id,
    botId: row.bot_id,
    documentId: row.document_id,
    text: row.content,
  }));
}

export async function listChunksForBot(botId: string): Promise<Chunk[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("chunks")
    .select("id,bot_id,document_id,content,embedding")
    .eq("bot_id", botId);
  if (error) throw new Error(error.message);
  return ((data as ChunkRow[]) || []).map(mapChunk);
}
