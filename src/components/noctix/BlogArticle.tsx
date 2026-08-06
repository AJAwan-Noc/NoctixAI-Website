import { Link } from "@tanstack/react-router";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { Markdown } from "@/lib/markdown";
import { JsonLd } from "@/lib/json-ld";
import { SITE, ogImage } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import type { BlogPost } from "@/lib/blog-server";

const FAQ_HEADING_PATTERN = /^#{1,3}\s*FAQ/i;

function stripTrailingFaq(body: string): string {
  const lines = body.split("\n");
  let cutIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (FAQ_HEADING_PATTERN.test(line) || line === "**FAQ**") {
      cutIndex = i;
      break;
    }
  }
  return cutIndex === -1 ? body : lines.slice(0, cutIndex).join("\n").trimEnd();
}

export function BlogArticle({ post, isPreview = false }: { post: BlogPost; isPreview?: boolean }) {
  const body = post.faq?.length ? stripTrailingFaq(post.body) : post.body;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${SITE.url}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        image: ogImage(post.ogImagePath),
        author: {
          "@type": "Person",
          name: post.authorName,
          ...(post.authorLinkedin ? { url: post.authorLinkedin } : {}),
        },
        publisher: { "@id": `${SITE.url}/#organization` },
        ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
        dateModified: post.updatedAt ?? post.publishedAt,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
      ...(post.faq?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <JsonLd data={schema} />

      {isPreview && (
        <div className="mb-8 border border-[var(--lime)]/40 bg-[var(--lime)]/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lime)]">
          Draft preview — not published, not indexed
        </div>
      )}

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

      <div className="mt-12">
        <Markdown>{body}</Markdown>
      </div>

      {post.externalLinks?.length > 0 && (
        <div className="mt-10 border-t border-foreground/10 pt-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            Sources
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {post.externalLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[var(--lime)] hover:underline"
                >
                  {link.anchor_text || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.authorName && (
        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-6 text-sm text-foreground/60">
          <span className="text-foreground/80">{post.authorName}</span>
          {post.authorBio && <span>— {post.authorBio}</span>}
          {post.authorLinkedin && (
            <a
              href={post.authorLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--lime)] hover:underline"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}

      <p className="mt-3 text-sm text-foreground/50">
        Written and reviewed by Ayaan Awan, founder of Noctix AI. Drafted with AI assistance,
        edited and fact-checked by a human before publication.
      </p>

      {post.faq?.length > 0 && (
        <div className="mt-16 space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          {post.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-display text-lg font-semibold">{item.question}</h3>
              <p className="mt-2 text-foreground/70">{item.answer}</p>
            </div>
          ))}
        </div>
      )}

      {post.internalLinks?.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Related reading</h2>
          <ul className="mt-4 space-y-2">
            {post.internalLinks.map((link) => (
              <li key={link.url}>
                <Link to={link.url} className="text-[var(--lime)] hover:underline">
                  {link.anchor_text || link.url}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

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
  );
}
