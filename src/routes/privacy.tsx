import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Noctix AI" },
      {
        name: "description",
        content: "How Noctix AI handles your information when you use this website or contact us.",
      },
      { property: "og:title", content: "Privacy Policy — Noctix AI" },
      { property: "og:description", content: "How Noctix AI handles your information." },
    ],
  }),
  component: PrivacyPage,
});

const EFFECTIVE_DATE = "June 21, 2026";

function PrivacyPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
          Legal
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-foreground/55">Effective {EFFECTIVE_DATE}</p>
        <p className="mt-2 text-sm text-foreground/55">
          This page is maintained by Noctix AI to explain how we handle information collected
          through this website.
        </p>

        <div className="mt-10 space-y-8 text-foreground/75 leading-relaxed">
          <Section title="1. Introduction">
            Noctix AI ("we", "us") operates this website. This policy describes what we collect,
            why, and the choices you have. It is not a substitute for legal advice and may be
            updated as our services evolve.
          </Section>

          <Section title="2. Information we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-foreground">Contact form submissions.</strong> Name, work
                email, company, and the details you choose to share when you book an audit or send
                us a message.
              </li>
              <li>
                <strong className="text-foreground">Basic technical data.</strong> Standard request
                data such as IP address, browser type, and pages viewed, used only for security and
                aggregate site health.
              </li>
              <li>
                <strong className="text-foreground">Preferences.</strong> Theme preference and your
                cookie choice, stored locally on your device.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use it">
            To respond to your inquiry, schedule and prepare for audit calls, send follow-ups you've
            asked for, and maintain the site. We do not sell or rent your information.
          </Section>

          <Section title="4. Cookies & local storage" id="cookies">
            We use a small number of first-party items stored on your device. We do not use
            third-party advertising or cross-site tracking cookies.
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <code className="font-mono text-xs text-foreground">noctix-theme</code> — remembers
                your light/dark preference.
              </li>
              <li>
                <code className="font-mono text-xs text-foreground">noctix-cookie-consent</code> —
                remembers your response to the cookie banner so we don't ask again.
              </li>
            </ul>
            <p className="mt-3">
              You can clear these any time via your browser's site-data controls.
            </p>
          </Section>

          <Section title="5. Third parties">
            We may use reputable infrastructure providers to host the site and deliver email. These
            providers process data on our behalf under their own security commitments. We will
            update this section if we add analytics or other third-party tools.
          </Section>

          <Section title="6. Your rights">
            You may request access to, correction of, or deletion of personal information you've
            shared with us. Email{" "}
            <a
              href="mailto:hello@noctix.app"
              className="text-foreground underline decoration-[var(--lime)]/50 underline-offset-4 hover:decoration-[var(--lime)]"
            >
              hello@noctix.app
            </a>{" "}
            and we'll respond within a reasonable timeframe.
          </Section>

          <Section title="7. Data retention">
            We retain inquiry records for as long as needed to serve the relationship and meet
            ordinary business and legal requirements, then delete or anonymize them.
          </Section>

          <Section title="8. Children">
            This website is not directed to children under 13, and we do not knowingly collect their
            information.
          </Section>

          <Section title="9. Changes">
            We may update this policy. Material changes will be reflected by updating the effective
            date above.
          </Section>

          <Section title="10. Contact">
            Questions about this policy?{" "}
            <a
              href="mailto:hello@noctix.app"
              className="text-foreground underline decoration-[var(--lime)]/50 underline-offset-4 hover:decoration-[var(--lime)]"
            >
              hello@noctix.app
            </a>
            .
          </Section>
        </div>
      </article>
    </SiteShell>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-sm">{children}</div>
    </section>
  );
}
