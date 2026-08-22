import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { TierChip } from "@/components/TierBadge";
import { ProfileActions } from "@/components/ProfileActions";
import { appUrl, getAppByUsername } from "@/lib/ranking";
import { formatMrr } from "@/lib/tiers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const app = await getAppByUsername(username);
  if (!app) return { title: "Not found" };
  const title = `RANK #${app.globalRank}: ${app.tier.label} (${formatMrr(app.mrrAmount)} MRR)`;
  const og = `${appUrl()}/api/og?username=${encodeURIComponent(app.user.username)}`;
  return {
    title: `${app.name} · ShipOrSkip.lol`,
    description: title,
    openGraph: { title, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, images: [og] },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await auth();
  const app = await getAppByUsername(username);
  if (!app) notFound();
  const share = `${appUrl()}/u/${app.user.username}`;
  const mine = session?.user?.id === app.user.id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-line bg-card">
        <div
          className="h-48 bg-cover bg-center"
          style={{
            backgroundImage: app.screenshotUrl
              ? `url(${app.screenshotUrl})`
              : `linear-gradient(135deg, ${app.tier.accent}, ${app.tier.color})`,
          }}
        />
        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-muted">@{app.user.username}</p>
              <h1 className="display text-5xl">{app.name}</h1>
            </div>
            {app.user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={app.user.avatarUrl} alt="" className="h-16 w-16 rounded-full border border-white/20" />
            ) : null}
          </div>
          <p>{app.tagline}</p>
          <div className="flex flex-wrap gap-2">
            <TierChip tier={app.tier} verified={app.isVerified} />
            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs">
              RANK #{app.globalRank} · {formatMrr(app.mrrAmount)} MRR
            </span>
            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs">
              {app.eloScore} ELO
            </span>
            <span className="rounded-full border border-fym/40 px-3 py-1 font-mono text-xs text-fym">
              {app.delusionLabel} ({app.delusionRatio})
            </span>
          </div>
          {app.pitchVideoUrl ? (
            <a href={app.pitchVideoUrl} className="text-sm text-replacing underline" target="_blank" rel="noreferrer">
              Watch the 15s pitch
            </a>
          ) : null}
          <ProfileActions
            shareUrl={share}
            tweetText={`I'm RANK #${app.globalRank}: ${app.tier.label} (${formatMrr(app.mrrAmount)} MRR) on shiporskip.lol`}
            mine={mine}
            verified={app.isVerified}
            username={app.user.username}
          />
          <Link href="/deck" className="block text-sm text-muted underline">
            Swipe the rest of the deck
          </Link>
        </div>
      </div>
    </div>
  );
}
