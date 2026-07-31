import { createFileRoute } from "@tanstack/react-router";
import { contentDb } from "@/lib/db";
import { SITE } from "@/lib/seo";
import { caseStudies } from "@/content/caseStudies";

const ORIGIN = SITE.url;

// Evaluated once at module load, not per-request, so it's stable within a deployment.
const BUILD_DATE = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/case-studies", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/savings-calculator", changefreq: "monthly", priority: "0.6" },
  { path: "/automation-playbook", changefreq: "monthly", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderUrl(entry: {
  loc: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: string;
}): string {
  const lines = [`  <url>`, `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) {
    lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  }
  if (entry.changefreq) {
    lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
  }
  if (entry.priority) {
    lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
  }
  lines.push(`  </url>`);
  return lines.join("\n");
}

async function buildSitemapXml(): Promise<string> {
  const [blogResult, landingResult] = await Promise.all([
    contentDb.query(
      `select slug, published_at from blog_posts where status = 'published' order by published_at desc`,
    ),
    contentDb.query(
      `select service_slug from landing_pages where status = 'published' order by service_slug`,
    ),
  ]);

  const staticUrls = STATIC_PAGES.map((p) =>
    renderUrl({
      loc: `${ORIGIN}${p.path}`,
      lastmod: BUILD_DATE,
      changefreq: p.changefreq,
      priority: p.priority,
    }),
  );

  const postUrls = blogResult.rows.map((r: { slug: string; published_at: string | null }) => {
    // published_at can be NULL — new Date(null-ish).toISOString() throws a
    // RangeError, which would 500 the whole sitemap. Skip lastmod instead.
    let lastmod: string | null = null;
    if (r.published_at) {
      const date = new Date(r.published_at);
      if (!Number.isNaN(date.getTime())) {
        lastmod = date.toISOString().split("T")[0];
      }
    }
    return renderUrl({
      loc: `${ORIGIN}/blog/${r.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: "0.6",
    });
  });

  const serviceUrls = landingResult.rows.map((r: { service_slug: string }) =>
    renderUrl({
      loc: `${ORIGIN}/services/${r.service_slug}`,
      changefreq: "monthly",
      priority: "0.8",
    }),
  );

  const caseStudyUrls = caseStudies.map((cs) =>
    renderUrl({
      loc: `${ORIGIN}/case-studies/${cs.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...serviceUrls, ...caseStudyUrls, ...postUrls].join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = await buildSitemapXml();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
