import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Meteors } from "@/components/ui/meteors";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden border-t border-foreground/10 py-20">
      <div className="absolute inset-0 grid-overlay opacity-15" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--lime) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative isolate overflow-hidden border border-foreground/10 bg-background/40 px-6 py-16 backdrop-blur-sm sm:px-12 sm:py-20 md:px-16 md:py-24">
          <Meteors number={22} />
          <BorderBeam size={280} duration={12} />

          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--lime)]"
            >
              / END TRANSMISSION
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display text-balance text-[clamp(2.4rem,7vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
            >
              Your business does not need <br className="hidden md:block" /> more manual work.{" "}
              <br />
              It needs <span className="text-[var(--lime)] text-lime-glow">systems</span>.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-foreground/60 md:text-lg"
            >
              Book a Noctix automation audit and we'll show you what can be automated first.
            </motion.p>
            <div className="mt-10 flex justify-center">
              <MagneticButton>
                <ShimmerButton
                  onClick={() => {
                    const el = document.querySelector("#book");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-5 font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
                >
                  Book a Call →
                </ShimmerButton>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
