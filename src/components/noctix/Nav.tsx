import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NoctixLogo } from "./NoctixLogo";
import { ThemeToggle } from "./ThemeToggle";
import { MagneticButton } from "@/components/ui/magnetic-button";

const links: { to: string; label: string; exact?: boolean }[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "border-b border-foreground/10 bg-background/70 backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-foreground">
        <Link to="/" className="text-foreground" onClick={() => setOpen(false)}>
          <NoctixLogo />
        </Link>

        <nav className="hidden items-center gap-1 font-mono text-[11px] uppercase tracking-[0.25em] md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              activeProps={{ className: "text-[var(--lime)] [&>span]:scale-x-100" }}
              inactiveProps={{ className: "text-foreground/70 hover:text-[var(--lime)]" }}
              className="group relative px-3 py-2 transition-colors"
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-3 -bottom-px h-px origin-center scale-x-0 bg-[var(--lime)] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <MagneticButton>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground hover:border-[var(--lime)] hover:text-[var(--lime)] transition-colors"
            >
              <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> Book Audit
            </Link>
          </MagneticButton>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center border border-foreground/15 text-foreground"
          >
            <span className="block h-0.5 w-4 bg-current" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4 font-mono text-[12px] uppercase tracking-[0.25em]">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={l.exact ? { exact: true } : undefined}
                activeProps={{ className: "text-[var(--lime)]" }}
                inactiveProps={{ className: "text-foreground/80" }}
                onClick={() => setOpen(false)}
                className="border-b border-foreground/5 py-3"
              >
                {l.label}
              </Link>
            ))}
            <ThemeToggle variant="row" />
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-[var(--lime)] px-4 py-3 text-[11px] font-semibold text-white"
            >
              Book Audit →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
