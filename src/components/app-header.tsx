"use client";

import { HeaderControls } from "@/components/header-controls";
import { SiteLogo } from "@/components/site-logo";
import { UserMenu } from "@/components/user-menu";
import { useLocale } from "@/components/locale-provider";
import type { PlanId } from "@/lib/types";

type AppHeaderProps = {
  email: string;
  planId: PlanId;
};

export function AppHeader({ email, planId }: AppHeaderProps) {
  const { t } = useLocale();

  return (
    <header className="site-header sticky top-0 z-40 border-b border-line/80 bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <SiteLogo />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            <HeaderControls />
          </div>
          <span className="rounded-full bg-foam px-3 py-1 font-medium text-moss-deep">
            {t.plans[planId].name}
          </span>
          <UserMenu email={email} />
        </div>
      </div>
    </header>
  );
}
