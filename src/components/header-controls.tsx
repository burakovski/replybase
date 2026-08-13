"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";

const controlBtn =
  "btn btn-ghost text-sm inline-flex h-[2.875rem] min-h-[2.875rem] items-center justify-center px-3 leading-none";

export function HeaderControls() {
  const { locale, toggleLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        type="button"
        className={`${controlBtn} min-w-11`}
        onClick={toggleLocale}
        aria-label={t.lang.toggle}
        title={t.lang.toggle}
      >
        {locale === "en" ? t.lang.en : t.lang.ru}
      </button>
      <button
        type="button"
        className={controlBtn}
        onClick={toggleTheme}
        aria-label={t.theme.toggle}
        title={t.theme.toggle}
      >
        {theme === "dark" ? (
          <Sun className="size-4 shrink-0" aria-hidden />
        ) : (
          <Moon className="size-4 shrink-0" aria-hidden />
        )}
      </button>
    </>
  );
}
