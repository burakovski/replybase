import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  defaultNoAnswerMessage,
  defaultSystemPrompt,
  defaultWelcomeMessage,
} from "@/lib/bot-defaults";
import { countBotsForUser, createBot, listBotsForUser } from "@/lib/db";
import { resolveReplyLocale } from "@/lib/no-answer";
import { planLimits } from "@/lib/plans";

const createSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bot name must be at least 2 characters")
    .max(80, "Bot name is too long"),
  welcomeMessage: z.string().max(280).optional(),
  systemPrompt: z.string().max(1000).optional(),
  noAnswerMessage: z.string().max(280).optional(),
  locale: z.enum(["en", "ru"]).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bots = await listBotsForUser(user.id);
  return NextResponse.json({ bots });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = createSchema.parse(await req.json());
    const count = await countBotsForUser(user.id);
    const limits = planLimits(user.plan);
    if (count >= limits.bots) {
      return NextResponse.json(
        {
          error: `Plan ${limits.name} allows ${limits.bots} chatbot(s). Upgrade to create more.`,
        },
        { status: 402 },
      );
    }

    const locale = resolveReplyLocale(body.locale);
    const bot = await createBot({
      userId: user.id,
      name: body.name,
      systemPrompt: body.systemPrompt || defaultSystemPrompt(locale),
      welcomeMessage: body.welcomeMessage || defaultWelcomeMessage(locale),
      noAnswerMessage: body.noAnswerMessage || defaultNoAnswerMessage(locale),
      primaryColor: body.primaryColor || "#0F766E",
    });

    return NextResponse.json({ bot });
  } catch (e) {
    if (e instanceof z.ZodError) {
      const first = e.issues[0];
      return NextResponse.json(
        { error: first?.message || "Invalid bot name" },
        { status: 400 },
      );
    }
    const message = e instanceof Error ? e.message : "Could not create bot";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
