"use client";

import Image from "next/image";
import { useState } from "react";

export default function DeckLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/deck/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus("error");
        setMessage(
          data?.error || `Unable to open the deck. Server returned ${response.status}.`,
        );
        return;
      }

      window.location.reload();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <main className="deck-login-page">
      <section className="deck-login-panel" aria-labelledby="deck-login-title">
        <Image
          className="deck-login-logo"
          src="/crayon_logo.png"
          alt="Crayon"
          width={52}
          height={52}
          priority
        />
        <h1 id="deck-login-title">Investor Deck</h1>
        <form onSubmit={handleSubmit} className="deck-login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Access code</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Opening..." : "View deck"}
          </button>
          {message ? <p className="deck-login-error">{message}</p> : null}
        </form>
      </section>
    </main>
  );
}
