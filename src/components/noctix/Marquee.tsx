const items = [
  "AI VOICE AGENTS",
  "CRM AUTOMATIONS",
  "WORKFLOWS",
  "LEAD GENERATION",
  "MARKETING AUTOMATION",
  "DASHBOARDS",
  "CUSTOM AI TOOLS",
  "API INTEGRATIONS",
];

export function Marquee() {
  const all = [...items, ...items];
  return (
    <div className="group relative w-full overflow-hidden border-y border-foreground/10 bg-[var(--lime)] py-4 text-foreground sm:py-5">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-xl font-semibold tracking-tight group-hover:[animation-play-state:paused] sm:gap-12 sm:text-2xl md:text-4xl">
        {all.map((t, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12">
            {t}
            <span className="inline-block h-2.5 w-2.5 bg-foreground sm:h-3 sm:w-3" />
          </span>
        ))}
      </div>
      {/* Edge blur overlays — content behind the edges appears blurred, middle stays clear */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 backdrop-blur-md"
        style={{
          WebkitMaskImage: "linear-gradient(to right, black, transparent)",
          maskImage: "linear-gradient(to right, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/4 backdrop-blur-md"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black, transparent)",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />
    </div>
  );
}
