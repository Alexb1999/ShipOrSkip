import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted">
        <p>
          ShipOrSkip
          <span className="text-foreground">.lol</span>
          {" · "}parody. Not affiliated with anyone on this site.
        </p>
        <Link href="/about" className="hover:text-foreground">
          About
        </Link>
      </div>
    </footer>
  );
}
