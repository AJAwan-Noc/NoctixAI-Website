import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { SiteShell } from "@/components/noctix/SiteShell";
import { BlogArticle } from "@/components/noctix/BlogArticle";
import { getDraftPreview } from "@/lib/blog-server";

const searchSchema = z.object({
  token: z.string().min(1),
});

export const Route = createFileRoute("/blog/preview/$slug")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ token: search.token }),
  loader: async ({ params, deps }) => {
    const post = await getDraftPreview({ data: { slug: params.slug, token: deps.token } });
    if (!post) throw notFound();
    return post;
  },
  head: () => ({
    meta: [
      { title: "Draft preview — Noctix AI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Preview not found or already resolved</h1>
        <p className="mt-4 text-foreground/60">
          This draft has already been approved, rejected, or the link is wrong.
        </p>
        <Link to="/blog" className="mt-6 inline-block text-[var(--lime)]">
          ← All posts
        </Link>
      </div>
    </SiteShell>
  ),
});

function PreviewPage() {
  const post = Route.useLoaderData();
  return (
    <SiteShell>
      <BlogArticle post={post} isPreview />
    </SiteShell>
  );
}
