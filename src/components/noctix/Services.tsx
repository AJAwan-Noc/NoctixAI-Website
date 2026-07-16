import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MagicCard } from "@/components/ui/magic-card";

const services = [
  {
    code: "S01",
    slug: "ai-voice-agents",
    title: "AI Voice Agents",
    body: "Inbound and outbound voice agents handle calls, bookings, follow-ups, and qualification — 24/7, in your brand voice.",
    points: ["Inbound reception", "Outbound outreach", "Call routing", "Live transfer + booking"],
  },
  {
    code: "S02",
    slug: "chatbots-web-agents",
    title: "AI Chatbots & Web Agents",
    body: "Site-embedded agents that answer, qualify, and book — trained on your services, pricing, and FAQs.",
    points: ["Lead qualification", "Booking inside chat", "WhatsApp / Messenger", "CRM handoff"],
  },
  {
    code: "S03",
    slug: "rag-knowledge-agents",
    title: "RAG Knowledge Agents",
    body: "Internal AI assistants that answer staff questions from your SOPs, contracts, and documents instantly.",
    points: ["Document ingestion", "Vector search", "Slack / Teams bots", "Cited answers"],
  },
  {
    code: "S04",
    slug: "ai-sdr-outreach",
    title: "AI SDR & Outreach",
    body: "Autonomous SDR systems that research, personalize, send, and follow up across email, LinkedIn, and SMS.",
    points: [
      "Lead enrichment",
      "Personalized sequences",
      "Reply detection",
      "Auto-handoff to humans",
    ],
  },
  {
    code: "S05",
    slug: "crm-automations",
    title: "CRM Automations",
    body: "Keep leads, customers, tasks, and pipelines updated automatically across HubSpot, GHL, Pipedrive, or custom CRMs.",
    points: ["Auto-enrichment", "Pipeline updates", "Task creation", "Deduping & cleanup"],
  },
  {
    code: "S06",
    slug: "workflow-automations",
    title: "Workflow Automations",
    body: "Connect every app, database, form, and internal tool into one flow with n8n, Make, and custom code.",
    points: ["n8n + custom nodes", "Database sync", "Webhook orchestration", "Internal portals"],
  },
  {
    code: "S07",
    slug: "lead-gen-systems",
    title: "Lead Generation Systems",
    body: "Find, scrape, enrich, score, and route leads on autopilot — straight into your sales pipeline.",
    points: ["Apollo / Apify scraping", "Enrichment stack", "ICP scoring", "Auto-routing"],
  },
  {
    code: "S08",
    slug: "marketing-automation",
    title: "Marketing Automation",
    body: "Behavior-based email, SMS, and ad flows that segment, nurture, and convert without a marketing team.",
    points: ["Segmentation", "Drip campaigns", "Retargeting triggers", "Attribution tracking"],
  },
  {
    code: "S09",
    slug: "content-creative-ai",
    title: "Content & Creative AI",
    body: "Production pipelines that generate blogs, social posts, ad creative, and video — on brand, at volume.",
    points: ["Blog & SEO content", "Social repurposing", "AI ad creative", "Brand voice training"],
  },
  {
    code: "S10",
    slug: "document-invoice-ai",
    title: "Document & Invoice AI",
    body: "Extract, classify, and route data from PDFs, invoices, contracts, and intake forms — straight into your systems.",
    points: ["OCR + LLM parsing", "Invoice ingestion", "Contract analysis", "Form intake"],
  },
  {
    code: "S11",
    slug: "dashboards-reporting",
    title: "Dashboards & Reporting",
    body: "Real-time visibility into sales, ops, and client performance. Replace weekly status calls with live dashboards.",
    points: ["Client portals", "Looker / Metabase", "KPI alerts", "Auto-reporting"],
  },
  {
    code: "S12",
    slug: "custom-ai-tools",
    title: "Custom AI Tools & Integrations",
    body: "Internal tools, agents, and API integrations built for your specific business processes — no off-the-shelf hacks.",
    points: ["Internal apps", "API-first builds", "Multi-agent systems", "Private LLM stacks"],
  },
];

export function Services() {
  return (
    <section id="services" className="relative py-20 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
              <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> 02 — Systems
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
              Twelve modules.
              <br />
              One operating layer.
            </h2>
          </div>
          <p className="max-w-md text-foreground/60">
            Every system runs solo — but they compound. Stack them and your business runs itself
            while you sleep.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <ServiceCard key={s.code} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  code,
  slug,
  title,
  body,
  points,
  index,
}: {
  code: string;
  slug: string;
  title: string;
  body: string;
  points: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06 }}
    >
      <Link to="/services/$slug" params={{ slug }}>
        <MagicCard className="group relative flex min-h-[340px] flex-col justify-between bg-background/60 p-8 transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
              {code}
            </span>
            <span className="h-2 w-2 bg-[var(--lime)] transition-transform group-hover:scale-150" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/55">{body}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {points.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/40"
                >
                  <span className="h-1 w-1 bg-[var(--lime)]/70" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--lime)] transition-transform duration-500 group-hover:scale-x-100" />
        </MagicCard>
      </Link>
    </motion.div>
  );
}
