"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  online: number;
  visitors: number;
};

export function LiveStatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function ping() {
      const res = await fetch("/api/presence", { method: "POST" });
      if (!res.ok || cancelled) return;
      setStats(await res.json());
    }
    ping();
    const id = setInterval(ping, 45000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const online = stats?.online ?? 1;
  const visitors = stats?.visitors ?? 1;

  return (
    <div className="border-b border-line bg-background">
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-2">
        <Link
          href="/about"
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-line bg-card px-4 py-1.5 text-xs text-muted hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1.5 text-[#22c55e]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
            <span className="font-medium">{online.toLocaleString()} online</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span>
            <span className="text-foreground">{visitors.toLocaleString()}</span> visitors since launch
          </span>
          <span className="text-foreground">see stats →</span>
        </Link>
      </div>
    </div>
  );
}
