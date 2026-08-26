/** Live site preview: user screenshot wins; otherwise render their website via thum.io. */
export function appPreviewSrc(app: { websiteUrl: string; screenshotUrl: string | null }): string {
  return (
    app.screenshotUrl ??
    `https://image.thum.io/get/width/1200/crop/900/noanimate/${app.websiteUrl}`
  );
}
