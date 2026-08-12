"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

export default function BillingPage() {
  const { t } = useLocale();
  const [plan, setPlan] = useState<PlanId>("free");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan || "free"));
  }, []);

  async function choose(next: PlanId) {
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
    setMessage(
      next === "free"
        ? t.app.downgraded
        : `${t.app.upgraded} (${data.receipt.id})`,
    );
  }

  return (
    <div>
      <h1 className="display text-3xl font-bold">{t.app.billingTitle}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {t.app.billingSubtitle} {t.app.currentPlan}:{" "}
        <strong className="text-ink">{plan}</strong>
      </p>
      {message ? (
        <p className="mt-4 rounded-2xl bg-foam px-4 py-3 text-sm text-moss-deep">
          {message}
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const copy = t.plans[p.id];
          return (
            <article
              key={p.id}
              className={`rounded-[1.75rem] border p-6 ${
                plan === p.id ? "border-ink bg-[var(--input-bg)]" : "panel"
              }`}
            >
              <p className="display text-2xl font-bold">{copy.name}</p>
              <p className="mt-2 text-3xl font-bold">
                {p.price}
                <span className="text-sm font-medium text-muted">
                  {" "}
                  {copy.period}
                </span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {copy.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                className="btn btn-primary mt-6 w-full"
                disabled={loading === p.id || plan === p.id}
                onClick={() => choose(p.id)}
              >
                {plan === p.id
                  ? t.app.current
                  : loading === p.id
                    ? t.app.processing
                    : `${t.app.choosePlan} ${copy.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
