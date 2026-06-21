import { Link } from "@tanstack/react-router";
import { Linkedin, Instagram } from "lucide-react";
import { NoctixLogo } from "./NoctixLogo";
import { Ripple } from "@/components/ui/ripple";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 py-12 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-full max-w-2xl opacity-60">
        <Ripple numCircles={6} mainCircleSize={180} mainCircleOpacity={0.14} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-foreground">
              <NoctixLogo />
            </div>
            <p className="mt-4 max-w-xs text-sm text-foreground/50">
              AI agents, automations, and business systems. Built for operators who'd rather ship
              than manage spreadsheets.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialLink
                href="https://www.linkedin.com/company/noctix-ai"
                label="Noctix AI on LinkedIn"
              >
                <Linkedin size={16} />
              </SocialLink>
              <SocialLink
                href="https://www.instagram.com/noctix.app"
                label="Noctix AI on Instagram"
              >
                <Instagram size={16} />
              </SocialLink>
            </div>
          </div>
          <FooterCol
            title="Company"
            items={[
              { label: "Home", to: "/" },
              { label: "Services", to: "/services" },
              { label: "About", to: "/about" },
              { label: "FAQ", to: "/faq" },
              { label: "Contact", to: "/contact" },
            ]}
          />
          <FooterCol
            title="Work"
            items={[
              { label: "Case Studies", to: "/case-studies" },
              { label: "Blog", to: "/blog" },
            ]}
          />
          <FooterCol
            title="Contact"
            items={[
              { label: "Book a Call", to: "/contact" },
              { label: "hello@noctix.app", href: "mailto:hello@noctix.app" },
            ]}
          />
          <FooterCol
            title="Legal"
            items={[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms & Conditions", to: "/terms" },
            ]}
          />
        </div>
        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-foreground/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/35 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {new Date().getFullYear()} Noctix AI — All systems operational</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[var(--lime)] flicker" /> Live
          </div>
        </div>
      </div>
    </footer>
  );
}

type Item = { label: string; to?: string; href?: string };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
        {title}
      </div>
      <ul className="flex flex-col gap-2 text-sm text-foreground/65">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link to={it.to} className="hover:text-[var(--lime)] transition-colors">
                {it.label}
              </Link>
            ) : (
              <a href={it.href} className="hover:text-[var(--lime)] transition-colors">
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center border border-foreground/15 text-foreground/70 transition-colors hover:text-[var(--lime)] hover:border-[var(--lime)]/40"
    >
      {children}
    </a>
  );
}
