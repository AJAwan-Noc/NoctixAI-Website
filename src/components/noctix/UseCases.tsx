import { motion } from "framer-motion";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

const cases = [
  {
    tag: "Inbound",
    title: "Missed call recovery",
    body: "Inbound AI agent answers every call, qualifies, and books — even after hours.",
    featured: true,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    tag: "Outbound",
    title: "Cold outreach systems",
    body: "Outbound agents dial, qualify, and route hot leads straight into your CRM.",
    featured: true,
    span: "md:col-span-2",
  },
  {
    tag: "Lead Ops",
    title: "Lead qualification",
    body: "Enrich, score, and route leads in seconds, not days.",
    span: "",
  },
  {
    tag: "CRM",
    title: "CRM cleanup",
    body: "Auto-deduplicate, enrich, and update records across your entire pipeline.",
    span: "",
  },
  {
    tag: "Reports",
    title: "Client dashboards",
    body: "Real-time portals replace weekly status calls.",
    span: "md:col-span-2",
  },
  {
    tag: "Booking",
    title: "Booking automation",
    body: "From first touch to confirmed appointment — automated.",
    span: "",
  },
  {
    tag: "Stack",
    title: "n8n + Postgres ops",
    body: "End-to-end internal ops powered by n8n and custom agents.",
    span: "",
  },
];

export function UseCases() {
  return (
    <section id="cases" className="relative border-t border-foreground/10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> 04 — Field Reports
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Systems we ship.
            </h2>
          </div>
          <p className="max-w-md font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
            A bento of live builds — from voice agents to internal ops stacks.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-4">
          {cases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative ${c.span}`}
            >
              <MagicCard className="h-full border border-foreground/10 bg-background/60">
                {c.featured && <BorderBeam size={200} duration={12} delay={i * 1.5} />}
                <div className="relative flex h-full min-h-[180px] flex-col justify-between p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="border border-[var(--lime)]/40 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--lime)]">
                      {c.tag}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/30">
                      CASE_{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {c.featured && <PixelArt seed={i} />}
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/55">{c.body}</p>
                  </div>
                </div>
              </MagicCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PixelArt({ seed }: { seed: number }) {
  const cells = Array.from({ length: 64 }, (_, i) => {
    const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v) > 0.65;
  });
  return (
    <div className="my-4 grid h-24 grid-cols-8 gap-px md:h-32">
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-[var(--lime)]/80" : "bg-foreground/[0.04]"} />
      ))}
    </div>
  );
}
