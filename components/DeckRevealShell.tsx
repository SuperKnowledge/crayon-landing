"use client";

import { useEffect, useRef } from "react";
import type { RevealApi } from "reveal.js";

type DeckRevealShellProps = {
  children: React.ReactNode;
};

export default function DeckRevealShell({ children }: DeckRevealShellProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!revealRef.current) {
      return;
    }

    let deck: RevealApi | null = null;
    let cancelled = false;

    fetch("/api/deck/logout", {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // A failed clear only affects whether refresh asks again immediately.
    });

    async function initializeDeck() {
      const { default: Reveal } = await import("reveal.js");

      if (!revealRef.current || cancelled) {
        return;
      }

      deck = new Reveal(revealRef.current, {
        autoAnimate: false,
        center: false,
        controls: true,
        disableLayout: false,
        hash: true,
        height: 720,
        margin: 0.06,
        progress: true,
        transition: "fade",
        width: 1280,
      });

      await deck.initialize();
    }

    initializeDeck();

    return () => {
      cancelled = true;
      deck?.destroy();
    };
  }, []);

  return (
    <div className="deck-shell">
      <div className="reveal" ref={revealRef}>
        <div className="slides">{children}</div>
      </div>
    </div>
  );
}
