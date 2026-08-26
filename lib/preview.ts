/** Live site preview: user screenshot wins; otherwise render their website via mShots. */
export function appPreviewSrc(app: { websiteUrl: string; screenshotUrl: string | null }): string {
  return (
    app.screenshotUrl ??
    `https://s0.wp.com/mshots/v1/${encodeURIComponent(app.websiteUrl)}?w=1200&h=800`
  );
}
