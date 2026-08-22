"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { RankedApp } from "@/lib/ranking";
import { SwipeCard } from "@/components/SwipeCard";
import { useRouter } from "next/navigation";

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

  const current = deck[0];
  const upcoming = deck.slice(1, 3);

  const vote = useCallback(
    async (direction: Direction) => {
      if (!current || busy) return;
      if (!signedIn) {
        router.push("/login");
        return;
      }
      if (direction === "super_ship") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "super_ship", appId: current.id, amount: 15 }),
        });
        const data = await res.json();
        if (!res.ok) {
          setToast(data.error ?? "Super Ship failed");
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
    [busy, current, router, signedIn],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") vote("ship");
      if (e.key === "ArrowLeft") vote("skip");
      if (e.key === "ArrowUp") vote("super_ship");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vote]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 140 || info.velocity.x > 800) vote("ship");
    else if (info.offset.x < -140 || info.velocity.x < -800) vote("skip");
    else if (info.offset.y < -140) vote("super_ship");
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
          onClick={() => vote("super_ship")}
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
        ← skip · → ship · ↑ super ship
      </p>
      {toast ? <p className="mt-3 text-center text-sm">{toast}</p> : null}
    </div>
  );
}
