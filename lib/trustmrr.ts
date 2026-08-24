export type TrustMrrProfile = {
  slug: string;
  name: string;
  url: string;
  website: string | null;
  mrr: number;
};

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

export function parseTrustMrrSlug(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const withProto = raw.includes("://") ? raw : `https://${raw}`;
    const url = new URL(withProto);
    if (url.hostname.replace(/^www\./, "") === "trustmrr.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      const i = parts.findIndex((p) => p === "startup" || p === "startups" || p === "s");
      const slug = (i >= 0 ? parts[i + 1] : parts[0])?.replace(/\.md$/i, "");
      if (slug && SLUG_RE.test(slug)) return slug;
      return null;
    }
  } catch {
    // bare slug
  }
  const slug = raw.toLowerCase().replace(/^@/, "").replace(/\.md$/i, "");
  return SLUG_RE.test(slug) ? slug : null;
}

export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const href = url.includes("://") ? url : `https://${url}`;
    return new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function parseMoney(value: string): number | null {
  const n = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function mrrFromUnknown(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const data = (obj.data as Record<string, unknown> | undefined) ?? obj;
  const revenue = data.revenue as Record<string, unknown> | undefined;
  const candidates = [data.mrr, data.currentMrr, data.monthlyRecurringRevenue, revenue?.mrr];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) {
      return c > 100000 && Number.isInteger(c) ? c / 100 : c;
    }
    if (typeof c === "string") {
      const n = parseMoney(c);
      if (n != null) return n;
    }
  }
  return null;
}

function profileFromMarkdown(slug: string, md: string): TrustMrrProfile | null {
  const name = md.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const website = md.match(/-\s*Website:\s*\[.*?\]\((https?:\/\/[^)]+)\)/i)?.[1] ?? null;
  const mrrLine = md.match(/-\s*Current MRR:\s*\$?([\d,]+(?:\.\d+)?)/i)?.[1];
  const mrr = mrrLine ? parseMoney(mrrLine) : null;
  if (!name || mrr == null) return null;
  return {
    slug,
    name,
    url: `https://trustmrr.com/startup/${slug}`,
    website,
    mrr,
  };
}

function profileFromJsonLd(slug: string, html: string): TrustMrrProfile | null {
  const start = html.indexOf('application/ld+json">');
  if (start < 0) return null;
  const jsonStart = start + 'application/ld+json">'.length;
  const jsonEnd = html.indexOf("</script>", jsonStart);
  if (jsonEnd < 0) return null;
  try {
    const parsed = JSON.parse(html.slice(jsonStart, jsonEnd)) as {
      "@graph"?: Array<Record<string, unknown>>;
    };
    const org = parsed["@graph"]?.find((n) => n["@type"] === "Organization");
    if (!org) return null;
    const props = (org.additionalProperty as Array<{ name?: string; value?: number }> | undefined) ?? [];
    const mrrProp = props.find((p) => p.name === "Current MRR");
    if (typeof mrrProp?.value !== "number") return null;
    const name = String(org.name ?? slug);
    const website = typeof org.url === "string" ? org.url : null;
    return {
      slug,
      name,
      url: `https://trustmrr.com/startup/${slug}`,
      website,
      mrr: mrrProp.value,
    };
  } catch {
    return null;
  }
}

async function fromOfficialApi(slug: string): Promise<TrustMrrProfile | null> {
  const key = process.env.TRUSTMRR_API_KEY;
  if (!key) return null;
  const res = await fetch(`https://trustmrr.com/api/v1/startups/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json: unknown = await res.json();
  const mrr = mrrFromUnknown(json);
  if (mrr == null) return null;
  const data = ((json as { data?: Record<string, unknown> }).data ?? json) as Record<string, unknown>;
  return {
    slug,
    name: String(data.name ?? slug),
    url: `https://trustmrr.com/startup/${slug}`,
    website: typeof data.website === "string" ? data.website : typeof data.url === "string" ? data.url : null,
    mrr,
  };
}

export async function fetchTrustMrrProfile(input: string): Promise<TrustMrrProfile> {
  const slug = parseTrustMrrSlug(input);
  if (!slug) throw new Error("Paste a TrustMRR URL like trustmrr.com/startup/your-app");

  const fromApi = await fromOfficialApi(slug);
  if (fromApi) return fromApi;

  const mdRes = await fetch(`https://trustmrr.com/startup/${encodeURIComponent(slug)}.md`, {
    headers: { Accept: "text/markdown, text/plain" },
    cache: "no-store",
  });
  if (mdRes.ok) {
    const profile = profileFromMarkdown(slug, await mdRes.text());
    if (profile) return profile;
  }

  const pageRes = await fetch(`https://trustmrr.com/startup/${encodeURIComponent(slug)}`, {
    headers: { Accept: "text/html" },
    cache: "no-store",
  });
  if (pageRes.ok) {
    const profile = profileFromJsonLd(slug, await pageRes.text());
    if (profile) return profile;
  }

  throw new Error("Couldn't read that TrustMRR profile. Check the URL.");
}
