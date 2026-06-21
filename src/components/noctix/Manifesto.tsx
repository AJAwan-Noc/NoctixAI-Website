import { useRef } from "react";
import { StaggerText } from "@/components/ui/stagger-text";
import { DotPattern } from "@/components/ui/dot-pattern";

const lines = [
  { t: "Businesses lose hours to repetitive work.", muted: false },
  { t: "Calls get missed.", muted: true },
  { t: "Leads go cold.", muted: true },
  { t: "Teams drown in admin.", muted: true },
  { t: "Noctix builds the robots that handle it.", muted: false, lime: true },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-40">
      <DotPattern className="opacity-[0.05]" cr={1} width={32} height={32} glow />
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-10" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 md:mb-16 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
          <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> 01 — Manifesto
        </div>
        <div className="flex flex-col gap-10">
          {lines.map((l, i) => (
            <Line key={i} text={l.t} lime={l.lime} muted={l.muted} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Line({ text, lime, muted }: { text: string; lime?: boolean; muted?: boolean }) {
  return (
    <StaggerText
      text={text}
      stagger={0.02}
      direction="bottom"
      transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.5 }}
      className={`font-display text-[clamp(2rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance ${
        lime ? "text-[var(--lime)] text-lime-glow" : "text-foreground"
      }`}
    />
  );
}
