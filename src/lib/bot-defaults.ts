import type { ReplyLocale } from "@/lib/no-answer";

/** Classic support tone — prefilled in Instructions. */
export const DEFAULT_SYSTEM_PROMPT: Record<ReplyLocale, string> = {
  en: "Be polite, concise, and practical. Answer only from the documents. Professional tone — no fluff, no invented facts.",
  ru: "Отвечай вежливо, коротко и по делу. Только факты из документов. На «вы», без домыслов.",
};

/** Default “no match” reply — prefilled in Instructions. */
export const DEFAULT_NO_ANSWER_MESSAGE: Record<ReplyLocale, string> = {
  en: "I don't have that information.",
  ru: "Такой информации у меня нет",
};

export const DEFAULT_WELCOME_MESSAGE: Record<ReplyLocale, string> = {
  en: "Hi! Ask me anything about the product — I’ll answer from our docs.",
  ru: "Здравствуйте! Спросите о продукте — отвечу по нашим документам.",
};

export function defaultSystemPrompt(locale: ReplyLocale = "en") {
  return DEFAULT_SYSTEM_PROMPT[locale];
}

export function defaultNoAnswerMessage(locale: ReplyLocale = "en") {
  return DEFAULT_NO_ANSWER_MESSAGE[locale];
}

export function defaultWelcomeMessage(locale: ReplyLocale = "en") {
  return DEFAULT_WELCOME_MESSAGE[locale];
}
