const PROTOCOL_RE = /^https?:\/\//;

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return `https://${explicit.replace(PROTOCOL_RE, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/** Absolute base URL of the deployed docs site, for metadata and sitemaps. */
export const siteUrl = resolveSiteUrl();

export const siteName = "Strait UI";
