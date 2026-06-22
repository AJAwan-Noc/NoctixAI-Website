import { motion } from "framer-motion";
import { WebsiteLeadForm } from "@/components/noctix/WebsiteLeadForm";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";

export function BookingCTA() {
  return (
    <section id="book" className="relative border-t border-foreground/10 py-20 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-10" />
      <Particles className="opacity-50" quantity={45} color="180,140,255" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-12">
          <div className="mb-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            <span className="h-1.5 w-1.5 bg-[var(--lime)] flicker" /> 05 - Initiate Audit
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
            Book your free
            <br />
            <span className="text-[var(--lime)]">automation audit</span>.
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-4xl bg-foreground/10">
          <BorderBeam size={280} duration={14} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <WebsiteLeadForm
              introLabel="// Intake - consultation details"
              submitLabel="Request Audit"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
