import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { applySwipeElo } from "@/lib/economy";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to swipe" }, { status: 401 });
  }
  const body = await req.json();
  const appId = String(body.appId ?? "");
  const direction = body.direction as "ship" | "skip" | "super_ship";
  if (!appId || !["ship", "skip"].includes(direction)) {
    return NextResponse.json({ error: "Invalid swipe" }, { status: 400 });
  }

  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });
  if (app.userId === session.user.id) {
    return NextResponse.json({ error: "You cannot swipe your own app" }, { status: 400 });
  }

  const existing = await prisma.swipe.findUnique({
    where: { voterUserId_appId: { voterUserId: session.user.id, appId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Already voted", eloScore: app.eloScore }, { status: 409 });
  }

  await prisma.swipe.create({
    data: { voterUserId: session.user.id, appId, direction },
  });
  if (direction === "ship") {
    await prisma.watchlist.upsert({
      where: { userId_appId: { userId: session.user.id, appId } },
      update: {},
      create: { userId: session.user.id, appId },
    });
  }

  const updated = await applySwipeElo(appId, direction);
  return NextResponse.json({ ok: true, eloScore: updated.eloScore });
}
