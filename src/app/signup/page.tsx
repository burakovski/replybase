"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t.auth.signupFailed);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="grain min-h-screen">
      <SiteHeader variant="auth" />
      <div className="flex items-center justify-center px-5 py-8">
        <form
          onSubmit={onSubmit}
          className="panel w-full max-w-md rounded-[1.75rem] p-8"
        >
          <h1 className="display text-3xl font-bold">{t.auth.createAccount}</h1>
          <p className="mt-2 text-sm text-muted">{t.auth.signupHint}</p>
          <div className="mt-6 space-y-3">
            <input
              className="input"
              name="name"
              placeholder={t.auth.name}
              required
            />
            <input
              className="input"
              name="email"
              type="email"
              placeholder={t.auth.workEmail}
              required
            />
            <input
              className="input"
              name="password"
              type="password"
              placeholder={t.auth.passwordMin}
              minLength={6}
              required
            />
          </div>
          {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
          <button className="btn btn-primary mt-6 w-full" disabled={loading}>
            {loading ? t.auth.creating : t.auth.signUp}
          </button>
          <p className="mt-4 text-center text-sm text-muted">
            {t.auth.haveAccount}{" "}
            <Link href="/login" className="font-semibold text-ink">
              {t.auth.logInLink}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
