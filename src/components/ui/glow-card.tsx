"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });

  return (
    <article
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-line bg-[var(--panel)] p-6",
        className,
      )}
      style={{
        backgroundImage: pos.active
          ? `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--moss) 14%, transparent), transparent 55%)`
          : undefined,
      }}
    >
      {children}
    </article>
  );
}
