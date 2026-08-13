"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Info, Loader2, Sparkles } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { LinkPendingSpinner } from "@/components/link-pending-spinner";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

const PREV_PLAN: Record<PlanId, PlanId | null> = {
  free: null,
  starter: "free",
  growth: "starter",
};

export default function BillingPage() {
  const { t } = useLocale();
  const [plan, setPlan] = useState<PlanId>("free");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => {
        setPlan(d.plan || "free");
        setReady(true);
      });
  }, []);

  async function choose(next: PlanId) {
    if (next === plan) return;
    setLoading(next);
    setMessage("");
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: next,
        mockPaymentMethod: "pm_card_visa_test",
      }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setMessage(data.error || t.app.billingFailed);
      return;
    }
    setPlan(data.user.plan);
    setMessage(next === "free" ? t.app.downgraded : t.app.upgraded);
  }

  const currentCopy = t.plans[plan];
  const currentMeta = PLANS.find((p) => p.id === plan)!;
  const highlightFeature = currentCopy.features[0];

  if (!ready) {
    return (
      <div className="w-full pb-10" aria-busy="true">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="h-10 w-64 max-w-full animate-pulse rounded-md bg-line/30" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-line/25" />
          </div>
          <div className="h-11 w-28 shrink-0 animate-pulse rounded-full bg-line/30" />
        </div>
        <div className="panel mt-10 h-40 animate-pulse rounded-3xl bg-line/15" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <div className="panel h-72 animate-pulse rounded-3xl bg-line/15" />
          <div className="panel h-72 animate-pulse rounded-3xl bg-line/15" />
          <div className="panel h-72 animate-pulse rounded-3xl bg-line/15" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.app.explorePlans}
          </h1>
          <p className="mt-2 text-sm text-muted">{t.app.comparePlans}</p>
        </div>
        <Link
          href="/app"
          className="btn btn-ghost inline-flex shrink-0 items-center gap-2 text-sm"
        >
          <LinkPendingSpinner />
          {t.app.myBots}
        </Link>
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">
            {t.app.yourCurrentPlan}
          </h2>
          <span className="rounded-full bg-foam px-3 py-1 text-xs font-medium text-muted">
            $ USD
          </span>
        </div>

        <div className="panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="display text-2xl font-bold tracking-tight text-ink">
                {ready ? currentCopy.name : "…"}
              </p>
              <p className="mt-1 max-w-md text-sm text-muted">
                {currentCopy.blurb}
              </p>
              {highlightFeature ? (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink">
                  {highlightFeature}
                  <Info className="size-3.5 text-muted" aria-hidden />
                </p>
              ) : null}
              <p className="mt-2 text-xs text-muted">{t.app.billingMockNote}</p>
            </div>

            {plan === "free" || !currentMeta.embed ? (
              <div className="flex w-full max-w-sm shrink-0 flex-col justify-between gap-3 rounded-2xl bg-foam/70 px-4 py-4 sm:flex-row sm:items-center lg:w-[320px] lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--panel)] text-moss-deep">
                    <Sparkles className="size-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      {t.app.embedUpsellTitle}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-muted">
                      {t.app.embedUpsellBody}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary inline-flex shrink-0 items-center gap-2 px-3.5 py-2 text-sm"
                  onClick={() => void choose("starter")}
                  disabled={loading === "starter"}
                >
                  {loading === "starter" ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {loading === "starter" ? t.app.processing : t.app.upgrade}
                </button>
              </div>
            ) : (
              <div className="flex w-full max-w-sm shrink-0 items-center justify-between gap-3 rounded-2xl bg-foam/70 px-4 py-4 lg:w-[280px]">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {currentMeta.price}
                    {currentCopy.period ? ` ${currentCopy.period}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{t.app.billedMonthly}</p>
                </div>
                <span className="rounded-full bg-[var(--panel)] px-3 py-1 text-xs font-medium text-moss-deep">
                  {t.app.current}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {message ? (
        <p className="mt-4 rounded-3xl bg-foam px-4 py-3 text-sm text-moss-deep">
          {message}
        </p>
      ) : null}

      <section className="mt-12">
        <h2 className="text-sm font-semibold text-ink">
          {t.app.compareAllPlans}
        </h2>

        <div className="mt-5 grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((p) => {
            const copy = t.plans[p.id];
            const isCurrent = plan === p.id;
            const isPopular = p.highlight;
            const prev = PREV_PLAN[p.id];
            const isDowngrade =
              PLANS.findIndex((x) => x.id === p.id) <
              PLANS.findIndex((x) => x.id === plan);

            return (
              <article
                key={p.id}
                className={`panel relative flex h-full flex-col rounded-3xl p-6 ${
                  isPopular ? "bg-foam/40" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="display text-xl font-bold text-ink">
                    {copy.name}
                  </h3>
                  {isPopular ? (
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--moss)_16%,transparent)] px-2.5 py-0.5 text-[11px] font-semibold text-moss-deep">
                      {t.app.popular}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-[15px] text-ink">
                  <span className="display text-2xl font-bold">{p.price}</span>{" "}
                  <span className="text-muted">{t.app.perMonth}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {p.id === "free"
                    ? t.app.billingMockNote
                    : `${t.app.billedMonthly} · mock Stripe`}
                </p>

                <div className="mt-5 min-h-11">
                  {isCurrent ? (
                    <button
                      type="button"
                      className="btn btn-ghost w-full opacity-70"
                      disabled
                    >
                      {t.app.current}
                    </button>
                  ) : isPopular ? (
                    <button
                      type="button"
                      className="btn btn-primary inline-flex w-full items-center justify-center gap-2"
                      disabled={loading === p.id}
                      onClick={() => void choose(p.id)}
                    >
                      {loading === p.id ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      {loading === p.id ? t.app.processing : t.app.upgrade}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost inline-flex w-full items-center justify-center gap-2"
                      disabled={loading === p.id}
                      onClick={() => void choose(p.id)}
                    >
                      {loading === p.id ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : null}
                      {loading === p.id
                        ? t.app.processing
                        : isDowngrade
                          ? t.app.choosePlan
                          : t.app.upgrade}
                    </button>
                  )}
                </div>

                <p className="mt-6 text-sm font-semibold text-ink">
                  {prev
                    ? `${t.app.everythingIn} ${t.plans[prev].name}`
                    : t.app.includes}
                </p>
                <ul className="mt-3 flex-1 space-y-2.5 text-sm text-ink">
                  {copy.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-moss"
                        strokeWidth={2}
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
      </section>
    </div>
  );
}
