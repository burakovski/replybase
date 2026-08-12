"use client";

import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";

export function HeaderControls() {
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="header-switch"
        role="group"
        aria-label={t.lang.toggle}
      >
        <button
          type="button"
          className={locale === "en" ? "is-active" : undefined}
          onClick={() => setLocale("en")}
          aria-pressed={locale === "en"}
        >
          {t.lang.en}
        </button>
        <button
          type="button"
          className={locale === "ru" ? "is-active" : undefined}
          onClick={() => setLocale("ru")}
          aria-pressed={locale === "ru"}
        >
          {t.lang.ru}
        </button>
      </div>
      <div
        className="header-switch"
        role="group"
        aria-label={t.theme.toggle}
      >
        <button
          type="button"
          className={theme === "light" ? "is-active" : undefined}
          onClick={() => setTheme("light")}
          aria-pressed={theme === "light"}
        >
          {t.theme.light}
        </button>
        <button
          type="button"
          className={theme === "dark" ? "is-active" : undefined}
          onClick={() => setTheme("dark")}
          aria-pressed={theme === "dark"}
        >
          {t.theme.dark}
        </button>
      </div>
    </div>
  );
}
