"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TICK_COUNT = 56;

/**
 * Tick ruler at the bottom of a section (from portfolio case studies).
 * Start: `[data-case-tick-start]` fully in view.
 * End: `[data-case-tick-end]` clipped by viewport top (top ≤ 0).
 */
export function CaseTickRuler({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const unlockedRef = useRef(false);
  const endTopAtUnlockRef = useRef(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const update = () => {
      const section = el.closest("section");
      const vh = window.innerHeight;

      const startEl =
        (section?.querySelector(
          "[data-case-tick-start]",
        ) as HTMLElement | null) ?? null;
      const endEl =
        (section?.querySelector(
          "[data-case-tick-end]",
        ) as HTMLElement | null) ?? null;

      const startRect = startEl?.getBoundingClientRect();
      const endTop = endEl?.getBoundingClientRect().top ?? 0;

      const startFullyVisible = !!(
        startRect &&
        startRect.top >= 0 &&
        startRect.bottom <= vh + 0.5
      );

      if (!unlockedRef.current) {
        if (startFullyVisible) {
          unlockedRef.current = true;
          endTopAtUnlockRef.current = Math.max(endTop, 1);
        } else {
          setProgress(0);
          return;
        }
      }

      if (!endEl) {
        setProgress(0);
        return;
      }

      if (endTop <= 0) {
        setProgress(1);
        return;
      }

      const span = endTopAtUnlockRef.current;
      const raw = (span - endTop) / span;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const activeIndex = useMemo(() => {
    const clamped = Math.min(1, Math.max(0, progress));
    return Math.min(TICK_COUNT - 1, Math.round(clamped * (TICK_COUNT - 1)));
  }, [progress]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none relative h-10 w-full shrink-0 select-none",
        className,
      )}
      aria-hidden
    >
      <div className="relative h-full w-full">
        {Array.from({ length: TICK_COUNT }, (_, i) => {
          const isActive = i === activeIndex;
          const isFirst = i === 0;
          const isLast = i === TICK_COUNT - 1;
          const leftPct = (i / (TICK_COUNT - 1)) * 100;

          return (
            <div
              key={i}
              className="absolute bottom-0 h-10 w-px"
              style={{
                left: `${leftPct}%`,
                transform: isFirst
                  ? "none"
                  : isLast
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
              }}
            >
              {isActive ? (
                <span
                  className="absolute bottom-full left-1/2 size-0 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[6px] border-t-moss"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-10 w-px transition-colors duration-150",
                  isActive ? "bg-moss" : "bg-ink/20",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
