import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SITE, canonical, ogImage } from "@/lib/seo";
import { SiteShell } from "@/components/noctix/SiteShell";
import { Reveal } from "@/components/noctix/Reveal";
import { caseStudies } from "@/content/caseStudies";
import { MagicCard } from "@/components/ui/magic-card";
import { AuroraText } from "@/components/ui/aurora-text";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies — Noctix AI" },
      {
        name: "description",
        content:
          "Real Noctix AI builds — automation, AI voice agents, CRM workflows, and reporting systems shipped for operators.",
      },
      { property: "og:title", content: "Case Studies — Noctix AI" },
      { property: "og:description", content: "Selected work from Noctix AI." },
      { property: "og:url", content: canonical("/case-studies") },
      { property: "og:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: canonical("/case-studies") }],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-accent-text">
            Selected work
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            <AuroraText>Systems</AuroraText> we've shipped.
          </h1>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} delay={(i % 2) * 0.06}>
              <MagicCard className="group h-full bg-background/60">
                <Link to="/case-studies/$slug" params={{ slug: cs.slug }} className="block">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-text">
                        {cs.industry}
                      </span>
                      <span className="h-2 w-2 bg-[var(--lime)] transition-transform group-hover:scale-150" />
                    </div>
                    <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                      {cs.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{cs.summary}</p>
                    <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                      {cs.metric}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent-text">
                      Read case study →
                    </div>
                  </div>
                </Link>
              </MagicCard>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
