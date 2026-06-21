import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { SplineSceneSection } from "@/components/noctix/SplineSceneSection";
import { Services as ServicesGrid } from "@/components/noctix/Services";
import { Process } from "@/components/noctix/Process";
import { BookingCTA } from "@/components/noctix/BookingCTA";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AuroraText } from "@/components/ui/aurora-text";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Noctix AI" },
      {
        name: "description",
        content:
          "AI voice agents, CRM automations, workflow automations, lead generation, marketing automation, dashboards, and custom AI tools.",
      },
      { property: "og:title", content: "Services — Noctix AI" },
      {
        property: "og:description",
        content: "AI systems that remove manual work from your operations.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteShell>
      <SplineSceneSection />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            01 — What we build
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            <AuroraText>AI systems</AuroraText> that run
            <br />
            the boring half of your business.
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/60">
            Noctix builds practical AI systems for service businesses — voice agents, CRM workflows,
            reporting dashboards, lead pipelines, and marketing automation. Every system is built to
            remove manual work, not add to it.
          </p>
          <MagneticButton>
            <Link to="/contact">
              <ShimmerButton className="mt-8 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                Book a free audit →
              </ShimmerButton>
            </Link>
          </MagneticButton>
        </motion.div>
      </section>
      <ServicesGrid />
      <Process />
      <BookingCTA />
    </SiteShell>
  );
}
