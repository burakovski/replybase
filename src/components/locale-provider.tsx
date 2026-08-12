"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  dictionaries,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

let localeMemory: Locale = "en";
const localeListeners = new Set<() => void>();

function applyLocaleDom(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-locale", locale);
}

function readStoredLocale(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : "en";
}

function subscribeLocale(onStoreChange: () => void) {
  localeListeners.add(onStoreChange);
  return () => {
    localeListeners.delete(onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return localeMemory;
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

function commitLocale(next: Locale) {
  localeMemory = next;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  applyLocaleDom(next);
  localeListeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  localeMemory = readStoredLocale();
  applyLocaleDom(localeMemory);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  // Keep a React state mirror so consumers re-render after same-tab commits.
  const [, bump] = useState(0);

  useEffect(() => subscribeLocale(() => bump((n) => n + 1)), []);

  const setLocale = useCallback((next: Locale) => {
    commitLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    commitLocale(localeMemory === "en" ? "ru" : "en");
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: dictionaries[locale],
    }),
    [locale, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
