import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";
import { getCaseStudy } from "@/content/caseStudies";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return study;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Noctix AI` },
          { name: "description", content: loaderData.summary },
          { property: "og:title", content: `${loaderData.title} — Noctix AI` },
          { property: "og:description", content: loaderData.summary },
        ]
      : [{ title: "Case Study — Noctix AI" }],
  }),
  component: CaseStudyPage,
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Case study not found</h1>
        <Link to="/case-studies" className="mt-6 inline-block text-[var(--lime)]">
          ← All case studies
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
      </div>
    </SiteShell>
  ),
});

function CaseStudyPage() {
  const cs = Route.useLoaderData();
  return (
    <SiteShell>
      <article className="mx-auto max-w-4xl px-6 py-20">
        <Link
          to="/case-studies"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]"
        >
          ← All case studies
        </Link>
        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
          {cs.industry}
        </div>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          <AuroraText>{cs.title}</AuroraText>
        </h1>
        <p className="mt-6 text-lg text-foreground/65">{cs.summary}</p>

        <div className="mt-10 grid grid-cols-1 gap-px bg-foreground/10 sm:grid-cols-2">
          <Stat label="Service" value={cs.service} />
          <Stat label="Outcome" value={cs.metric} />
        </div>

        <Section title="The challenge" body={cs.challenge} />
        <Section title="The solution" body={cs.solution} />

        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">What we delivered</h2>
          <ul className="mt-5 space-y-2 text-foreground/70">
            {cs.deliverables.map((d: string) => (
              <li key={d} className="flex gap-3 border-b border-foreground/5 py-2 text-sm">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[var(--lime)]" /> {d}
              </li>
            ))}
          </ul>
        </div>

        <Section title="The result" body={cs.result} />

        <div className="relative mt-16 overflow-hidden border border-foreground/10 bg-background/40 p-10">
          <BorderBeam size={260} duration={14} />
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            Your turn
          </div>
          <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Want a system like this?
          </h3>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 bg-[var(--lime)] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground hover:bg-[var(--lime-glow)]"
          >
            Book a free audit →
          </Link>
        </div>
      </article>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <MagicCard className="bg-background/60">
      <div className="p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
          {label}
        </div>
        <div className="mt-2 text-sm text-foreground/80">{value}</div>
      </div>
    </MagicCard>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-4 whitespace-pre-line text-foreground/70">{body}</p>
    </div>
  );
}
