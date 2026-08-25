"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Note = {
  id: string;
  title: string;
  body: string;
  counterBidUrl: string | null;
  read: boolean;
  createdAt: string;
};

export function Header() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!session?.user) return;
    let cancelled = false;
    const load = async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok || cancelled) return;
      setNotes(await res.json());
    };
    load();
    const id = setInterval(load, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [session?.user]);

  const unread = notes.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="display text-xl text-foreground">
          ShipOrSkip
          <span className="ml-1 bg-accent px-1 font-mono text-[10px] tracking-normal text-accent-fg">.lol</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted sm:gap-5">
          <Link href="/deck" className="hover:text-foreground">
            Swipe
          </Link>
          <Link href="/leaderboard" className="hover:text-foreground">
            Ladder
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <>
              <Link href="/watchlist" className="hidden text-sm text-muted hover:text-foreground sm:inline">
                Watchlist
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative rounded-full border border-line px-3 py-1 font-mono text-xs"
              >
                Pings
                {unread > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-fg">
                    {unread}
                  </span>
                ) : null}
              </button>
              <Link
                href={`/u/${session.user.username}`}
                className="hidden text-sm text-foreground sm:inline"
              >
                @{session.user.username}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                Out
              </button>
            </>
          ) : status === "loading" ? (
            <span className="text-xs text-muted">…</span>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-fg"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
      {open && session?.user ? (
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="max-h-72 overflow-auto rounded-xl border border-line bg-card p-3">
            {notes.length === 0 ? (
              <p className="text-sm text-muted">No dethrones yet. Soft.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="border-b border-line py-2 last:border-0">
                  <p className="text-sm font-semibold">{note.title}</p>
                  <p className="text-xs text-muted">{note.body}</p>
                  {note.counterBidUrl ? (
                    <a
                      href={note.counterBidUrl}
                      className="mt-1 inline-block text-xs underline"
                    >
                      1-click counter-bid
                    </a>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
