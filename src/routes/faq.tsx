import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

import { SiteShell } from "@/components/noctix/SiteShell";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ - Noctix AI" },
      {
        name: "description",
        content:
          "Answers to common questions about Noctix AI services, automation projects, AI voice agents, pricing, timelines, and support.",
      },
      { property: "og:title", content: "FAQ - Noctix AI" },
      {
        property: "og:description",
        content: "Common questions about Noctix AI automations, AI agents, and business systems.",
      },
    ],
  }),
  component: FAQPage,
});

type FAQEntry = {
  question: string;
  answer: string;
};

type FAQProps = {
  title?: string;
  subtitle?: string;
  categories: Record<string, string>;
  faqData: Record<string, FAQEntry[]>;
  className?: string;
};

const faqCategories = {
  general: "General",
  services: "Services",
  process: "Process",
  pricing: "Pricing",
};

const faqData = {
  general: [
    {
      question: "What does Noctix AI actually do?",
      answer:
        "We build practical AI systems for businesses: voice agents, CRM workflows, reporting dashboards, lead pipelines, internal tools, and automations that remove repetitive work.",
    },
    {
      question: "Who do you work best with?",
      answer:
        "We work best with service businesses, agencies, operators, and teams that already have repeatable workflows but still rely on manual follow-ups, spreadsheets, inbox triage, or disconnected tools.",
    },
    {
      question: "Do we need to know exactly what to automate first?",
      answer:
        "No. The audit is designed to find that. We map the workflow, identify the highest-leverage bottlenecks, and separate what should be automated from what should stay human.",
    },
  ],
  services: [
    {
      question: "Can you build AI voice agents?",
      answer:
        "Yes. We can build voice agents for intake, qualification, booking, reminders, customer support, and follow-up workflows, with handoff rules when a person should step in.",
    },
    {
      question: "Can you connect our existing tools?",
      answer:
        "Usually, yes. We commonly connect CRMs, forms, calendars, email, spreadsheets, databases, dashboards, and communication tools so information moves without manual copying.",
    },
    {
      question: "Do you build custom dashboards and internal tools?",
      answer:
        "Yes. When teams need visibility or a cleaner operating layer, we build dashboards, internal portals, and lightweight tools around the process instead of forcing the process into a generic template.",
    },
  ],
  process: [
    {
      question: "What happens after we book an audit?",
      answer:
        "We review your intake, run a short discovery call, map the workflow, and send back a practical roadmap with the first systems worth building.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Small automations can move quickly. More involved systems usually take a few weeks depending on integrations, approvals, testing, and how much operational logic needs to be captured.",
    },
    {
      question: "Will our team know how to use it afterwards?",
      answer:
        "Yes. We hand over documentation, walkthroughs, and operating notes so your team can use the system confidently after launch.",
    },
  ],
  pricing: [
    {
      question: "How much does it cost?",
      answer:
        "Pricing depends on scope, integrations, and complexity. After the audit, we recommend a clear first build so you know what it costs before committing.",
    },
    {
      question: "Do you offer ongoing support?",
      answer:
        "Yes. Some clients only need a launch package, while others keep us on for iteration, monitoring, reporting changes, and new automation ideas as the business grows.",
    },
    {
      question: "Can we start small?",
      answer:
        "Absolutely. We prefer starting with one useful workflow that proves value quickly, then expanding only when the system is earning its keep.",
    },
  ],
};

function FAQPage() {
  return (
    <SiteShell>
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <DotPattern className="opacity-[0.06]" cr={1} width={28} height={28} glow />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            FAQ
          </div>
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            Questions before
            <br />
            <AuroraText>the robots start.</AuroraText>
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/60">
            Straight answers about how Noctix plans, builds, launches, and supports AI systems for
            real business workflows.
          </p>
        </motion.div>
      </section>

      <FAQ
        title="Frequently Asked Questions"
        subtitle="What people ask us most"
        categories={faqCategories}
        faqData={faqData}
      />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-24">
        <div className="relative overflow-hidden border border-foreground/10 bg-background/40 p-6 sm:p-10">
          <BorderBeam size={260} duration={14} />
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Still unsure?
          </div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Bring us the messy workflow.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-foreground/60">
            We will help you decide what is worth automating, what needs a person, and what should
            be left alone.
          </p>
          <MagneticButton>
            <Link to="/contact">
              <ShimmerButton className="mt-6 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                Book a free audit
              </ShimmerButton>
            </Link>
          </MagneticButton>
        </div>
      </section>
    </SiteShell>
  );
}

function FAQ({
  title = "FAQs",
  subtitle = "Frequently Asked Questions",
  categories,
  faqData,
  className,
}: FAQProps) {
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] ?? "");

  return (
    <section
      className={cn("relative overflow-hidden px-4 pb-16 text-foreground sm:px-6", className)}
    >
      <FAQHeader title={title} subtitle={subtitle} />
      <FAQTabs
        categories={categories}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <FAQList faqData={faqData} selected={selectedCategory} />
    </section>
  );
}

function FAQHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
      <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--lime)]">
        {subtitle}
      </span>
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <span className="pointer-events-none absolute -top-40 left-1/2 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--lime)]/10 blur-3xl" />
    </div>
  );
}

function FAQTabs({
  categories,
  selected,
  setSelected,
}: {
  categories: Record<string, string>;
  selected: string;
  setSelected: (category: string) => void;
}) {
  return (
    <div className="relative z-10 mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-3">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setSelected(key)}
          className={cn(
            "relative overflow-hidden whitespace-nowrap rounded-md border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300",
            selected === key
              ? "border-[var(--lime)] text-background"
              : "border-foreground/10 bg-background/35 text-foreground/60 hover:border-[var(--lime)]/40 hover:text-[var(--lime)]",
          )}
        >
          <span className="relative z-10">{label}</span>
          <AnimatePresence>
            {selected === key && (
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 z-0 bg-[var(--lime)]"
              />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
}

function FAQList({ faqData, selected }: { faqData: Record<string, FAQEntry[]>; selected: string }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <AnimatePresence mode="wait">
        {Object.entries(faqData).map(([category, questions]) => {
          if (selected !== category) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              {questions.map((faq) => (
                <FAQItem key={faq.question} {...faq} />
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function FAQItem({ question, answer }: FAQEntry) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "overflow-hidden rounded-md border border-foreground/10 transition-colors",
        isOpen ? "bg-background/65" : "bg-background/35",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
      >
        <span
          className={cn(
            "text-base font-medium transition-colors sm:text-lg",
            isOpen ? "text-foreground" : "text-foreground/70",
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: 45 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/10 text-foreground/60"
        >
          <Plus className={cn("h-4 w-4 transition-colors", isOpen && "text-[var(--lime)]")} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          marginBottom: isOpen ? 20 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4 sm:px-5"
      >
        <p className="max-w-2xl text-sm leading-6 text-foreground/60">{answer}</p>
      </motion.div>
    </motion.div>
  );
}
