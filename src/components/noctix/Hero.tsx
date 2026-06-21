import { motion } from "framer-motion";
import { NeuralCore } from "./NeuralCore";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { AuroraText } from "@/components/ui/aurora-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { DotPattern } from "@/components/ui/dot-pattern";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-25" />
      <div className="absolute inset-0 scanlines opacity-40" />
      <DotPattern className="opacity-[0.08]" cr={1} width={28} height={28} glow />

      {/* Radial vignette — fades toward background color so it works in both themes */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, var(--background) 85%)",
        }}
      />

      {/* 3D Neural core */}
      <div className="absolute inset-0">
        <NeuralCore />
      </div>

      <CornerBrackets />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between gap-12 px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.6 }}
          className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]"
        >
          <span className="h-1.5 w-1.5 bg-[var(--lime)] flicker" />
          <span className="truncate">v1.0 — automation systems online</span>
        </motion.div>

        <div className="flex flex-col gap-8 sm:gap-10">
          <AnimatedHeadline />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.6 }}
            className="max-w-xl text-sm text-foreground/65 sm:text-base md:text-lg"
          >
            We build AI agents, automations, and business systems that remove manual work from your
            operations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <MagneticButton>
              <ShimmerButton
                onClick={() => {
                  const el = document.querySelector("#book");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] sm:w-auto"
              >
                Book an Audit
                <span className="ml-2 transition-transform">→</span>
              </ShimmerButton>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#services"
                className="inline-flex w-full items-center justify-center gap-3 border border-foreground/20 bg-foreground/[0.02] px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm transition-colors hover:border-[var(--lime)] hover:text-[var(--lime)] sm:w-auto sm:px-6 sm:tracking-[0.25em]"
              >
                See What We Build
              </a>
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-6 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/50 sm:gap-6 sm:text-[10px] sm:tracking-[0.3em] md:grid-cols-4"
        >
          <Stat label="Agents deployed" suffix="+" value={42} />
          <Stat label="Hours saved / week" suffix="+" value={1280} />
          <Stat label="Uptime" suffix="%" value={99.9} decimals={1} />
          <Stat label="Status" raw="Accepting" />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  suffix,
  raw,
  decimals,
}: {
  label: string;
  value?: number;
  suffix?: string;
  raw?: string;
  decimals?: number;
}) {
  return (
    <div className="min-w-0">
      <div className="truncate text-foreground/40">// {label}</div>
      <div className="mt-1 truncate text-foreground">
        {raw ? (
          raw
        ) : (
          <>
            <NumberTicker value={value ?? 0} decimalPlaces={decimals ?? 0} />
            {suffix}
          </>
        )}
      </div>
    </div>
  );
}

function CornerBrackets() {
  const cls = "absolute hidden sm:block h-6 w-6 border-[var(--lime)]/60";
  return (
    <>
      <span className={`${cls} left-6 top-24 border-l border-t`} />
      <span className={`${cls} right-6 top-24 border-r border-t`} />
      <span className={`${cls} left-6 bottom-6 border-l border-b`} />
      <span className={`${cls} right-6 bottom-6 border-r border-b`} />
    </>
  );
}

function AnimatedHeadline() {
  return (
    <BlurFade delay={2.6} duration={0.8} yOffset={20} blur="14px">
      <h1 className="font-display text-balance text-[clamp(2.5rem,11vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
        Let Robots <br />
        Do The <AuroraText>Boring</AuroraText> Stuff.
      </h1>
    </BlurFade>
  );
}
