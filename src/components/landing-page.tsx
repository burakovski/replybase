"use client";

import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export function LandingPage({ signedIn }: { signedIn: boolean }) {
  const { t } = useLocale();
  const L = t.landing;

  const features = [
    { title: L.feature1Title, body: L.feature1Body },
    { title: L.feature2Title, body: L.feature2Body },
    { title: L.feature3Title, body: L.feature3Body },
  ];

  return (
    <div className="grain min-h-screen">
      <SiteHeader signedIn={signedIn} />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-line bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] px-3 py-1 text-xs font-medium text-moss-deep">
              {L.eyebrow}
            </p>
            <h1 className="display text-5xl font-extrabold leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
              {L.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {L.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                {L.ctaPrimary}
              </Link>
              <a href="#demo" className="btn btn-ghost">
                {L.ctaSecondary}
              </a>
            </div>
          </div>

          <div className="panel relative overflow-hidden rounded-[1.75rem] p-5 shadow-[0_30px_80px_rgba(7,23,20,0.12)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {L.livePreview}
                </p>
                <p className="display text-lg font-bold">{L.previewBot}</p>
              </div>
              <span className="rounded-full bg-foam px-3 py-1 text-xs font-semibold text-moss-deep">
                {L.ragReady}
              </span>
            </div>
            <div className="space-y-3 rounded-2xl bg-ink p-4 text-sm text-white">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">
                {L.q1}
              </div>
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-moss px-3 py-2">
                {L.a1}
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">
                {L.q2}
              </div>
              <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-moss px-3 py-2">
                {L.a2}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted">
              <div className="rounded-xl bg-foam/80 px-2 py-3">
                <p className="display text-lg font-bold text-ink">{L.pillDocs}</p>
                {L.pillDocsSub}
              </div>
              <div className="rounded-xl bg-foam/80 px-2 py-3">
                <p className="display text-lg font-bold text-ink">{L.pillChat}</p>
                {L.pillChatSub}
              </div>
              <div className="rounded-xl bg-foam/80 px-2 py-3">
                <p className="display text-lg font-bold text-ink">
                  {L.pillWidget}
                </p>
                {L.pillWidgetSub}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="display text-3xl font-bold sm:text-4xl">
            {L.featuresTitle}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="panel rounded-3xl p-6">
                <h3 className="display text-xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="demo" className="mx-auto max-w-6xl px-5 py-8">
          <div className="panel rounded-[2rem] p-8 md:p-10">
            <h2 className="display text-3xl font-bold">{L.howTitle}</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-4">
              {L.steps.map((step, i) => (
                <li key={step} className="rounded-2xl bg-foam/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-moss-deep">
                    {L.stepLabel} {i + 1}
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              {L.pricingTitle}
            </h2>
            <p className="mt-3 text-muted">{L.pricingSubtitle}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const copy = t.plans[plan.id];
              return (
                <article
                  key={plan.id}
                  className={`rounded-[1.75rem] border p-6 ${
                    plan.highlight
                      ? "border-ink bg-ink text-white shadow-[0_24px_60px_rgba(7,23,20,0.25)]"
                      : "panel"
                  }`}
                >
                  <p className="text-sm opacity-80">{copy.name}</p>
                  <p className="display mt-2 text-4xl font-extrabold">
                    {plan.price}
                    <span className="text-base font-medium opacity-70">
                      {" "}
                      {copy.period}
                    </span>
                  </p>
                  <p
                    className={`mt-3 text-sm ${plan.highlight ? "text-white/75" : "text-muted"}`}
                  >
                    {copy.blurb}
                  </p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {copy.features.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`btn mt-8 w-full ${
                      plan.highlight
                        ? "bg-white text-ink hover:bg-foam"
                        : "btn-primary"
                    }`}
                  >
                    {L.choose} {copy.name}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{L.footerLeft}</p>
        <p>{L.footerRight}</p>
      </footer>
    </div>
  );
}
