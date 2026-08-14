"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  BookOpen,
  Check,
  CircleHelp,
  CreditCard,
  FileSearch,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { PLANS } from "@/lib/plans";
import { SiteHeader } from "@/components/site-header";
import { SiteLogo } from "@/components/site-logo";
import { ScrollProgress } from "@/components/scroll-progress";
import { FaqContactPopover } from "@/components/faq-contact-popover";
import { useLocale } from "@/components/locale-provider";
import { PlayfulHero } from "@/components/playful-hero";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ShinyButton } from "@/components/ui/shiny-button";
import { SupportedModels } from "@/components/supported-models";
import { OldWaySection } from "@/components/old-way-section";

const PLAN_ICONS = {
  free: Zap,
  starter: Sparkles,
  growth: Rocket,
} as const;

const FEATURE_VISUALS = [
  "/images/feature-grounded.webp",
  "/images/feature-embed.webp",
  "/images/feature-history.webp",
  "/images/feature-bots.webp",
] as const;

export function LandingPage({ signedIn }: { signedIn: boolean }) {
  const { t } = useLocale();
  const L = t.landing;
  const reduce = useReducedMotion();

  const trustIcons = [
    { icon: FileSearch, label: L.trust1 },
    { icon: BookOpen, label: L.trust2 },
    { icon: ShieldCheck, label: L.trust3 },
  ];

  const howRef = useRef<HTMLElement>(null);

  const { scrollYProgress: howProgress } = useScroll({
    target: howRef,
    offset: ["start 0.75", "end 0.45"],
  });
  const howLine = useSpring(howProgress, { stiffness: 90, damping: 24 });

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

        <OldWaySection />

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
                  <h3 className="display mt-3 text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="max-w-3xl">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              {L.featuresTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {L.featuresSubtitle}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-5 md:gap-6">
            {L.features.map((f, i) => {
              const visual = FEATURE_VISUALS[i] ?? FEATURE_VISUALS[0];
              const imageLeft = i % 2 === 0;

              return (
                <article
                  key={f.title}
                  className="grid overflow-hidden rounded-[1.75rem] border border-line md:grid-cols-2"
                >
                  <div
                    className={`relative min-h-[240px] bg-foam sm:min-h-[280px] lg:min-h-[340px] ${
                      imageLeft ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <Image
                      src={visual}
                      alt={f.title}
                      fill
                      className="object-cover object-top"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>

                  <div
                    className={`flex min-h-[240px] flex-col justify-center bg-[var(--panel)] p-7 sm:min-h-[280px] sm:p-9 lg:min-h-[340px] lg:p-10 ${
                      imageLeft
                        ? "md:order-2 md:border-l md:border-line"
                        : "md:order-1 md:border-r md:border-line"
                    }`}
                  >
                    <h3 className="display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                      {f.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                      {f.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <SupportedModels />

        <section className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <h2 className="display text-3xl font-bold sm:text-4xl">
            {L.useCasesTitle}
          </h2>
          <HoverEffect
            className="mt-8"
            items={L.useCases.map((u, i) => ({
              title: u.title,
              description: u.body,
              icon: [BookOpen, CreditCard, CircleHelp, Rocket][i],
            }))}
          />
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              {L.pricingTitle}
            </h2>
            <p className="mt-3 text-muted">{L.pricingSubtitle}</p>
          </div>
          <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const copy = t.plans[plan.id];
              const Icon = PLAN_ICONS[plan.id];
              return (
                <article
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-3xl border border-line bg-[var(--panel)] p-7 ${
                    plan.highlight
                      ? "shadow-[0_20px_50px_rgba(7,23,20,0.12)] ring-1 ring-moss/30"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="display text-xl font-bold">{copy.name}</p>
                      <p className="mt-1 text-sm text-muted">{copy.blurb}</p>
                    </div>
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-foam text-moss-deep">
                      <Icon className="size-5" aria-hidden />
                    </span>
                  </div>

                  <p className="display mt-6 text-4xl font-extrabold tracking-tight">
                    {plan.price}
                    <span className="text-base font-medium text-muted">
                      {copy.period ? ` ${copy.period}` : ""}
                    </span>
                  </p>

                  <Link
                    href="/signup"
                    className={`btn mt-6 w-full ${
                      plan.highlight ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    {copy.cta}
                  </Link>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {copy.name} {L.planIncludes}
                  </p>
                  <ul className="mt-3 flex-1 space-y-2.5 text-sm">
                    {copy.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-moss"
                          strokeWidth={2.25}
                          aria-hidden
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            {L.pricingNote}{" "}
            <a
              href="mailto:hello@replybase.app"
              className="font-semibold text-ink underline"
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
