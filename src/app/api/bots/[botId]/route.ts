import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  deleteBotForUser,
  getBotForUser,
  listDocuments,
  updateBotForUser,
} from "@/lib/db";
import { canEmbed } from "@/lib/plans";

type Ctx = { params: Promise<{ botId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId } = await ctx.params;
  const bot = await getBotForUser(botId, user.id);
  if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const documents = await listDocuments(bot.id);
  return NextResponse.json({
    bot,
    documents,
    embedAllowed: canEmbed(user.plan),
  });
}

const patchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  welcomeMessage: z.string().max(280).optional(),
  systemPrompt: z.string().max(1000).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId } = await ctx.params;
  try {
    const body = patchSchema.parse(await req.json());
    const bot = await updateBotForUser(botId, user.id, body);
    if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ bot });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId } = await ctx.params;
  const bot = await getBotForUser(botId, user.id);
  if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteBotForUser(botId, user.id);
  return NextResponse.json({ ok: true });
}
