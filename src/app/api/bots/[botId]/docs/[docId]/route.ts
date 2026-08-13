import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteDocumentForUser, getDocumentForUser } from "@/lib/db";

type Ctx = { params: Promise<{ botId: string; docId: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId, docId } = await ctx.params;

  const document = await getDocumentForUser(botId, docId, user.id);
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ document });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId, docId } = await ctx.params;

  const ok = await deleteDocumentForUser(botId, docId, user.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
