"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Bot, LogOut, Sparkles } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] || "?";
  const parts = local.split(/[._\-\s]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function displayNameFromEmail(email: string) {
  const local = email.split("@")[0] || email;
  return local
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

type UserMenuProps = {
  email: string;
};

export function UserMenu({ email }: UserMenuProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const initials = initialsFromEmail(email);
  const displayName = displayNameFromEmail(email);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function clearLeaveTimer() {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }

  function scheduleClose() {
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => setOpen(false), 160);
  }

  function openMenu() {
    clearLeaveTimer();
    updatePosition();
    setOpen(true);
  }

  async function logout() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition hover:bg-foam";

  const menu =
    mounted && open ? (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        className="fixed z-[9999] w-[280px]"
        style={{ top: coords.top, right: coords.right }}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div className="panel overflow-hidden rounded-3xl shadow-[0_18px_40px_rgba(7,23,20,0.12)]">
          <div className="flex items-center gap-3 px-3.5 py-3.5">
            <div className="relative shrink-0">
              <div className="inline-flex size-10 items-center justify-center rounded-full bg-moss text-sm font-semibold text-primary-fg">
                {initials}
              </div>
              <span
                className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[var(--panel)] bg-moss"
                aria-hidden
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {displayName}
              </p>
              <p className="text-xs text-muted">{t.nav.online}</p>
            </div>
          </div>

          <div className="h-px bg-line/80" />

          <div className="p-1.5">
            <Link
              href="/app/billing"
              role="menuitem"
              className={cn(itemClass, "font-medium")}
              onClick={() => setOpen(false)}
            >
              <Sparkles
                className="size-4 shrink-0 text-moss-deep"
                aria-hidden
              />
              {t.nav.upgradePlan}
            </Link>
            <Link
              href="/app"
              role="menuitem"
              className={itemClass}
              onClick={() => setOpen(false)}
            >
              <Bot className="size-4 shrink-0 text-muted" aria-hidden />
              {t.nav.myBots}
            </Link>
          </div>

          <div className="h-px bg-line/80" />

          <div className="p-1.5">
            <button
              type="button"
              role="menuitem"
              className={itemClass}
              onClick={() => void logout()}
            >
              <LogOut className="size-4 shrink-0 text-muted" aria-hidden />
              {t.nav.logOutAccount}
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full bg-moss text-sm font-semibold text-primary-fg",
          "ring-offset-2 ring-offset-[var(--paper)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        {initials}
      </button>
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
