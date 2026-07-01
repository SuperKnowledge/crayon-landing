"use client";

import { useEffect, useRef } from "react";
import type { RevealApi } from "reveal.js";

type DeckRevealShellProps = {
  children: React.ReactNode;
  clearSessionOnLoad: boolean;
  exportHref?: string | null;
  showConfidential?: boolean;
};

export default function DeckRevealShell({
  children,
  clearSessionOnLoad,
  exportHref,
  showConfidential = true,
}: DeckRevealShellProps) {
  const revealRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<RevealApi | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!revealRef.current) {
      return;
    }

    const isPrintPdf = window.location.search.includes("print-pdf");
    if (initializedRef.current) {
      return;
    }
    initializedRef.current = true;

    let cancelled = false;
    let printTimeout: number | null = null;

    function revealPrintSlides() {
      revealRef.current?.querySelectorAll<HTMLElement>(".pdf-page section[hidden]").forEach((slide) => {
        slide.removeAttribute("hidden");
        slide.removeAttribute("aria-hidden");
      });
    }

    function installPrintPageStyle() {
      let style = document.getElementById("crayon-deck-print-page-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "crayon-deck-print-page-style";
        document.head.appendChild(style);
      }

      style.textContent = `
        @page {
          size: 13.333333in 7.5in;
          margin: 0;
        }
      `;
    }

    if (!isPrintPdf && clearSessionOnLoad) {
      fetch("/api/deck/logout", {
        method: "POST",
        keepalive: true,
      }).catch(() => {
        // A failed clear only affects whether refresh asks again immediately.
      });
    }

    async function initializeDeck() {
      const { default: Reveal } = await import("reveal.js");

      if (!revealRef.current || cancelled) {
        return;
      }

      const deck = new Reveal(revealRef.current, {
        autoAnimate: false,
        center: false,
        controls: true,
        disableLayout: false,
        fragments: false,
        hash: true,
        height: 720,
        margin: 0.06,
        pdfSeparateFragments: false,
        progress: true,
        transition: "fade",
        view: isPrintPdf ? "print" : null,
        width: 1280,
      });
      deckRef.current = deck;

      if (isPrintPdf) {
        deck.on("pdf-ready", () => {
          installPrintPageStyle();
          revealPrintSlides();
          void document.fonts.ready.then(() => {
            installPrintPageStyle();
            revealPrintSlides();
            if (!navigator.webdriver) {
              printTimeout = window.setTimeout(() => window.print(), 250);
            }
          });
        });
      }

      await deck.initialize();
    }

    initializeDeck();

    return () => {
      cancelled = true;
      if (printTimeout) {
        window.clearTimeout(printTimeout);
      }
      if (!isPrintPdf) {
        deckRef.current?.destroy();
        deckRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [clearSessionOnLoad]);

  return (
    <div className="deck-shell">
      {showConfidential ? (
        <p className="deck-confidential">Confidential · Do not distribute</p>
      ) : null}
      {exportHref ? (
        <a className="deck-export-button" href={exportHref} target="_blank" rel="noreferrer">
          Export PDF
        </a>
      ) : null}
      <div className="reveal" ref={revealRef}>
        <div className="slides">{children}</div>
      </div>
    </div>
  );
}
