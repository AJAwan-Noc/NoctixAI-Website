import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { MagicCard } from "@/components/ui/magic-card";

const highlights = [
  { code: "01", title: "AI Voice Agents", body: "Voxie answers. Voxo dials. 24/7." },
  { code: "02", title: "CRM & Workflow Automation", body: "Connect your stack. Kill manual work." },
  { code: "03", title: "Lead Gen Systems", body: "Find, qualify, and route on autopilot." },
  { code: "04", title: "Dashboards & Reporting", body: "Real-time visibility, one screen." },
];

export function ServicesTeaser() {
  return (
    <section id="services" className="relative py-20 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-10" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> 02 — What we build
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Four pillars.
              <br />
              Many systems.
            </h2>
          </div>
          <MagneticButton>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-foreground/20 bg-foreground/[0.02] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground hover:border-[var(--lime)] hover:text-[var(--lime)]"
            >
              See all services →
            </Link>
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <MagicCard className="flex min-h-[220px] flex-col justify-between bg-background/60 p-8 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                    / {s.code}
                  </span>
                  <span className="h-2 w-2 bg-[var(--lime)] transition-transform group-hover:scale-150" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-foreground/55">{s.body}</p>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
