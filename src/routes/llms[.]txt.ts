import { createFileRoute } from "@tanstack/react-router";
import { contentDb } from "@/lib/db";
import { SITE } from "@/lib/seo";
import { caseStudies } from "@/content/caseStudies";

async function buildLlmsTxt(): Promise<string> {
  const [landingResult, blogResult] = await Promise.all([
    contentDb.query(
      `select service_slug, service_name, meta_description
       from landing_pages
       where status = 'published'
       order by service_slug`,
    ),
    contentDb.query(
      `select slug, title, description
       from blog_posts
       where status = 'published'
       order by published_at desc
       limit 20`,
    ),
  ]);

  const serviceLines = landingResult.rows.map(
    (r: { service_slug: string; service_name: string; meta_description: string | null }) =>
      `- [${r.service_name}](${SITE.url}/services/${r.service_slug}): ${r.meta_description ?? ""}`,
  );

  const caseStudyLines = caseStudies.map(
    (cs) => `- [${cs.title}](${SITE.url}/case-studies/${cs.slug}): ${cs.summary}`,
  );

  const articleLines = blogResult.rows.map(
    (r: { slug: string; title: string; description: string }) =>
      `- [${r.title}](${SITE.url}/blog/${r.slug}): ${r.description}`,
  );

  return `# Noctix AI

> AI automation agency building voice agents, CRM automations, workflow
> automations, lead generation systems, and dashboards for businesses in the
> US and UK.

Noctix AI designs and builds custom automation systems. We are an agency, not
a software product — every engagement is a system built for one business and
handed over. Typical projects start at $2,500.

## Services
${serviceLines.join("\n")}

## Case studies
${caseStudyLines.join("\n")}

## Articles
${articleLines.join("\n")}

## Contact
- Book a 30-minute automation audit: ${SITE.url}/contact
- Email: hello@noctix.app
`;
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const text = await buildLlmsTxt();
        return new Response(text, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
