import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";

const TEXT_EXT =
  /\.(txt|md|markdown|csv|json|log|tsv|html|htm|xml)$/i;

export function isSupportedDocFilename(name: string) {
  return /\.(txt|md|markdown|csv|json|log|tsv|pdf|docx)$/i.test(name);
}

export function titleFromFilename(filename: string) {
  return (
    filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || filename
  );
}

export function fileExtFromFilename(filename: string) {
  const match = filename.match(/\.([a-z0-9]+)$/i);
  if (!match) return "";
  const ext = match[1].toLowerCase();
  return ext === "markdown" ? "md" : ext;
}

function looksLikePdf(buffer: Buffer, filename: string, mimeType?: string) {
  if (filename.toLowerCase().endsWith(".pdf")) return true;
  if (mimeType === "application/pdf") return true;
  return buffer.subarray(0, 5).toString("utf8") === "%PDF-";
}

function looksLikeDocx(filename: string, mimeType?: string) {
  if (filename.toLowerCase().endsWith(".docx")) return true;
  return (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

async function extractPdfText(buffer: Buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: true });
  const text = Array.isArray(result.text)
    ? result.text.join("\n")
    : result.text || "";
  return text.replace(/\u0000/g, "").trim();
}

async function extractDocxText(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || "").replace(/\u0000/g, "").trim();
}

export async function extractDocumentText(input: {
  buffer: Buffer;
  filename: string;
  mimeType?: string;
}): Promise<string> {
  const { buffer, filename, mimeType } = input;

  if (looksLikePdf(buffer, filename, mimeType)) {
    const text = await extractPdfText(buffer);
    if (!text) {
      throw new Error(
        "No extractable text in this PDF (it may be scanned images only).",
      );
    }
    return text;
  }

  if (looksLikeDocx(filename, mimeType)) {
    const text = await extractDocxText(buffer);
    if (!text) {
      throw new Error("No extractable text in this Word document.");
    }
    return text;
  }

  if (
    TEXT_EXT.test(filename) ||
    !mimeType ||
    mimeType.startsWith("text/") ||
    mimeType === "application/json"
  ) {
    return buffer.toString("utf8").replace(/\u0000/g, "").trim();
  }

  throw new Error("Unsupported file type. Use txt, md, csv, json, pdf, or docx.");
}
