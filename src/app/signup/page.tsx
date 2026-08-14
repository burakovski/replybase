"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    const presetEmail = (searchParams.get("email") || "").trim().toLowerCase();
    const verify = searchParams.get("verify") === "1";
    if (presetEmail && verify) {
      setEmail(presetEmail);
      setStep("confirm");
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  const confirmHint = useMemo(
    () => t.auth.confirmHint.replace("{email}", email || "…"),
    [email, t.auth.confirmHint],
  );

  async function onSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const nextEmail = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: nextEmail,
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t.auth.signupFailed);
      return;
    }
    if (data.needsConfirmation) {
      setEmail(data.email || nextEmail);
      setCode("");
      setStep("confirm");
      setResendIn(60);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  async function onVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token: code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(
        data.code === "invalid_otp"
          ? t.auth.verifyFailed
          : data.error || t.auth.verifyFailed,
      );
      return;
    }
    router.push("/app");
    router.refresh();
  }

  async function onResend() {
    if (resendIn > 0 || !email) return;
    setError("");
    setInfo("");
    setLoading(true);
    const res = await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t.auth.signupFailed);
      return;
    }
    setInfo(t.auth.resent);
    setResendIn(60);
  }

  if (step === "form") {
    return (
      <form
        onSubmit={onSignup}
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
            defaultValue={email}
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
          <Link href="/login" className="font-semibold text-ink underline">
            {t.auth.logInLink}
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form
      onSubmit={onVerify}
      className="panel w-full max-w-md rounded-[1.75rem] p-8"
    >
      <h1 className="display text-3xl font-bold">{t.auth.confirmTitle}</h1>
      <p className="mt-2 text-sm text-muted">{confirmHint}</p>
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-ink">
          {t.auth.codeLabel}
          <input
            className="input mt-2 tracking-[0.35em]"
            name="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </label>
      </div>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      {info ? <p className="mt-3 text-sm text-muted">{info}</p> : null}
      <button
        className="btn btn-primary mt-6 w-full"
        disabled={loading || !code.trim()}
      >
        {loading ? t.auth.verifying : t.auth.verify}
      </button>
      <button
        type="button"
        className="btn mt-3 w-full"
        disabled={loading || resendIn > 0}
        onClick={onResend}
      >
        {loading
          ? t.auth.resending
          : resendIn > 0
            ? t.auth.resendIn.replace("{s}", String(resendIn))
            : t.auth.resendCode}
      </button>
      <p className="mt-4 text-center text-sm text-muted">
        <button
          type="button"
          className="font-semibold text-ink underline"
          onClick={() => {
            setStep("form");
            setCode("");
            setError("");
            setInfo("");
          }}
        >
          {t.auth.changeEmail}
        </button>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <div className="grain min-h-screen">
      <SiteHeader variant="auth" />
      <main className="flex items-center justify-center px-5 py-8">
        <Suspense
          fallback={
            <div className="panel w-full max-w-md rounded-[1.75rem] p-8 text-sm text-muted">
              …
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </main>
    </div>
  );
}
