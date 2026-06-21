import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)] ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-1.5 w-1.5 bg-[var(--lime)]" /> {eyebrow}
        </div>
      )}
      <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
        {title}
      </h2>
      {description && <p className="mt-5 max-w-xl text-foreground/60 md:text-lg">{description}</p>}
    </div>
  );
}
