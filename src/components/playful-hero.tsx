"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUp, FileText } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";
import { Iphone } from "@/components/ui/iphone";

const heroItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 140, damping: 22 },
  },
};

/** No translateY — RoughNotation measures getBoundingClientRect and breaks under CSS transforms. */
const heroTitle = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function PlayfulHero() {
  const { t, locale } = useLocale();
  const { theme } = useTheme();
  const L = t.landing;
  const reduce = useReducedMotion();
  const [showMarks, setShowMarks] = useState(!!reduce);

  const highlightColor = theme === "dark" ? "rgba(45, 212, 191, 0.45)" : "rgba(26, 99, 84, 0.28)";
  const underlineColor = theme === "dark" ? "#2dd4bf" : "#1a6354";

  useEffect(() => {
    if (reduce) {
      setShowMarks(true);
      return;
    }
    setShowMarks(false);
    // Wait for title fade-in + layout settle before measuring word boxes.
    const id = window.setTimeout(() => setShowMarks(true), 520);
    return () => window.clearTimeout(id);
  }, [reduce, locale]);

  const bubbles = [
    { role: "user" as const, text: L.q1 },
    { role: "bot" as const, text: L.a1, source: L.a1Source },
    { role: "user" as const, text: L.q2 },
    { role: "bot" as const, text: L.a2, source: L.a2Source },
    { role: "user" as const, text: L.q3 },
    { role: "bot" as const, text: L.a3 },
  ];

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-8 px-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:py-8">
      <motion.div
        initial={reduce ? false : "hidden"}
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.09, delayChildren: 0.05 },
          },
        }}
      >
        <motion.p
          variants={heroItem}
          className="mb-4 inline-flex max-w-xl rounded-full border border-line bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] px-3 py-1 text-xs font-medium leading-snug text-moss-deep"
        >
          {L.eyebrow}
        </motion.p>

        <motion.h1
          variants={heroTitle}
          className="display text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
        >
          <span key={locale}>
            {locale === "ru" ? (
              <>
                <span className="block">{L.titleLead.trimEnd()}</span>
                <RoughNotation
                  type="highlight"
                  color={highlightColor}
                  animationDuration={1400}
                  padding={[2, 4]}
                  show={showMarks || !!reduce}
                >
                  <span className="relative inline-block whitespace-nowrap text-ink">
                    {L.titleMark}
                  </span>
                </RoughNotation>
              </>
            ) : (
              <span className="whitespace-nowrap">
                {L.titleLead}
                <RoughNotation
                  type="highlight"
                  color={highlightColor}
                  animationDuration={1400}
                  padding={[2, 4]}
                  show={showMarks || !!reduce}
                >
                  <span className="relative inline-block text-ink">
                    {L.titleMark}
                  </span>
                </RoughNotation>
              </span>
            )}
            {L.titleMid}
            <RoughNotation
              type="underline"
              color={underlineColor}
              animationDuration={1100}
              strokeWidth={3}
              // default bottom padding is 5 → -1 pulls stroke ~6px closer to glyphs
              padding={[0, 0, -1, 0]}
              show={showMarks || !!reduce}
            >
              <span className="relative inline-block text-ink">
                {L.titleUnderlineA}
              </span>
            </RoughNotation>{" "}
            <RoughNotation
              type="underline"
              color={underlineColor}
              animationDuration={1100}
              strokeWidth={3}
              padding={[0, 0, -1, 0]}
              show={showMarks || !!reduce}
            >
              <span className="relative inline-block text-ink">
                {L.titleUnderlineB}
              </span>
            </RoughNotation>
            {L.titleTail}
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-5 max-w-xl text-lg leading-relaxed text-muted"
        >
          {L.subtitle}
        </motion.p>

        <motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-3.5">
          <Link href="/signup" className="btn btn-primary btn-hero">
            {L.ctaPrimary}
          </Link>
          <a href="#demo" className="btn btn-ghost btn-hero">
            {L.ctaSecondary}
          </a>
        </motion.div>

        <motion.p variants={heroItem} className="mt-3 text-sm text-muted">
          {L.heroNote}
        </motion.p>
      </motion.div>

      <motion.div
        className="mx-auto mt-16 w-[min(432px,calc(min(92svh,880px)*433/882))]"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: reduce ? 0 : 0.42,
          type: "spring",
          stiffness: 120,
          damping: 22,
        }}
      >
        <Iphone>
          <div
            className="flex h-full flex-col px-4 pb-10 pt-14 text-[13px] leading-snug"
            style={{ color: "var(--chat-fg)" }}
          >
            <div className="mb-3 flex shrink-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] opacity-60">
                  Replybase
                </p>
                <p className="display truncate text-base font-bold">
                  {L.previewBot}
                </p>
              </div>
              <p className="mt-1 flex shrink-0 items-center gap-1.5 text-[11px] font-medium opacity-80">
                <span
                  className="size-1.5 rounded-full bg-[var(--moss)]"
                  aria-hidden
                />
                {L.previewOnline}
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pe-0.5">
              {bubbles.map((b, i) => (
                <motion.div
                  key={`${b.role}-${i}`}
                  className={`max-w-[94%] rounded-2xl px-3 py-2 ${
                    b.role === "user"
                      ? "rounded-tl-sm"
                      : "ml-auto rounded-tr-sm"
                  }`}
                  style={{
                    background:
                      b.role === "user"
                        ? "var(--chat-user)"
                        : "var(--chat-bot)",
                  }}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.55 + i * 0.22,
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                  }}
                >
                  <p className="whitespace-pre-wrap">{b.text}</p>
                  {"source" in b && b.source ? (
                    <p className="mt-1.5 flex items-start gap-1 text-[10px] leading-snug opacity-75">
                      <FileText
                        className="mt-px size-3 shrink-0 opacity-90"
                        aria-hidden
                      />
                      <span>
                        {L.previewSource} {b.source}
                      </span>
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </div>
            <form
              className="mt-3 flex shrink-0 items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder={L.previewAsk}
                aria-label={L.previewAsk}
                className="min-w-0 flex-1 rounded-full border-0 px-3.5 py-2.5 text-[12px] outline-none placeholder:opacity-55"
                style={{
                  background: "var(--chat-user)",
                  color: "var(--chat-fg)",
                }}
              />
              <button
                type="submit"
                aria-label={L.previewSend}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "var(--chat-bot)",
                  color: "var(--chat-fg)",
                }}
              >
                <ArrowUp className="size-4" strokeWidth={2.5} aria-hidden />
              </button>
            </form>
          </div>
        </Iphone>
      </motion.div>
    </section>
  );
}
