import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/ranking";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl();
  const paths = ["/", "/deck", "/leaderboard", "/about", "/submit", "/terms", "/privacy"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "/" || path === "/leaderboard" ? "hourly" : "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
