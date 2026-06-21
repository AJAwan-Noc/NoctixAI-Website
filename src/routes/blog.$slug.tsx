import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";
import { getPost } from "@/content/posts";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Noctix AI` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Blog — Noctix AI" }],
  }),
  component: BlogPostPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-[var(--lime)]">
          ← All posts
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
      </div>
    </SiteShell>
  ),
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const paragraphs = post.body.split(/\n\n+/);
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-6 py-20">
        <Link
          to="/blog"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]"
        >
          ← All articles
        </Link>
        <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
          <span className="text-[var(--lime)]">{post.keyword}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          <AuroraText>{post.title}</AuroraText>
        </h1>
        <p className="mt-6 text-lg text-foreground/65">{post.description}</p>

        <div className="mt-12 space-y-6 text-foreground/75 leading-relaxed">
          {paragraphs.map((para: string, i: number) => {
            if (para.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="mt-10 font-display text-2xl font-semibold tracking-tight text-foreground"
                >
                  {para.replace(/^##\s+/, "")}
                </h2>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        <div className="relative mt-16 overflow-hidden border border-foreground/10 bg-background/40 p-10">
          <BorderBeam size={260} duration={14} />
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Want this for your business?
          </div>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
            Book a free automation audit.
          </h3>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 bg-[var(--lime)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground hover:bg-[var(--lime-glow)]"
          >
            Book your audit →
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}
