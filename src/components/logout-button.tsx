"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";

export function LogoutButton() {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <button
      className="btn btn-ghost px-3 py-1.5 text-sm"
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
    >
      {t.nav.logOut}
    </button>
  );
}
