"use client";

import Link from "next/link";
import { HeaderControls } from "@/components/header-controls";
import { useLocale } from "@/components/locale-provider";
import { LogoutButton } from "@/components/logout-button";
import type { PlanId } from "@/lib/types";

type AppHeaderProps = {
  email: string;
  planId: PlanId;
};

export function AppHeader({ email, planId }: AppHeaderProps) {
  const { t } = useLocale();

  return (
    <header className="site-header border-b border-line/80 bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="display text-lg font-bold">
            Replybase
          </Link>
          <nav className="flex gap-4 text-sm text-muted">
            <Link href="/app" className="hover:text-ink">
              {t.nav.bots}
            </Link>
            <Link href="/app/billing" className="hover:text-ink">
              {t.nav.billing}
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <HeaderControls />
          <span className="rounded-full bg-foam px-3 py-1 font-medium text-moss-deep">
            {t.plans[planId].name}
          </span>
          <span className="hidden text-muted sm:inline">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
