import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { getPublishedPosts } from "@/lib/blog-server";
import { MagicCard } from "@/components/ui/magic-card";
import { AuroraText } from "@/components/ui/aurora-text";

const searchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => getPublishedPosts({ data: deps.page }),
  head: () => ({
    meta: [
      { title: "Blog — Noctix AI" },
      {
        name: "description",
        content:
          "Practical guides on AI automation, voice agents, CRM workflows, lead generation, and marketing automation.",
      },
      { property: "og:title", content: "Blog — Noctix AI" },
      { property: "og:description", content: "Field notes from Noctix AI." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts, page, totalPages } = Route.useLoaderData();
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Field notes
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Notes on <AuroraText>automation</AuroraText>,<br />
            AI, and operations.
          </h1>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2">
          {posts.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
            >
              <MagicCard className="group h-full bg-background/60">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                      <span>{p.keyword}</span>
                      <span className="text-foreground/40">{p.readTime}</span>
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-semibold leading-tight tracking-tight">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-sm text-foreground/55">{p.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lime)]">
                      Read article →
                    </div>
                  </div>
                </Link>
              </MagicCard>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link
                to="/blog"
                search={{ page: page - 1 }}
                className="border border-foreground/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)]"
              >
                ← Previous
              </Link>
            ) : (
              <span className="border border-foreground/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/25 cursor-not-allowed">
                ← Previous
              </span>
            )}

            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
              Page <span className="text-[var(--lime)]">{page}</span> of {totalPages}
            </span>

            {page < totalPages ? (
              <Link
                to="/blog"
                search={{ page: page + 1 }}
                className="border border-foreground/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)]"
              >
                Next →
              </Link>
            ) : (
              <span className="border border-foreground/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/25 cursor-not-allowed">
                Next →
              </span>
            )}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
