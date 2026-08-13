"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HoverEffectItem = {
  title: string;
  description: string;
  link?: string;
  icon?: LucideIcon;
};

export function HoverEffect({
  items,
  className,
}: {
  items: HoverEffectItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, idx) => {
        const inner = (
          <>
            <AnimatePresence>
              {hoveredIndex === idx ? (
                <motion.span
                  className="absolute inset-0 block h-full w-full rounded-3xl bg-foam"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              ) : null}
            </AnimatePresence>
            <Card>
              {item.icon ? (
                <span className="mb-3 inline-flex size-10 items-center justify-center rounded-2xl bg-foam text-moss-deep">
                  <item.icon className="size-5" aria-hidden strokeWidth={1.75} />
                </span>
              ) : null}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </>
        );

        const sharedClass =
          "group relative block h-full w-full p-2";

        if (item.link) {
          return (
            <a
              key={item.title}
              href={item.link}
              className={sharedClass}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {inner}
            </a>
          );
        }

        return (
          <div
            key={item.title}
            className={sharedClass}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative z-20 h-full overflow-hidden rounded-3xl border border-line bg-[var(--panel)] p-5",
        "transition-colors group-hover:border-[color-mix(in_srgb,var(--moss)_35%,var(--line))]",
        className,
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn("display text-lg font-bold text-ink", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-2 text-sm leading-relaxed text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
