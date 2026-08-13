import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import {
  countDocuments,
  createDocumentWithChunks,
  getBotForUser,
} from "@/lib/db";
import {
  extractDocumentText,
  fileExtFromFilename,
  isSupportedDocFilename,
  titleFromFilename,
} from "@/lib/extract-document";
import { planLimits } from "@/lib/plans";
import { buildChunks } from "@/lib/rag";

type Ctx = { params: Promise<{ botId: string }> };

const MAX_BYTES = 4 * 1024 * 1024; // Vercel request body ~4.5MB

const jsonSchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(20).max(80_000),
});

async function parseUpload(req: Request): Promise<{
  title: string;
  content: string;
  fileExt: string;
}> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      throw new Error("Missing file");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("File is too large (max 4 MB).");
    }
    if (!isSupportedDocFilename(file.name)) {
      throw new Error(
        "Unsupported file type. Use txt, md, csv, json, pdf, or docx.",
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extracted = await extractDocumentText({
      buffer,
      filename: file.name,
      mimeType: file.type,
    });
    if (extracted.length < 20) {
      throw new Error("Extracted text is too short (need at least 20 characters).");
    }
    if (extracted.length > 80_000) {
      throw new Error("Document text is too long (max 80,000 characters).");
    }

    const titleField = String(form.get("title") || "").trim();
    const title = (titleField || titleFromFilename(file.name)).slice(0, 120);
    return {
      title,
      content: extracted,
      fileExt: fileExtFromFilename(file.name),
    };
  }

  const body = jsonSchema.parse(await req.json());
  return { ...body, fileExt: "" };
}

export async function POST(req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { botId } = await ctx.params;

  try {
    const { title, content, fileExt } = await parseUpload(req);
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
      title,
      content,
      fileExt,
      buildChunks: (documentId) =>
        buildChunks({
          botId,
          documentId,
          title,
          content,
        }),
    });

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        fileExt: document.fileExt,
        createdAt: document.createdAt,
        chunks: chunkCount,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message || "Invalid document" },
        { status: 400 },
      );
    }
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
