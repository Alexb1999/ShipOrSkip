"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";
import type { RankedApp } from "@/lib/ranking";
import { SwipeCard } from "@/components/SwipeCard";
import { SuperShipModal } from "@/components/SuperShipModal";

type Direction = "ship" | "skip" | "super_ship";

export function DeckEngine({
  initialDeck,
  signedIn,
}: {
  initialDeck: RankedApp[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const [deck, setDeck] = useState(initialDeck);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmSuper, setConfirmSuper] = useState(false);
  const [superError, setSuperError] = useState<string | null>(null);

  const current = deck[0];
  const upcoming = deck.slice(1, 3);

  const goLogin = useCallback(() => {
    router.push("/login?from=/deck");
  }, [router]);

  const requestSuper = useCallback(() => {
    if (!signedIn) {
      goLogin();
      return;
    }
    setSuperError(null);
    setConfirmSuper(true);
  }, [goLogin, signedIn]);

  const vote = useCallback(
    async (direction: Direction) => {
      if (!current || busy) return;
      if (!signedIn) {
        goLogin();
        return;
      }
      if (direction === "super_ship") {
        setBusy(true);
        setSuperError(null);
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "super_ship", appId: current.id, amount: 15 }),
        });
        const data = await res.json();
        setBusy(false);
        if (!res.ok) {
          setSuperError(data.error ?? "Super Ship failed");
          return;
        }
        router.push(data.url);
        return;
      }
      setBusy(true);
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: current.id, direction }),
      });
      const data = await res.json();
      setBusy(false);
      if (!res.ok) {
        setToast(data.error ?? "Swipe failed");
        setDeck((d) => d.slice(1));
        return;
      }
      setToast(
        direction === "ship"
          ? `SHIP · ${current.name} is now ${data.eloScore} ELO`
          : `SKIP · ${current.name} drops to ${data.eloScore} ELO`,
      );
      setDeck((d) => d.slice(1));
    },
    [busy, current, goLogin, router, signedIn],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (confirmSuper) {
        if (e.key === "Escape") {
          setConfirmSuper(false);
          setSuperError(null);
        }
        return;
      }
      if (e.key === "ArrowRight") vote("ship");
      if (e.key === "ArrowLeft") vote("skip");
      if (e.key === "ArrowUp") requestSuper();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vote, confirmSuper, requestSuper]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 140 || info.velocity.x > 800) vote("ship");
    else if (info.offset.x < -140 || info.velocity.x < -800) vote("skip");
    else if (info.offset.y < -140) requestSuper();
  }

  if (!current) {
    return (
      <div className="rounded-3xl border border-dashed border-line p-10 text-center">
        <p className="display text-4xl">Nothing left to swipe</p>
        <p className="mt-2 text-muted">You judged the whole indie internet. Touch grass, then refresh.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-[640px]">
        {upcoming
          .map((app, i) => <SwipeCard key={app.id} app={app} offset={upcoming.length - i} />)
          .reverse()}
        <AnimatePresence>
          <motion.div
            key={current.id}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={onDragEnd}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, x: 0 }}
          >
            <SwipeCard app={current} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => vote("skip")}
          className="rounded-2xl border border-line py-3 text-sm font-semibold"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={requestSuper}
          className="rounded-2xl bg-foreground py-3 text-sm font-semibold text-background"
        >
          Super $15
        </button>
        <button
          type="button"
          onClick={() => vote("ship")}
          className="rounded-2xl bg-accent py-3 text-sm font-semibold text-accent-fg"
        >
          Ship
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        Super $15 · 10× ELO · 24h front of deck · +500 impressions
      </p>
      {toast ? <p className="mt-3 text-center text-sm">{toast}</p> : null}
      {confirmSuper ? (
        <SuperShipModal
          appName={current.name}
          busy={busy}
          error={superError}
          onClose={() => {
            setConfirmSuper(false);
            setSuperError(null);
          }}
          onConfirm={() => vote("super_ship")}
        />
      ) : null}
    </div>
  );
}
