import { auth } from "@/auth";
import { DeckEngine } from "@/components/DeckEngine";
import { prisma } from "@/lib/db";
import { getRankedApps } from "@/lib/ranking";

export const dynamic = "force-dynamic";

export default async function DeckPage() {
  const session = await auth();
  const ranked = await getRankedApps();
  const now = new Date();

  let swiped = new Set<string>();
  if (session?.user?.id) {
    const rows = await prisma.swipe.findMany({
      where: { voterUserId: session.user.id },
      select: { appId: true },
    });
    swiped = new Set(rows.map((r) => r.appId));
  }

  const deck = ranked
    .filter((app) => app.user.id !== session?.user?.id && !swiped.has(app.id))
    .sort((a, b) => {
      const aHot = a.superShipUntil && a.superShipUntil > now ? 1 : 0;
      const bHot = b.superShipUntil && b.superShipUntil > now ? 1 : 0;
      return bHot - aHot || a.globalRank - b.globalRank;
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Ship or Skip
      </p>
      <h1 className="display mb-4 text-center text-4xl">Judge the indie internet</h1>
      <DeckEngine initialDeck={deck} signedIn={Boolean(session?.user?.id)} />
    </div>
  );
}
