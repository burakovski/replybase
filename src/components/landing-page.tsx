"use client";

import Link from "next/link";
import { useRef } from "react";
import { BookOpen, FileSearch, ShieldCheck } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { PLANS } from "@/lib/plans";
import { SiteHeader } from "@/components/site-header";
import { SiteLogo } from "@/components/site-logo";
import { ScrollProgress } from "@/components/scroll-progress";
import { FaqContactPopover } from "@/components/faq-contact-popover";
import { useLocale } from "@/components/locale-provider";
import { PlayfulHero } from "@/components/playful-hero";
import { ShinyButton } from "@/components/ui/shiny-button";
import { GlowCard } from "@/components/ui/glow-card";

export function LandingPage({ signedIn }: { signedIn: boolean }) {
  const { t } = useLocale();
  const L = t.landing;
  const reduce = useReducedMotion();

  const trustIcons = [
    { icon: FileSearch, label: L.trust1 },
    { icon: BookOpen, label: L.trust2 },
    { icon: ShieldCheck, label: L.trust3 },
  ];

  const problemRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const demoRef = useRef<HTMLElement>(null);

  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start end", "end start"],
  });
  const problemY = useTransform(
    problemProgress,
    [0, 1],
    reduce ? [0, 0] : [6, -6],
  );

  const { scrollYProgress: howProgress } = useScroll({
    target: howRef,
    offset: ["start 0.75", "end 0.45"],
  });
  const howLine = useSpring(howProgress, { stiffness: 90, damping: 24 });

  const { scrollYProgress: demoProgress } = useScroll({
    target: demoRef,
    offset: ["start 0.85", "end 0.35"],
  });
  const demoBar = useSpring(demoProgress, { stiffness: 100, damping: 26 });

  return (
    <div className="grain">
      <ScrollProgress />
      <SiteHeader signedIn={signedIn} />

      <main>
        <div className="flex min-h-[calc(100svh-4.5rem)] flex-col">
          <PlayfulHero />

          <motion.section
            className="shrink-0 border-y border-line/60 bg-[color-mix(in_srgb,var(--foam)_45%,transparent)]"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-6xl px-5 py-5 sm:py-6">
              <p className="max-w-3xl text-sm leading-relaxed text-ink sm:text-base">
                {L.trustLine}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {trustIcons.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-start gap-2.5 text-sm text-muted"
                  >
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-moss-deep"
                      aria-hidden
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </div>

        <section
          id="product"
          ref={problemRef}
          className="mx-auto max-w-6xl px-5 py-24 sm:py-28"
        >
          <motion.div style={{ y: problemY }}>
            <h2 className="display max-w-2xl text-3xl font-bold sm:text-4xl">
              {L.problemTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted">
              {L.problemBody}
            </p>
          </motion.div>
        </section>

        <section
          ref={howRef}
          className="mx-auto max-w-6xl px-5 py-24 sm:py-28"
        >
          <h2 className="display max-w-3xl text-3xl font-bold sm:text-4xl">
            {L.howTitle}
          </h2>
          <div className="relative mt-10">
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-line/50 xl:block"
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-7 hidden h-px origin-left bg-moss xl:block"
              style={{ scaleX: howLine, width: "100%" }}
            />
            <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {L.steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  className="panel relative rounded-3xl p-5"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    delay: reduce ? 0 : i * 0.08,
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-moss-deep">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mt-3 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <h2 className="display max-w-3xl text-3xl font-bold sm:text-4xl">
            {L.featuresTitle}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {L.features.map((f) => (
              <GlowCard key={f.title}>
                <h3 className="display text-xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <h2 className="display text-3xl font-bold sm:text-4xl">
            {L.useCasesTitle}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {L.useCases.map((u) => (
              <article
                key={u.title}
                className="rounded-3xl border border-line bg-foam/50 p-5"
              >
                <h3 className="display text-lg font-bold">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{u.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="demo"
          ref={demoRef}
          className="mx-auto max-w-6xl px-5 py-24 sm:py-28"
        >
          <h2 className="display text-3xl font-bold sm:text-4xl">
            {L.demoTitle}
          </h2>
          <div className="panel relative mt-10 overflow-hidden rounded-[2rem]">
            <motion.div
              aria-hidden
              className="absolute inset-x-0 top-0 z-10 h-[2px] origin-left bg-moss"
              style={{ scaleX: demoBar }}
            />
            <div className="flex min-h-[240px] items-center justify-center p-8 md:min-h-[320px]">
              <p className="max-w-md text-center text-sm text-muted">
                {L.demoPlaceholder}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted">{L.demoCaption}</p>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mb-10 max-w-2xl">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              {L.pricingTitle}
            </h2>
            <p className="mt-3 text-muted">{L.pricingSubtitle}</p>
          </div>
          <div className="grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const copy = t.plans[plan.id];
              return (
                <article
                  key={plan.id}
                  className={`flex h-full flex-col rounded-[1.75rem] border p-6 ${
                    plan.highlight
                      ? "border-transparent shadow-[0_24px_60px_rgba(7,23,20,0.25)]"
                      : "panel"
                  }`}
                  style={
                    plan.highlight
                      ? {
                          background: "var(--chat-surface)",
                          color: "var(--chat-fg)",
                        }
                      : undefined
                  }
                >
                  <p className="text-sm opacity-80">{copy.name}</p>
                  <p className="display mt-2 text-4xl font-extrabold">
                    {plan.price}
                    <span className="text-base font-medium opacity-70">
                      {copy.period ? ` ${copy.period}` : ""}
                    </span>
                  </p>
                  <p
                    className={`mt-3 text-sm ${plan.highlight ? "opacity-75" : "text-muted"}`}
                  >
                    {copy.blurb}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-sm">
                    {copy.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  {plan.highlight ? (
                    <div className="mt-8">
                      <ShinyButton href="/signup" inverse>
                        {copy.cta}
                      </ShinyButton>
                    </div>
                  ) : (
                    <Link href="/signup" className="btn btn-primary mt-8 w-full">
                      {copy.cta}
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-muted">
            {L.pricingNote}{" "}
            <a
              href="mailto:hello@replybase.app"
              className="font-semibold text-ink"
            >
              {L.contactUs}
            </a>
          </p>
        </section>

        <section id="faq" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <h2 className="display text-3xl font-bold sm:text-4xl">{L.faqTitle}</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {L.faqs.map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="cursor-pointer list-none display text-lg font-bold marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.q}
                    <span className="text-muted transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
          <FaqContactPopover />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="panel rounded-[2rem] px-6 py-12 text-center md:px-12 md:py-16">
            <h2 className="display mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              {L.finalTitle}
            </h2>
            <div className="mx-auto mt-8 flex max-w-sm justify-center">
              <ShinyButton href="/signup">{L.finalCta}</ShinyButton>
            </div>
            <p className="mt-4 text-sm text-muted">{L.finalNote}</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SiteLogo className="mb-1" />
            <nav className="mt-3 flex flex-wrap gap-4">
              <a href="#product" className="hover:text-ink">
                {L.footerProduct}
              </a>
              <a href="#pricing" className="hover:text-ink">
                {L.footerPricing}
              </a>
              <a href="#faq" className="hover:text-ink">
                {L.footerFaq}
              </a>
              <a href="mailto:hello@replybase.app" className="hover:text-ink">
                {L.footerContact}
              </a>
            </nav>
          </div>
          <p className="max-w-md sm:text-right">{L.footerPrint}</p>
        </div>
      </footer>
    </div>
  );
}
