import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/noctix/SiteShell";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";
import { AuroraText } from "@/components/ui/aurora-text";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Noctix AI" },
      {
        name: "description",
        content:
          "Book a free automation audit with Noctix AI. We'll map what's worth automating and what's not.",
      },
      { property: "og:title", content: "Contact — Noctix AI" },
      { property: "og:description", content: "Book a free automation audit." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-20">
        <Particles className="opacity-50" quantity={50} color="180,140,255" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Book a free audit
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Tell us what's
            <br />
            <AuroraText>eating your week.</AuroraText>
          </h1>
          <p className="mt-6 max-w-xl text-foreground/60">
            A short intake — five questions, two minutes. We'll come back with where automation will
            pay off first, and where it won't.
          </p>
        </motion.div>

        <div className="relative mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="relative space-y-5 overflow-hidden border border-foreground/10 bg-background/50 p-6 sm:p-8"
          >
            <BorderBeam size={260} duration={14} />
            {sent ? (
              <div className="py-10 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                  Received
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold">
                  We'll be in touch within 24 hours.
                </h3>
              </div>
            ) : (
              <>
                <Field label="Name" name="name" />
                <Field label="Work email" name="email" type="email" />
                <Field label="Company" name="company" />
                <Field label="What does your business do?" name="business" />
                <Field
                  label="What's the most repetitive task you'd remove tomorrow?"
                  name="task"
                  textarea
                />
                <MagneticButton>
                  <ShimmerButton
                    type="submit"
                    className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]"
                  >
                    Send →
                  </ShimmerButton>
                </MagneticButton>
              </>
            )}
          </form>

          <div className="space-y-6">
            <InfoBlock label="Email" value="hello@noctix.app" />
            <InfoBlock label="Response time" value="Within 24 hours, weekdays" />
            <InfoBlock
              label="Audit format"
              value="30 min call · written follow-up · scoped roadmap"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
        {label}
      </div>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className="w-full border border-foreground/10 bg-background/60 px-3 py-3 text-sm text-foreground outline-none focus:border-[var(--lime)]"
        />
      ) : (
        <input
          name={name}
          type={type}
          className="w-full border border-foreground/10 bg-background/60 px-3 py-3 text-sm text-foreground outline-none focus:border-[var(--lime)]"
        />
      )}
    </label>
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
