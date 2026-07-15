import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { SimpleLeadForm } from "@/components/noctix/SimpleLeadForm";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { getLandingPage } from "@/lib/landing-pages-server";
import type { LandingPageData, LandingPageFaqItem } from "@/lib/landing-pages-server";

const searchSchema = z.object({
  audience: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/services/$slug")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ audience: search.audience }),
  loader: async ({ params, deps }) => {
    const page = await getLandingPage({
      data: { slug: params.slug, audience: deps.audience },
    });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.serviceName} — Noctix AI` },
          {
            name: "description",
            content: loaderData.subheadline,
          },
          { property: "og:title", content: `${loaderData.serviceName} — Noctix AI` },
          { property: "og:description", content: loaderData.subheadline },
        ]
      : [{ title: "Service — Noctix AI" }],
  }),
  component: ServiceLandingPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Service not found</h1>
        <Link to="/services" className="mt-6 inline-block text-[var(--lime)]">
          ← All services
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

function ServiceLandingPage() {
  const page = Route.useLoaderData();

  const faqSchema = page.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <SiteShell>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. Hero */}
      <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            {page.serviceName}
          </div>
          <h1 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            <AuroraText>{page.headline}</AuroraText>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/65">
            {page.subheadline}
          </p>
          <a
            href="#get-started"
            className="mt-8 inline-flex items-center gap-2 bg-[var(--lime)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-[var(--lime-glow)]"
          >
            Get started →
          </a>
        </motion.div>
      </section>

      {/* 2. Trust strip */}
      {page.proofText && (
        <section className="border-y border-foreground/10 bg-foreground/[0.02]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-start gap-4"
            >
              <span className="mt-1 h-2 w-2 shrink-0 bg-[var(--lime)]" />
              <p className="text-sm leading-relaxed text-foreground/65">
                {page.proofText}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. The problem */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            The problem
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground/70">
            {page.problemText}
          </p>
        </motion.div>
      </section>

      {/* 4. The fix */}
      <section className="border-t border-foreground/10">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              The fix
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/70">
              {page.solutionText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. How it works */}
      {page.howItWorks.length > 0 && (
        <section className="border-t border-foreground/10">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-12 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              How it works
            </div>
            <div className="grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-3">
              {page.howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <MagicCard className="flex h-full flex-col bg-background/60 p-8">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                      Step 0{step.step}
                    </span>
                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/55">
                      {step.description}
                    </p>
                  </MagicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. FAQ */}
      {page.faq.length > 0 && (
        <section className="border-t border-foreground/10">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
            <div className="mb-10 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              FAQ
            </div>
            <div className="space-y-8">
              {page.faq.map((item: LandingPageFaqItem) => (
                <div key={item.question}>
                  <h3 className="font-display text-lg font-semibold">{item.question}</h3>
                  <p className="mt-2 text-foreground/70">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Final CTA + form */}
      <section
        id="get-started"
        className="border-t border-foreground/10"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_minmax(300px,420px)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
                Get started
              </div>
              <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                Ready to see how this works for your business?
              </h2>
              <p className="mt-4 max-w-md text-foreground/60">
                Fill in the short form. We'll review your situation and come back with
                a concrete recommendation — not a sales pitch.
              </p>
            </motion.div>
            <div className="relative overflow-hidden border border-foreground/10 bg-background/40 p-6 sm:p-8">
              <BorderBeam size={200} duration={14} />
              <SimpleLeadForm
                serviceNeeded={page.serviceName}
                submitLabel="Request a free audit"
                successMessage="We'll review your details and be in touch within 24 hours."
                fields={["company_name", "message"]}
              />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
