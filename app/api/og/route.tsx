import { ImageResponse } from "next/og";
import { getAppByUsername } from "@/lib/ranking";
import { formatMrr } from "@/lib/tiers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") ?? "";
  const app = await getAppByUsername(username);

  const title = app
    ? `RANK #${app.globalRank}: ${app.tier.label.toUpperCase()}`
    : "CLAIM YOUR RANK";
  const mrr = app ? formatMrr(app.mrrAmount) : "$0";
  const handle = app ? `@${app.user.username}` : "@you";
  const badge = app?.isVerified ? "VERIFIED VIA STRIPE" : "UNVERIFIED FLEX";
  const elo = app ? `${app.eloScore.toLocaleString()} ELO` : "1200 ELO";
  const color = app?.tier.color ?? "#F97316";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F172A",
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
          backgroundImage: `radial-gradient(800px 400px at 100% 0%, ${color}55, transparent)`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, letterSpacing: 6, color: "#94A3B8" }}>{handle}</span>
            <span style={{ fontSize: 28, color }}>{badge}</span>
          </div>
          <div
            style={{
              fontSize: 22,
              border: `1px solid ${color}`,
              padding: "8px 16px",
              borderRadius: 999,
              color,
            }}
          >
            HYPE SCORE: {elo}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 36, color: "#CBD5E1", marginTop: 12 }}>
            {app?.name ?? "ShipOrSkip.lol"} · {mrr} MRR
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#64748B" }}>
          <span>shiporskip.lol / claim your rank</span>
          <span>{app?.delusionLabel ?? "Calibrated"}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
