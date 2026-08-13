"use client";

import type { ReactNode } from "react";
import { FaviconSync } from "@/components/favicon-sync";
import { LocaleProvider } from "@/components/locale-provider";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <FaviconSync />
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
