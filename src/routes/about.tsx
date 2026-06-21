import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MagicCard } from "@/components/ui/magic-card";
import { AuroraText } from "@/components/ui/aurora-text";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BorderBeam } from "@/components/ui/border-beam";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Noctix AI" },
      {
        name: "description",
        content:
          "Noctix AI helps businesses replace manual, repetitive work with intelligent systems. Built for operators who would rather ship than manage spreadsheets.",
      },
      { property: "og:title", content: "About — Noctix AI" },
      { property: "og:description", content: "An AI automation studio for operators." },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    code: "P01",
    title: "Practical over flashy",
    body: "Every system we build has to earn its keep — saved hours, recovered leads, cleaner data. We don't ship demos.",
  },
  {
    code: "P02",
    title: "Service-first, not tool-first",
    body: "We start with the workflow, not the software. Tools are picked to fit the operation, never the other way around.",
  },
  {
    code: "P03",
    title: "Owned by operators",
    body: "We hand over documentation, dashboards, and clean systems your team can actually run after we leave.",
  },
  {
    code: "P04",
    title: "AI where it earns it",
    body: "AI shows up where judgement is needed — triage, voice, scoring, summarisation. Everything else is plain automation done well.",
  },
];

function AboutPage() {
  return (
    <SiteShell>
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-20">
        <DotPattern className="opacity-[0.06]" cr={1} width={28} height={28} glow />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            About — Noctix AI
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            We build the <AuroraText>boring</AuroraText>
            <br />
            half of your business.
          </h1>
          <p className="mt-8 max-w-2xl text-foreground/65">
            Noctix AI is an automation and AI development studio. We help businesses replace manual,
            repetitive work with intelligent systems that connect tools, clean data, automate
            workflows, and create better visibility.
          </p>
          <p className="mt-4 max-w-2xl text-foreground/65">
            From AI voice agents to CRM workflows, reporting dashboards, lead generation systems,
            and marketing automation, we build practical AI systems that help businesses move faster
            with less manual effort.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 md:pb-24">
        <div className="grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2">
          {principles.map((p) => (
            <MagicCard key={p.code} className="bg-background/60">
              <div className="p-6 sm:p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                  {p.code}
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/55">{p.body}</p>
              </div>
            </MagicCard>
          ))}
        </div>

        <div className="relative mt-12 overflow-hidden border border-foreground/10 bg-background/40 p-6 sm:p-10 md:mt-16">
          <BorderBeam size={260} duration={14} />
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Ready when you are
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Let's see what's worth automating.
          </h2>
          <MagneticButton>
            <Link to="/contact">
              <ShimmerButton className="mt-6 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                Book a free audit →
              </ShimmerButton>
            </Link>
          </MagneticButton>
        </div>
      </section>
    </SiteShell>
  );
}
