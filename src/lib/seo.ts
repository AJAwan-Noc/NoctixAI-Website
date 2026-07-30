export const SITE = {
  url: "https://noctix.app",
  name: "Noctix AI",
  legalName: "NOCTIX AI (SMC-PRIVATE) LIMITED",
  tagline: "Let Robots Do The Boring Stuff.",
  description:
    "Noctix AI builds AI voice agents, CRM automations, workflows, lead gen, and dashboards for US and UK businesses.",
  defaultOgImage: "/og/noctix-default.png",
  themeColor: "#050810",
  sameAs: ["https://www.linkedin.com/company/noctix-ai", "https://www.instagram.com/noctix.app"],
} as const;

/**
 * Builds a canonical URL for `path` on the apex origin, discarding any
 * query string or hash (and any origin embedded in `path` itself).
 */
export function canonical(path: string): string {
  const withoutHash = path.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  const normalizedPath = withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
  return `${SITE.url}${normalizedPath}`;
}

export function ogImage(path?: string | null): string {
  return `${SITE.url}${path || SITE.defaultOgImage}`;
}
