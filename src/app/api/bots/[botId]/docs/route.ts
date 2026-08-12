import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  countDocuments,
  createDocumentWithChunks,
  getBotForUser,
} from "@/lib/db";
import { planLimits } from "@/lib/plans";
import { buildChunks } from "@/lib/rag";

type Ctx = { params: Promise<{ botId: string }> };

const schema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(20).max(80_000),
});

export async function POST(req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId } = await ctx.params;

  try {
    const body = schema.parse(await req.json());
    const bot = await getBotForUser(botId, user.id);
    if (!bot) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const docsCount = await countDocuments(botId);
    const limits = planLimits(user.plan);
    if (docsCount >= limits.docs) {
      return NextResponse.json(
        {
          error: `Plan ${limits.name} allows ${limits.docs} documents. Upgrade for more.`,
        },
        { status: 402 },
      );
    }

    const { document, chunkCount } = await createDocumentWithChunks({
      botId,
      title: body.title,
      content: body.content,
      buildChunks: (documentId) =>
        buildChunks({
          botId,
          documentId,
          content: body.content,
        }),
    });

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        createdAt: document.createdAt,
        chunks: chunkCount,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
