export type ReplyLocale = "en" | "ru";

export const NO_ANSWER_SENTINEL = "__NO_ANSWER__";

export const NO_ANSWER_MESSAGE: Record<ReplyLocale, string> = {
  en: "I can't answer that right now. Please rephrase your question or contact an operator.",
  ru: "На этот ответ я не смогу вам сейчас ответить. Переформулируйте ваш вопрос или свяжитесь с оператором.",
};

export const CONTACT_OPERATOR_LABEL: Record<ReplyLocale, string> = {
  en: "Contact operator",
  ru: "Связаться с оператором",
};

export function resolveReplyLocale(
  input?: string | null,
): ReplyLocale {
  const v = (input || "").toLowerCase();
  if (v.startsWith("ru")) return "ru";
  if (v.startsWith("en")) return "en";
  return "ru";
}
