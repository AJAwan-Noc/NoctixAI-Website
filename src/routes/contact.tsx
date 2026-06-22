import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { WebsiteLeadForm } from "@/components/noctix/WebsiteLeadForm";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { AuroraText } from "@/components/ui/aurora-text";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Noctix AI" },
      {
        name: "description",
        content:
          "Book a free automation audit with Noctix AI. We'll map what's worth automating and what's not.",
      },
      { property: "og:title", content: "Contact - Noctix AI" },
      { property: "og:description", content: "Book a free automation audit." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="relative mx-auto max-w-5xl overflow-visible px-4 py-16 sm:px-6 md:py-20">
        <Particles className="opacity-50" quantity={50} color="180,140,255" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-4 max-w-full font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)] sm:tracking-[0.4em]">
            Book a free audit
          </div>
          <h1 className="max-w-full overflow-visible break-words pb-1 font-display text-[clamp(2rem,10.5vw,4.5rem)] font-semibold leading-[1.08] tracking-normal sm:tracking-[-0.03em] md:leading-[0.98]">
            Tell us what's
            <br />
            <AuroraText className="pb-1">eating your week.</AuroraText>
          </h1>
          <p className="mt-6 max-w-xl text-foreground/60">
            A short intake - two minutes. We'll come back with where automation will pay off first,
            and where it won't.
          </p>
        </motion.div>

        <div className="relative mt-12 grid min-w-0 gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,1fr)]">
          <div className="relative min-w-0 overflow-hidden border border-foreground/10">
            <BorderBeam size={260} duration={14} />
            <WebsiteLeadForm submitLabel="Submit Details" />
          </div>

          <div className="space-y-6">
            <InfoBlock label="Email" value="hello@noctix.app" />
            <InfoBlock label="Response time" value="Within 24 hours, weekdays" />
            <InfoBlock
              label="Audit format"
              value="30 min call - written follow-up - scoped roadmap"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <MagicCard className="border border-foreground/10 bg-background/40">
      <div className="p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
          {label}
        </div>
        <div className="mt-2 text-sm text-foreground/75">{value}</div>
      </div>
    </MagicCard>
  );
}
