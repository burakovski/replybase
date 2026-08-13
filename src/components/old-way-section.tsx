"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";

function FakeWindow({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-[var(--panel)] shadow-[0_22px_60px_rgba(7,23,20,0.12)] dark:border-white/10 dark:bg-[#141414] dark:shadow-[0_22px_60px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3 dark:border-white/10">
        <span className="size-2.5 rounded-full bg-ink/15 dark:bg-white/20" />
        <span className="size-2.5 rounded-full bg-ink/15 dark:bg-white/20" />
        <span className="size-2.5 rounded-full bg-ink/15 dark:bg-white/20" />
        <span className="ml-2 truncate text-[11px] text-muted dark:text-white/40">
          {title}
        </span>
      </div>
      <div className="p-4 text-[13px] leading-snug text-muted dark:text-white/70 sm:text-[14px]">
        {children}
      </div>
    </div>
  );
}

export function OldWaySection() {
  const { t } = useLocale();
  const L = t.landing;
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Start slightly under viewport crop, then drift further out
  const leftX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [-36, -36, -36] : [-24, -48, -220],
  );
  const rightX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [36, 36, 36] : [24, 48, 220],
  );
  const sideOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.55, 1, 1, 0.35],
  );

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-paper text-ink dark:bg-[#070a09] dark:text-[#f3f6f5]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,99,84,0.10),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(26,99,84,0.18),transparent_60%)]"
      />

      {/*
        3-col grid: side | text | side
        gap-4 = 16px hard floor so cards never sit on the copy
      */}
      <div className="relative z-10 grid w-full items-center gap-4 py-24 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)_minmax(0,1fr)] xl:gap-6">
        {/* Left cluster — bleeds past viewport edge */}
        <motion.div
          aria-hidden
          style={{ x: leftX, opacity: sideOpacity }}
          className="pointer-events-none relative hidden h-[520px] w-full overflow-visible lg:block xl:h-[580px]"
        >
          <FakeWindow
            title="Generic AI chat"
            className="absolute top-4 left-[-18%] w-[96%] max-w-[360px] -rotate-6 xl:left-[-22%] xl:max-w-[400px]"
          >
            <p className="text-muted/70 dark:text-white/45">
              Q: How do we rotate API keys?
            </p>
            <p className="mt-2.5 text-ink dark:text-white/85">
              Sure — just email your password to support@example.com and wait
              3–5 days…
            </p>
            <p className="mt-2.5 text-[11px] text-accent">⚠ Hallucinated</p>
          </FakeWindow>
          <FakeWindow
            title="Open chatbot"
            className="absolute bottom-6 left-[-8%] w-[90%] max-w-[340px] rotate-[7deg] xl:max-w-[380px]"
          >
            <p className="text-muted/70 dark:text-white/45">
              Q: What’s in the Growth plan?
            </p>
            <p className="mt-2.5 text-ink dark:text-white/85">
              Unlimited everything forever. No docs needed.
            </p>
          </FakeWindow>
        </motion.div>

        {/* Center copy — reserved column keeps ≥16px from sides */}
        <div className="relative z-10 mx-auto w-full max-w-xl min-w-0 px-5 text-left">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent dark:text-[#e07a5f]">
            <span
              className="size-1.5 rounded-full bg-accent dark:bg-[#e07a5f]"
              aria-hidden
            />
            {L.problemEyebrow}
          </p>
          <h2 className="display mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl sm:leading-[1.15] dark:text-white">
            {L.problemSub}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base dark:text-white/50">
            {L.problemTitleLead}{" "}
            <span className="text-ink dark:text-white/90">
              {L.problemTitleHighlightA}
            </span>{" "}
            {L.problemTitleMid}{" "}
            <span className="text-ink dark:text-white/90">
              {L.problemTitleHighlightB}
            </span>
            {L.problemTitleTail}
          </p>
        </div>

        {/* Right cluster — bleeds past viewport edge */}
        <motion.div
          aria-hidden
          style={{ x: rightX, opacity: sideOpacity }}
          className="pointer-events-none relative hidden h-[520px] w-full overflow-visible lg:block xl:h-[580px]"
        >
          <div className="absolute top-6 right-[-18%] w-[96%] max-w-[360px] rotate-[8deg] rounded-2xl bg-[#f7f3ea] p-5 shadow-[0_18px_40px_rgba(7,23,20,0.12)] xl:right-[-22%] xl:max-w-[400px] dark:shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a6a4a]">
              Ticket #4821
            </p>
            <p className="mt-2.5 text-[15px] font-semibold text-[#1c1814]">
              Same FAQ again — “how do I embed?”
            </p>
            <p className="mt-2.5 text-[13px] leading-snug text-[#5c5248]">
              Assigned to support · waiting 14h
            </p>
          </div>
          <div className="absolute bottom-20 right-[-4%] w-[86%] max-w-[320px] -rotate-[6deg] rounded-xl bg-[#fff59d] p-4 shadow-[0_14px_36px_rgba(7,23,20,0.12)] xl:max-w-[360px] dark:shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
            <p className="text-[14px] font-semibold text-[#2a2418]">
              Update help center???
            </p>
            <p className="mt-1.5 text-[13px] text-[#5a4f3a]">
              Docs are stale — people keep asking.
            </p>
          </div>
          <div className="absolute right-[-12%] bottom-2 w-[84%] max-w-[310px] rotate-[3deg] rounded-2xl border border-line bg-[var(--panel)] p-4 shadow-[0_14px_36px_rgba(7,23,20,0.10)] xl:max-w-[350px] dark:border-white/10 dark:bg-[#1a1a1a] dark:shadow-none">
            <p className="text-[11px] text-muted dark:text-white/40">
              inbox · unread 128
            </p>
            <p className="mt-1.5 text-[14px] text-ink dark:text-white/80">
              “Is SSO supported?” × 23
            </p>
          </div>
        </motion.div>

        {/* Mobile / tablet: cards below text, never overlapping */}
        <div
          aria-hidden
          className="col-span-full mt-4 flex justify-center gap-4 px-5 lg:hidden"
        >
          <FakeWindow title="Generic AI" className="w-[min(46%,220px)] -rotate-3">
            <p>Invented answer…</p>
          </FakeWindow>
          <div className="w-[min(46%,220px)] rotate-3 rounded-xl bg-[#fff59d] p-4 text-[12px] text-[#2a2418]">
            Update the FAQ again…
          </div>
        </div>
      </div>
    </section>
  );
}
