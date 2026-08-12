import { NextResponse } from "next/server";
import { corsOptions, withCors } from "@/lib/cors";
import { getBotById, getProfileById } from "@/lib/db";
import { canEmbed } from "@/lib/plans";

type Ctx = { params: Promise<{ botId: string }> };

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: Request, ctx: Ctx) {
  const { botId } = await ctx.params;
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const bot = await getBotById(botId);
  if (!bot || !key || key !== bot.publicKey) {
    return withCors(
      NextResponse.json({ error: "Not found" }, { status: 404 }),
    );
  }
  const owner = await getProfileById(bot.userId);
  if (!owner || !canEmbed(owner.plan)) {
    return withCors(
      NextResponse.json(
        { error: "Widget disabled for this plan" },
        { status: 402 },
      ),
    );
  }

  return withCors(
    NextResponse.json({
      bot: {
        id: bot.id,
        name: bot.name,
        welcomeMessage: bot.welcomeMessage,
        primaryColor: bot.primaryColor,
      },
    }),
  );
}
