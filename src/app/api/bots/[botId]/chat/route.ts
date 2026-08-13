import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { corsOptions, withCors } from "@/lib/cors";
import { getBotById, getProfileById } from "@/lib/db";
import { canEmbed } from "@/lib/plans";
import { resolveAnswerLocale } from "@/lib/no-answer";
import { answerWithContext, retrieveChunksForBot } from "@/lib/rag";

type Ctx = { params: Promise<{ botId: string }> };

const schema = z.object({
  message: z.string().min(1).max(2000),
  publicKey: z.string().optional(),
  locale: z.enum(["en", "ru"]).optional(),
});

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { botId } = await ctx.params;
    const body = schema.parse(await req.json());
    const bot = await getBotById(botId);
    if (!bot) {
      return withCors(
        NextResponse.json({ error: "Bot not found" }, { status: 404 }),
      );
    }

    const owner = await getProfileById(bot.userId);
    if (!owner) {
      return withCors(
        NextResponse.json({ error: "Owner missing" }, { status: 500 }),
      );
    }

    const user = await getCurrentUser();
    const isOwner = user?.id === bot.userId;
    const isWidget =
      !!body.publicKey && body.publicKey === bot.publicKey && !isOwner;

    if (!isOwner && !isWidget) {
      return withCors(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    if (isWidget && !canEmbed(owner.plan)) {
      return withCors(
        NextResponse.json(
          {
            error:
              "Embed widget is gated. Upgrade to Starter or Growth to enable embedding.",
          },
          { status: 402 },
        ),
      );
    }

    // Language follows the message text; UI/Accept-Language only as fallback
    const locale = resolveAnswerLocale({
      message: body.message,
      preferred: body.locale || req.headers.get("accept-language"),
    });
    const retrieved = await retrieveChunksForBot(bot.id, body.message, 4);
    const result = await answerWithContext({
      question: body.message,
      contextChunks: retrieved,
      systemPrompt: bot.systemPrompt,
      botName: bot.name,
      locale,
      // Prefer owner-configured fallback when set
      noAnswerMessage: bot.noAnswerMessage?.trim() || undefined,
    });

    return withCors(
      NextResponse.json({
        answer: result.answer,
        mode: result.mode,
        unanswered: result.unanswered,
        sources: result.unanswered
          ? []
          : retrieved.map((c) => ({
              documentId: c.documentId,
              excerpt: c.text.slice(0, 160),
            })),
      }),
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Chat failed";
    return withCors(NextResponse.json({ error: message }, { status: 400 }));
  }
}
