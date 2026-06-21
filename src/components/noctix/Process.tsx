import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

const steps = [
  {
    n: 1,
    title: "Audit",
    body: "We map your current operations, tools, and the work that's eating your team's time.",
  },
  {
    n: 2,
    title: "Map the Repetitive Work",
    body: "Every recurring task, missed call, and manual handoff gets documented and prioritized.",
  },
  {
    n: 3,
    title: "Build the System",
    body: "We build agents, workflows, and integrations tailored to how your business actually runs.",
  },
  {
    n: 4,
    title: "Deploy the AI Agents",
    body: "Go live with Voxie, Voxo, and the automation stack — connected to your CRM and tools.",
  },
  {
    n: 5,
    title: "Monitor, Improve, Scale",
    body: "Dashboards track performance. We tune, expand, and add new agents as you grow.",
  },
];

export function Process() {
  return (
    <section id="process" className="relative border-t border-foreground/10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 md:mb-20">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> 03 — Mission Sequence
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
            How we deploy.
          </h2>
        </div>

        <div className="relative">
          {/* Animated beam line */}
          <div className="absolute left-[11px] top-0 h-full w-px overflow-hidden md:left-1/2">
            <div className="h-full w-full bg-foreground/10" />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute inset-0 bg-gradient-to-b from-[var(--lime)] via-[var(--lime-glow)] to-transparent"
            />
          </div>

          <div className="flex flex-col gap-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className={`relative grid grid-cols-[24px_1fr] gap-6 md:grid-cols-2 md:gap-12 ${
                  i % 2 === 1
                    ? "md:[&>*:nth-child(2)]:order-first md:[&>*:nth-child(2)]:text-right"
                    : ""
                }`}
              >
                <div className="relative flex justify-start md:justify-end md:pr-8">
                  <span className="absolute left-[5px] top-2 h-3 w-3 bg-[var(--lime)] lime-glow md:left-auto md:right-[-30px]" />
                  <span className="hidden md:flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                    Step{" "}
                    <span className="text-[var(--lime)] text-base">
                      0<NumberTicker value={s.n} />
                    </span>
                  </span>
                </div>
                <div className="md:pl-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)] md:hidden">
                    Step 0{s.n}
                  </div>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md text-foreground/55 md:max-w-none">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
