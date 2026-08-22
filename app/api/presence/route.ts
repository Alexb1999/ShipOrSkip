import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { heartbeat, getSiteStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getSiteStats();
  return NextResponse.json(stats);
}

export async function POST() {
  const jar = await cookies();
  const existing = jar.get("sos_vid")?.value;
  const visitor = await heartbeat(existing);
  jar.set("sos_vid", visitor.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  const stats = await getSiteStats();
  return NextResponse.json(stats);
}
