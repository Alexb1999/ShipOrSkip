import { ImageResponse } from "next/og";
import { getAppByUsername } from "@/lib/ranking";
import { quoteFor } from "@/lib/roasts";
import { formatMrr } from "@/lib/tiers";

export const runtime = "nodejs";

async function avatarDataUri(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") ?? "";
  const app = await getAppByUsername(username);
  const roast = app ? quoteFor(app.tier.slug, app.user.username) : quoteFor("homeless");
  const portraitSrc = await avatarDataUri(roast.voice.portrait);

  const title = app
    ? `RANK #${app.tierRank}: ${app.tier.label.toUpperCase()}`
    : "CLAIM YOUR RANK";
  const mrr = app ? formatMrr(app.mrrAmount) : "$0";
  const handle = app ? `@${app.user.username}` : "@you";
  const badge = app?.isVerified ? "VERIFIED VIA TRUSTMRR" : "UNVERIFIED FLEX";
  const elo = app ? `${app.eloScore.toLocaleString()} ELO` : "1200 ELO";
  const lime = "#C6F03C";
  const tint = app?.tier.color ?? lime;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0C0C0C",
          color: "#F3F1EC",
          padding: "48px",
          fontFamily: "sans-serif",
          borderTop: `12px solid ${tint}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 22, letterSpacing: 6, color: "#9A958C" }}>{handle}</span>
            <span
              style={{
                fontSize: 20,
                marginTop: 8,
                background: lime,
                color: "#111111",
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              {badge}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              border: `1px solid ${tint}`,
              color: tint,
              padding: "8px 16px",
              borderRadius: 999,
            }}
          >
            {`${app?.tier.label ?? "Homeless"} · ${elo}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.05, color: tint }}>{title}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#9A958C", marginTop: 10 }}>
            {`${app?.name ?? "ShipOrSkip.lol"} · ${mrr} MRR`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {portraitSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portraitSrc}
              alt=""
              width={88}
              height={88}
              style={{ width: 88, height: 88, borderRadius: 999, objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 999,
                background: tint,
                color: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              {roast.voice.handle.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 24, lineHeight: 1.3 }}>{`“${roast.quote}”`}</div>
            <div style={{ display: "flex", fontSize: 18, color: "#9A958C", marginTop: 6 }}>
              {`@${roast.voice.handle} · shiporskip.lol`}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
