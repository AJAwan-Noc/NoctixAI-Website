import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { BorderBeam } from "@/components/ui/border-beam";

export function BookingCTA() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="book" className="relative border-t border-foreground/10 py-20 md:py-32">
      <div className="absolute inset-0 grid-overlay opacity-10" />
      <Particles className="opacity-50" quantity={45} color="180,140,255" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 md:mb-12">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
            <span className="h-1.5 w-1.5 bg-[var(--lime)] flicker" /> 05 — Initiate Audit
          </div>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1] tracking-[-0.03em]">
            Book your free
            <br />
            <span className="text-[var(--lime)]">automation audit</span>.
          </h2>
        </div>

        <div className="relative grid gap-px bg-foreground/10 lg:grid-cols-[1fr_1.1fr]">
          <BorderBeam size={280} duration={14} />
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background/70 backdrop-blur-sm p-6 sm:p-8 md:p-10"
          >
            <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              // Intake — 4 quick fields
            </div>
            {submitted ? (
              <div className="flex h-full min-h-[360px] flex-col items-start justify-center">
                <div className="font-display text-3xl font-semibold text-[var(--lime)]">
                  Transmission received.
                </div>
                <p className="mt-3 max-w-sm text-foreground/60">
                  We'll be in touch within 24 hours to confirm your audit slot.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <Field label="Name" name="name" placeholder="Your full name" />
                <Field label="Company" name="company" placeholder="Company name" />
                <Field
                  label="Biggest time-waster"
                  name="problem"
                  placeholder="What manual work eats your week?"
                />
                <Field label="Best email" name="email" type="email" placeholder="you@company.com" />
                <MagneticButton>
                  <ShimmerButton
                    type="submit"
                    className="mt-2 px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em]"
                  >
                    Request Audit →
                  </ShimmerButton>
                </MagneticButton>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/30">
                  No spam. No SDR follow-up loops. Just a real call.
                </p>
              </div>
            )}
          </motion.form>

          {/* Cal.com placeholder */}
          <div className="relative bg-background/70 backdrop-blur-sm p-6 sm:p-8 md:p-10">
            <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              // Or pick a slot directly
            </div>
            <div className="relative flex min-h-[360px] flex-col items-center justify-center border border-dashed border-foreground/15 bg-[var(--lime)]/[0.02]">
              <div className="absolute inset-0 grid-overlay opacity-30" />
              <div className="relative text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--lime)]">
                  Cal.com Embed
                </div>
                <p className="mx-auto mt-3 max-w-xs text-sm text-foreground/50">
                  Drop your Cal.com link or embed snippet here to enable instant booking.
                </p>
                <MagneticButton>
                  <a
                    href="https://cal.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 border border-[var(--lime)]/50 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--lime)] hover:bg-[var(--lime)]/10"
                  >
                    Open Booking →
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
        {label}
      </span>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="border border-foreground/10 bg-foreground/[0.02] px-4 py-3 font-sans text-base text-foreground placeholder:text-foreground/25 focus:border-[var(--lime)] focus:outline-none focus:ring-0"
      />
    </label>
  );
}
