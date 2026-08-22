"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export const BROKIE_EVENT = "sos:brokie";

const QUOTES = [
  "Wake up, brokie. $0 MRR. Your waitlist is not a business.",
  "You built a SaaS. The S stands for broke.",
  "The Matrix called. They said stop shipping landing pages.",
  "You have a Notion doc and a dream. That's not hustle. That's a diary.",
  "Ramen is not a personality. Neither is your Stripe test-mode key.",
  "You screenshot a $9 payment like it's a Bugatti. It isn't.",
];

const PUNCHLINE = "but what color is your Bugatti?";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function openBrokieEgg() {
  window.dispatchEvent(new Event(BROKIE_EVENT));
}

export function BrokieTrigger({ children }: { children: ReactNode }) {
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onClick() {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 900);
    if (clicks.current >= 3) {
      clicks.current = 0;
      openBrokieEgg();
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-default border-0 bg-transparent p-0"
      aria-label="Homeless rank"
    >
      {children}
    </button>
  );
}

export function BrokieEgg() {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  const konami = useRef(0);
  const typed = useRef("");

  const show = useCallback(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setOpen(true);
  }, []);

  useEffect(() => {
    function onEgg() {
      show();
    }
    window.addEventListener(BROKIE_EVENT, onEgg);
    return () => window.removeEventListener(BROKIE_EVENT, onEgg);
  }, [show]);

  useEffect(() => {
    const w = window as Window & { brokie?: () => void };
    w.brokie = show;
    // eslint-disable-next-line no-console
    console.info("%cIf you're reading this, you're already a brokie. Try brokie()", "color:#c9a227");
    return () => {
      delete w.brokie;
    };
  }, [show]);

  useEffect(() => {
    function maybeHash() {
      if (window.location.hash.replace("#", "").toLowerCase() === "brokie") show();
    }
    maybeHash();
    window.addEventListener("hashchange", maybeHash);
    return () => window.removeEventListener("hashchange", maybeHash);
  }, [show]);

  useEffect(() => {
    function inField(el: EventTarget | null) {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (inField(e.target)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[konami.current]) {
        konami.current += 1;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          show();
        }
      } else {
        konami.current = key === KONAMI[0] ? 1 : 0;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        typed.current = (typed.current + e.key.toLowerCase()).slice(-6);
        if (typed.current === "brokie") {
          typed.current = "";
          show();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border-2 p-6 text-center shadow-2xl"
        style={{ background: "#0a0a0a", borderColor: "#c9a227", color: "#f5e6b8" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c9a227]">Brokie detected</p>
        <h2 className="display mt-3 text-5xl text-[#c9a227]">Wake up</h2>
        <p className="mt-4 text-lg leading-snug">{quote}</p>
        <p className="display mt-6 text-3xl text-[#c9a227]">{PUNCHLINE}</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-8 rounded-full px-5 py-2 text-sm font-semibold text-black"
          style={{ background: "#c9a227" }}
        >
          I remain a brokie
        </button>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#8a7a4a]">
          Parody. Not affiliated. Escape to close.
        </p>
      </div>
    </div>
  );
}
