import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { FreebieForm } from "@/components/noctix/FreebieForm";

export const Route = createFileRoute("/automation-playbook")({
  head: () => ({
    meta: [
      { title: "The Automation Playbook -- Noctix AI" },
      {
        name: "description",
        content:
          "12 real automation workflows worth building, free. Get the guide sent straight to your inbox.",
      },
    ],
  }),
  component: AutomationPlaybookPage,
});

function AutomationPlaybookPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
          Free guide
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          12 automations <AuroraText>worth building</AuroraText> before you hire for busywork.
        </h1>
        <p className="mt-6 text-lg text-foreground/65">
          The Automation Playbook. Real workflows, not theory. Enter your email and we'll send it
          straight over.
        </p>

        <div className="relative mt-10 overflow-hidden border border-foreground/10 bg-background/40 p-8 sm:p-10">
          <BorderBeam size={260} duration={14} />
          <FreebieForm />
        </div>

        <p className="mt-6 text-xs text-foreground/40">
          One email with your download link. No newsletter, no spam.
        </p>
      </section>
    </SiteShell>
  );
}
