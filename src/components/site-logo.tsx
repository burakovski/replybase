"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  /** Compact mark-only for tight spots */
  markOnly?: boolean;
  priority?: boolean;
};

export function SiteLogo({
  className,
  markOnly = false,
  priority = false,
}: SiteLogoProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const dark = theme === "dark";
  const onHome = pathname === "/";

  function onLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!onHome) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Link
      href="/"
      onClick={onLogoClick}
      className={cn("inline-flex items-center", className)}
      aria-label="Replybase — back to top"
    >
      {markOnly ? (
        <Image
          src={dark ? "/logo/fav-dt.png" : "/logo/fav-color.png"}
          alt="Replybase"
          width={32}
          height={34}
          className="h-8 w-auto"
          priority={priority}
        />
      ) : (
        <Image
          src={dark ? "/logo/logo-dt-color.svg" : "/logo/logo-lt-color.svg"}
          alt="Replybase"
          width={160}
          height={34}
          className="h-7 w-auto sm:h-8"
          priority={priority}
          unoptimized
        />
      )}
    </Link>
  );
}
