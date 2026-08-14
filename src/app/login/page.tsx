"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPendingEmail("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (data.code === "email_not_confirmed") {
        setPendingEmail(email);
        setError(t.auth.emailNotConfirmed);
        return;
      }
      setError(data.error || t.auth.loginFailed);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="grain min-h-screen">
      <SiteHeader variant="auth" />
      <main className="flex items-center justify-center px-5 py-8">
        <form
          onSubmit={onSubmit}
          className="panel w-full max-w-md rounded-[1.75rem] p-8"
        >
          <h1 className="display text-3xl font-bold">{t.auth.welcomeBack}</h1>
          <div className="mt-6 space-y-3">
            <input
              className="input"
              name="email"
              type="email"
              placeholder={t.auth.email}
              required
            />
            <input
              className="input"
              name="password"
              type="password"
              placeholder={t.auth.password}
              required
            />
          </div>
          {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
          {pendingEmail ? (
            <p className="mt-2 text-sm text-muted">
              <Link
                href={`/signup?verify=1&email=${encodeURIComponent(pendingEmail)}`}
                className="font-semibold text-ink underline"
              >
                {t.auth.confirmTitle}
              </Link>
            </p>
          ) : null}
          <button className="btn btn-primary mt-6 w-full" disabled={loading}>
            {loading ? t.auth.signingIn : t.auth.logIn}
          </button>
          <p className="mt-4 text-center text-sm text-muted">
            {t.auth.newHere}{" "}
            <Link href="/signup" className="font-semibold text-ink underline">
              {t.auth.createAccountLink}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
