"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { HeaderControls } from "@/components/header-controls";
import { SiteLogo } from "@/components/site-logo";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  signedIn?: boolean;
  variant?: "marketing" | "auth";
};

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrolledSnapshot() {
  return window.scrollY > 10;
}

function getScrolledServerSnapshot() {
  return false;
}

export function SiteHeader({
  signedIn = false,
  variant = "marketing",
}: SiteHeaderProps) {
  const { t } = useLocale();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    getScrolledSnapshot,
    getScrolledServerSnapshot,
  );

  return (
    <header
      className={cn(
        // Fixed vertical size — padding changes shift the hero and break RoughNotation SVGs
        "site-header sticky top-0 z-50 w-full shrink-0 py-3.5 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300",
        scrolled
          ? "border-b border-line/50 bg-[color-mix(in_srgb,var(--paper)_72%,transparent)] shadow-[0_1px_0_color-mix(in_srgb,var(--ink)_4%,transparent)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5">
        <SiteLogo
          priority
          className={cn(
            "transition-opacity duration-300",
            scrolled ? "opacity-95" : "opacity-100",
          )}
        />
        <div className="flex flex-wrap items-center gap-5 text-sm">
          {variant === "marketing" ? (
            <nav className="flex items-center gap-5">
              <a href="#product" className="nav-link text-muted">
                {t.nav.product}
              </a>
              <a href="#pricing" className="nav-link text-muted">
                {t.nav.pricing}
              </a>
              <a href="#faq" className="nav-link text-muted">
                {t.nav.faq}
              </a>
            </nav>
          ) : null}
          <div className="flex flex-wrap items-center gap-1.5">
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
        </div>
      </div>
    </header>
  );
}
