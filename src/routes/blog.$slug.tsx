import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";
import { BlogArticle } from "@/components/noctix/BlogArticle";
import { getPostBySlug } from "@/lib/blog-server";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: params.slug });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.metaTitle || loaderData.title} — Noctix AI` },
          {
            name: "description",
            content: loaderData.metaDescription || loaderData.description,
          },
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
  return (
    <SiteShell>
      <BlogArticle post={post} />
    </SiteShell>
  );
}
