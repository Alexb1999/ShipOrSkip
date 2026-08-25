import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const tagline = String(body.tagline ?? "").trim();
  let websiteUrl = String(body.websiteUrl ?? "").trim();
  if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
    websiteUrl = `https://${websiteUrl}`;
  }
  const pitchVideoUrl = String(body.pitchVideoUrl ?? "").trim() || null;
  const screenshotUrl = String(body.screenshotUrl ?? "").trim() || null;
  const techStack = String(body.techStack ?? "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);
  const mrrAmount = Math.max(0, Number(body.mrrAmount ?? 0));

  if (!name || !tagline || !websiteUrl) {
    return NextResponse.json({ error: "Name, tagline, and website are required" }, { status: 400 });
  }

  const existing = await prisma.app.findUnique({ where: { userId: session.user.id } });
  const mrrChanged = existing ? Number(existing.mrrAmount) !== mrrAmount : false;
  const siteChanged = existing ? existing.websiteUrl !== websiteUrl : false;
  const dropProof = mrrChanged || siteChanged;

  if (existing && mrrChanged) {
    const pendingBs = await prisma.challenge.findFirst({
      where: { targetAppId: existing.id, status: "pending" },
      select: { id: true },
    });
    if (pendingBs) {
      return NextResponse.json(
        { error: "Your MRR is locked while a Call BS challenge is live. Prove it on TrustMRR or ride out the 48h." },
        { status: 403 },
      );
    }
  }

  const app = await prisma.app.upsert({
    where: { userId: session.user.id },
    update: {
      name,
      tagline,
      websiteUrl,
      pitchVideoUrl,
      screenshotUrl,
      techStack,
      mrrAmount: new Prisma.Decimal(mrrAmount),
      ...(dropProof
        ? {
            isVerified: false,
            trustMrrSlug: null,
            trustMrrUrl: null,
            verifiedMrr: null,
            verifiedAt: null,
          }
        : {}),
    },
    create: {
      userId: session.user.id,
      name,
      tagline,
      websiteUrl,
      pitchVideoUrl,
      screenshotUrl,
      techStack,
      mrrAmount: new Prisma.Decimal(mrrAmount),
    },
  });

  return NextResponse.json({ ok: true, id: app.id, username: session.user.username });
}
