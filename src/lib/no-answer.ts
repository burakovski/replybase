export type ReplyLocale = "en" | "ru";

export const NO_ANSWER_SENTINEL = "__NO_ANSWER__";

export const NO_ANSWER_MESSAGE: Record<ReplyLocale, string> = {
  en: "I don't have that information.",
  ru: "Такой информации у меня нет",
};

export const CONTACT_OPERATOR_LABEL: Record<ReplyLocale, string> = {
  en: "Contact operator",
  ru: "Связаться с оператором",
};

export function resolveNoAnswerMessage(
  locale: ReplyLocale,
  custom?: string | null,
): string {
  const trimmed = custom?.trim();
  return trimmed || NO_ANSWER_MESSAGE[locale];
}

export function resolveReplyLocale(
  input?: string | null,
): ReplyLocale {
  const v = (input || "").toLowerCase();
  if (v.startsWith("ru")) return "ru";
  if (v.startsWith("en")) return "en";
  return "ru";
}

/** Prefer the language of the user's message over UI/Accept-Language. */
export function detectMessageLocale(text: string): ReplyLocale | null {
  const cyr = (text.match(/[а-яё]/gi) || []).length;
  const lat = (text.match(/[a-z]/gi) || []).length;
  if (cyr === 0 && lat === 0) return null;
  // Strong Cyrillic signal → Russian; otherwise English
  if (cyr > 0 && cyr >= lat * 0.35) return "ru";
  if (lat > 0) return "en";
  return cyr > 0 ? "ru" : null;
}

export function resolveAnswerLocale(input: {
  message: string;
  preferred?: string | null;
}): ReplyLocale {
  return (
    detectMessageLocale(input.message) ||
    resolveReplyLocale(input.preferred) ||
    "ru"
  );
}

