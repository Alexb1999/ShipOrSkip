import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { formatMrr } from "@/lib/tiers";

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/watchlist");
  const rows = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: { app: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="display text-5xl">Shipped watchlist</h1>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="text-muted">Swipe right on the deck to save apps.</p>
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={`/u/${row.app.user.username}`}
              className="block rounded-2xl border border-line bg-card p-4 hover:border-foreground/30"
            >
              <p className="font-semibold">{row.app.name}</p>
              <p className="text-sm text-muted">
                @{row.app.user.username} · {formatMrr(Number(row.app.mrrAmount))} · {row.app.eloScore} ELO
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
