import { createServerFn } from "@tanstack/react-start";
import { contentDb } from "@/lib/db";

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  readTime: string;
};

export type BlogFaqItem = { question: string; answer: string };

export type BlogPost = BlogPostSummary & {
  body: string;
  metaTitle: string;
  metaDescription: string;
  faq: BlogFaqItem[];
  authorName: string;
  authorBio: string;
  authorLinkedin: string | null;
  publishedAt: string | null;
};

// Used on /blog — published posts only, newest first.
export const getPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPostSummary[]> => {
    const { rows } = await contentDb.query(
      `select slug, title, description, keyword, read_time as "readTime"
       from blog_posts
       where status = 'published'
       order by published_at desc`,
    );
    return rows;
  },
);

// Used on /blog/$slug — a single published post.
export const getPostBySlug = createServerFn({ method: "GET" })
  .validator((slug: unknown) => {
    if (typeof slug !== "string" || slug.length === 0) {
      throw new Error("slug must be a non-empty string");
    }
    return slug;
  })
  .handler(async ({ data: slug }): Promise<BlogPost | null> => {
    const { rows } = await contentDb.query(
      `select
         slug, title, description, keyword, read_time as "readTime",
         body, meta_title as "metaTitle", meta_description as "metaDescription",
         faq, author_name as "authorName", author_bio as "authorBio",
         author_linkedin as "authorLinkedin", published_at as "publishedAt"
       from blog_posts
       where slug = $1 and status = 'published'
       limit 1`,
      [slug],
    );
    return rows[0] ?? null;
  });

// Used on /blog/preview/$slug — a draft, gated by its approval token.
// Naturally stops working the moment the post is approved or rejected,
// since the WHERE clause requires status = 'draft'.
export const getDraftPreview = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const { slug, token } = (input ?? {}) as { slug?: unknown; token?: unknown };
    if (typeof slug !== "string" || typeof token !== "string" || !slug || !token) {
      throw new Error("slug and token are required");
    }
    return { slug, token };
  })
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { rows } = await contentDb.query(
      `select
         slug, title, description, keyword, read_time as "readTime",
         body, meta_title as "metaTitle", meta_description as "metaDescription",
         faq, author_name as "authorName", author_bio as "authorBio",
         author_linkedin as "authorLinkedin", published_at as "publishedAt"
       from blog_posts
       where slug = $1 and approval_token = $2 and status = 'draft'
       limit 1`,
      [data.slug, data.token],
    );
    return rows[0] ?? null;
  });
