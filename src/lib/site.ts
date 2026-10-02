/**
 * Site-wide facts used by metadata, structured data, the sitemap and
 * llms.txt. Set NEXT_PUBLIC_SITE_URL to the live domain (e.g.
 * https://baithak.app) so canonical links and share cards point at it.
 */

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE = {
  name: "Baithak",
  url: siteUrl(),
  tagline: "Game night, sorted.",
  description:
    "Party games for friends and family, run from one phone: Imposter, Pictionary, a Family Feud-style game and more, with desi word packs. No app needed.",
  locale: "en_IN",
  language: "en-IN",
} as const;

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
