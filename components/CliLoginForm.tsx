"use client";

import { useState } from "react";

type CliLoginFormProps = {
  stateValue: string;
};

type IssueResponse = {
  code?: string;
  callback_url?: string;
  detail?: string;
  user?: {
    email?: string;
  };
};

type IssuedLogin = {
  code: string;
  callbackUrl: string;
  callbackDisplay: string;
  userEmail: string;
};

type Step = "form" | "posting" | "authorize";

export function CliLoginForm({ stateValue }: CliLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");
  const [issuedLogin, setIssuedLogin] = useState<IssuedLogin | null>(null);

  const disabled = step === "posting" || step === "authorize" || !stateValue;

  function callbackDisplay(callbackUrl: string): string {
    try {
      const url = new URL(callbackUrl);
      return `${url.hostname}:${url.port || "80"}`;
    } catch {
      return "local CLI";
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStep("posting");

    try {
      const issueResponse = await fetch("/api/cli-login/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: stateValue, email, password }),
      });
      const issueData = (await issueResponse.json().catch(() => ({}))) as IssueResponse;

      if (!issueResponse.ok || !issueData.code || !issueData.callback_url) {
        setError(issueData.detail || "Unable to complete CLI login");
        setStep("form");
        return;
      }

      setIssuedLogin({
        code: issueData.code,
        callbackUrl: issueData.callback_url,
        callbackDisplay: callbackDisplay(issueData.callback_url),
        userEmail: issueData.user?.email || email,
      });
      setStep("authorize");
    } catch {
      setError("Unable to prepare CLI login. Make sure crayon login is still running.");
      setStep("form");
    }
  }

  function authorizeCli() {
    if (!issuedLogin) {
      return;
    }

    const url = new URL(issuedLogin.callbackUrl);
    url.searchParams.set("state", stateValue);
    url.searchParams.set("code", issuedLogin.code);
    window.location.assign(url.toString());
  }

  if (!stateValue) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20">
        <h1 className="font-display text-2xl font-bold text-white">CLI Login</h1>
        <p className="mt-4 text-sm text-white/60">Missing login state. Start again from the Crayon CLI.</p>
      </div>
    );
  }

  if (step === "authorize" && issuedLogin) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Crayon</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Authorize CLI</h1>
        </div>
        <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-white/70">Signed in as</p>
          <p className="mt-1 break-words text-base font-semibold text-white">{issuedLogin.userEmail}</p>
          <p className="mt-5 text-sm text-white/70">Local CLI callback</p>
          <p className="mt-1 font-mono text-sm text-white">{issuedLogin.callbackDisplay}</p>
        </div>
        <p className="mt-5 text-sm leading-6 text-white/60">
          Continue only if you started <span className="font-mono text-white">crayon login</span> on this device.
        </p>
        <button
          type="button"
          onClick={authorizeCli}
          className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Authorize This CLI
        </button>
        <button
          type="button"
          onClick={() => {
            setIssuedLogin(null);
            setStep("form");
          }}
          className="mt-3 w-full rounded-full border border-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/20 backdrop-blur"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Crayon</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-white">CLI Login</h1>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Sign in to connect the Crayon CLI running on this device.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <label className="block text-sm font-medium text-white/70" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={disabled}
          className="w-full rounded-full border border-white/10 bg-white/[0.05] px-6 py-4 text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <label className="block text-sm font-medium text-white/70" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={disabled}
          className="w-full rounded-full border border-white/10 bg-white/[0.05] px-6 py-4 text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {error ? <p className="mt-5 text-sm text-red-300">{error}</p> : null}

      <button
        type="submit"
        disabled={disabled}
        className="mt-8 w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {step === "posting" ? "Checking..." : "Continue"}
      </button>
    </form>
  );
}
