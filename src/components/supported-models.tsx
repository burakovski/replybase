"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import Image from "next/image";
import { animate, motion } from "motion/react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

const MODELS = [
  {
    id: "claude",
    name: "Claude",
    src: "/models/claude.svg",
    circle: "circle-1 h-8 w-8",
    icon: 16,
  },
  {
    id: "gemini",
    name: "Gemini",
    src: "/models/gemini.svg",
    circle: "circle-2 h-12 w-12",
    icon: 24,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    src: "/models/chatgpt.svg",
    circle: "circle-3",
    icon: 32,
  },
  {
    id: "grok",
    name: "Grok",
    src: "/models/grok.svg",
    circle: "circle-4 h-12 w-12",
    icon: 24,
  },
  {
    id: "mistral",
    name: "Mistral",
    src: "/models/mistral.svg",
    circle: "circle-5 h-8 w-8",
    icon: 16,
  },
] as const;

const SKELETON_SCALE = [1, 1.1, 1];
const SKELETON_TRANSFORM = [
  "translateY(0px)",
  "translateY(-4px)",
  "translateY(0px)",
];
const SKELETON_SEQUENCE = [
  [".circle-1", { scale: SKELETON_SCALE, transform: SKELETON_TRANSFORM }, { duration: 0.8 }],
  [".circle-2", { scale: SKELETON_SCALE, transform: SKELETON_TRANSFORM }, { duration: 0.8 }],
  [".circle-3", { scale: SKELETON_SCALE, transform: SKELETON_TRANSFORM }, { duration: 0.8 }],
  [".circle-4", { scale: SKELETON_SCALE, transform: SKELETON_TRANSFORM }, { duration: 0.8 }],
  [".circle-5", { scale: SKELETON_SCALE, transform: SKELETON_TRANSFORM }, { duration: 0.8 }],
] as const;

function ModelIconsStage() {
  useEffect(() => {
    animate(SKELETON_SEQUENCE, {
      repeat: Infinity,
      repeatDelay: 1,
    } as Parameters<typeof animate>[1]);
  }, []);

  return (
    <div className="relative flex h-[220px] items-center justify-center overflow-hidden sm:h-[260px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--foam)_90%,transparent)_0%,transparent_68%)]"
      />

      <div className="relative z-10 flex shrink-0 flex-row items-center justify-center gap-2">
        {MODELS.map((m) => (
          <Container key={m.id} className={m.circle}>
            <Image
              src={m.src}
              alt={m.name}
              width={m.icon}
              height={m.icon}
              className="shrink-0 object-contain"
              aria-hidden
            />
          </Container>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-40 h-44 -translate-y-1/2 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--accent)_85%,#67e8f9)] to-transparent"
          style={{ x: "-100%" }}
          animate={{ left: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          {/* Trail cloud behind the beam — full leash height */}
          <div className="absolute top-0 -left-20 h-full w-20">
            <Sparkles />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const SPARKLE_SEEDS = [
  { top: 8, left: 22, dx: -10, dy: 2, duration: 1.6, delay: 0 },
  { top: 18, left: 58, dx: -14, dy: -3, duration: 1.9, delay: 0.15 },
  { top: 28, left: 12, dx: -8, dy: 4, duration: 1.4, delay: 0.3 },
  { top: 36, left: 70, dx: -16, dy: -2, duration: 2.0, delay: 0.08 },
  { top: 44, left: 34, dx: -11, dy: 3, duration: 1.7, delay: 0.42 },
  { top: 52, left: 82, dx: -18, dy: -4, duration: 1.5, delay: 0.22 },
  { top: 60, left: 18, dx: -9, dy: 2, duration: 1.8, delay: 0.55 },
  { top: 68, left: 48, dx: -13, dy: -3, duration: 1.6, delay: 0.12 },
  { top: 76, left: 66, dx: -15, dy: 4, duration: 1.9, delay: 0.35 },
  { top: 84, left: 28, dx: -10, dy: -2, duration: 1.5, delay: 0.48 },
  { top: 92, left: 54, dx: -12, dy: 3, duration: 1.7, delay: 0.05 },
  { top: 14, left: 40, dx: -17, dy: -1, duration: 2.1, delay: 0.28 },
  { top: 40, left: 8, dx: -7, dy: 5, duration: 1.3, delay: 0.6 },
  { top: 72, left: 90, dx: -19, dy: -5, duration: 1.8, delay: 0.18 },
  { top: 24, left: 76, dx: -14, dy: 2, duration: 1.6, delay: 0.4 },
  { top: 56, left: 44, dx: -11, dy: -3, duration: 1.9, delay: 0.5 },
] as const;

function Sparkles() {
  const stars = useMemo(() => SPARKLE_SEEDS, []);

  return (
    <div className="relative h-full w-full">
      {stars.map((star, i) => (
        <motion.span
          key={`star-${i}`}
          className="absolute size-[2px] rounded-full bg-ink"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
          }}
          animate={{
            // Don't animate CSS top/left — motion collapses % to the top of the leash
            x: [0, star.dx],
            y: [0, star.dy],
            opacity: [0, 0.9, 0],
            scale: [0.5, 1.25, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_rgba(7,23,20,0.10),0_2px_6px_rgba(7,23,20,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SupportedModels() {
  const { t } = useLocale();
  const L = t.landing;

  return (
    <section id="models" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
      <div className="rounded-[2rem] bg-foam/55 px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              {L.modelsEyebrow}
            </p>
            <h2 className="display mt-4 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              {L.modelsTitle}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {L.modelsBody}
            </p>
            <p className="mt-3 max-w-md text-sm text-muted">{L.modelsFootnote}</p>
          </div>

          <div className="min-w-0">
            <ModelIconsStage />
          </div>
        </div>
      </div>
    </section>
  );
}
