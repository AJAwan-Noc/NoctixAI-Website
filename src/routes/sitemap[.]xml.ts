import { createFileRoute } from "@tanstack/react-router";
import { contentDb } from "@/lib/db";

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.9" },
  { path: "/case-studies", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },
];

async function buildSitemapXml(): Promise<string> {
  const { rows } = await contentDb.query(
    `select slug, published_at from blog_posts where status = 'published' order by published_at desc`
  );

  const staticUrls = STATIC_PAGES.map(
    (p) => `  <url>
    <loc>https://noctix.app${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  );

  const postUrls = rows.map(
    (r: { slug: string; published_at: string }) => `  <url>
    <loc>https://noctix.app/blog/${r.slug}</loc>
    <lastmod>${new Date(r.published_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = await buildSitemapXml();
        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
