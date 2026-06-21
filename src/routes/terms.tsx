import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/noctix/SiteShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Noctix AI" },
      { name: "description", content: "Terms governing your use of the Noctix AI website." },
      { property: "og:title", content: "Terms & Conditions — Noctix AI" },
      { property: "og:description", content: "Terms governing use of the Noctix AI website." },
    ],
  }),
  component: TermsPage,
});

const EFFECTIVE_DATE = "June 21, 2026";

function TermsPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
          Legal
        </div>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          Terms & Conditions
        </h1>
        <p className="mt-4 text-sm text-foreground/55">Effective {EFFECTIVE_DATE}</p>
        <p className="mt-2 text-sm text-foreground/55">
          This page is maintained by Noctix AI and governs use of this website.
        </p>

        <div className="mt-10 space-y-8 text-foreground/75 leading-relaxed">
          <Section title="1. Acceptance">
            By accessing or using this website, you agree to these Terms. If you don't agree, please
            don't use the site.
          </Section>

          <Section title="2. Use of the site">
            You agree to use the site lawfully and not to attempt to disrupt, scrape at scale,
            reverse-engineer, or gain unauthorized access to any part of it.
          </Section>

          <Section title="3. Intellectual property">
            The Noctix AI name, logo, copy, design, and all site content are owned by Noctix AI or
            its licensors. Nothing on this site grants you a license to reuse our brand or content
            without written permission.
          </Section>

          <Section title="4. Services & engagements">
            Information about our services on this site is for general orientation only. Any actual
            engagement — scope, deliverables, fees, timelines, and confidentiality — is governed by
            a separate written agreement signed by both parties. Nothing on this site constitutes an
            offer or guarantee of results.
          </Section>

          <Section title="5. Disclaimers">
            The site is provided "as is" without warranties of any kind, express or implied,
            including merchantability, fitness for a particular purpose, and non-infringement. We do
            our best to keep things accurate and online, but we don't warrant uninterrupted or
            error-free operation.
          </Section>

          <Section title="6. Limitation of liability">
            To the maximum extent permitted by law, Noctix AI is not liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of your use of the
            site.
          </Section>

          <Section title="7. Third-party links">
            The site may link to third-party services (e.g., social media). We aren't responsible
            for their content or practices.
          </Section>

          <Section title="8. Governing law">
            These Terms are governed by the laws of the jurisdiction in which Noctix AI is
            established, without regard to its conflict-of-laws principles.
          </Section>

          <Section title="9. Changes">
            We may revise these Terms. Continued use of the site after changes are posted
            constitutes acceptance.
          </Section>

          <Section title="10. Contact">
            Questions?{" "}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-sm">{children}</div>
    </section>
  );
}
