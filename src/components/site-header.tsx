"use client";

import Link from "next/link";
import { HeaderControls } from "@/components/header-controls";
import { useLocale } from "@/components/locale-provider";

type SiteHeaderProps = {
  signedIn?: boolean;
  variant?: "marketing" | "auth";
};

export function SiteHeader({
  signedIn = false,
  variant = "marketing",
}: SiteHeaderProps) {
  const { t } = useLocale();

  return (
    <header className="site-header mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
      <Link href="/" className="display text-xl font-bold tracking-tight">
        Replybase
      </Link>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {variant === "marketing" ? (
          <nav className="flex items-center gap-3">
            <a href="#features" className="text-muted hover:text-ink">
              {t.nav.features}
            </a>
            <a href="#pricing" className="text-muted hover:text-ink">
              {t.nav.pricing}
            </a>
          </nav>
        ) : null}
        <HeaderControls />
        {variant === "marketing" ? (
          signedIn ? (
            <Link href="/app" className="btn btn-primary text-sm">
              {t.nav.openApp}
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost text-sm">
                {t.nav.logIn}
              </Link>
              <Link href="/signup" className="btn btn-primary text-sm">
                {t.nav.startFree}
              </Link>
            </>
          )
        ) : null}
      </div>
    </header>
  );
}
