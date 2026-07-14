import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/noctix/SiteShell";
import { AuroraText } from "@/components/ui/aurora-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { SimpleLeadForm } from "@/components/noctix/SimpleLeadForm";

export const Route = createFileRoute("/savings-calculator")({
  head: () => ({
    meta: [
      { title: "Automation Savings Calculator -- Noctix AI" },
      {
        name: "description",
        content:
          "See how many hours and dollars your business could save by automating repetitive manual work. Free, instant estimate, no email required to see your number.",
      },
    ],
  }),
  component: SavingsCalculatorPage,
});

const HOURS_BANDS = [
  { label: "Under 10 hrs/week", value: 5 },
  { label: "10-25 hrs/week", value: 17.5 },
  { label: "25-50 hrs/week", value: 37.5 },
  { label: "50+ hrs/week", value: 60 },
];

const RATE_BANDS = [
  { label: "$15-25/hr", value: 20 },
  { label: "$25-40/hr", value: 32.5 },
  { label: "$40-60/hr", value: 50 },
  { label: "$60+/hr", value: 75 },
];

const AUTOMATION_RECOVERY_RATE = 0.65;
const WEEKS_PER_MONTH = 4.33;

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function SavingsCalculatorPage() {
  const [hoursIdx, setHoursIdx] = useState<number | null>(null);
  const [rateIdx, setRateIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const canCalculate = hoursIdx !== null && rateIdx !== null;

  const weeklyHours = hoursIdx !== null ? HOURS_BANDS[hoursIdx].value : 0;
  const hourlyRate = rateIdx !== null ? RATE_BANDS[rateIdx].value : 0;
  const hoursSavedPerWeek = weeklyHours * AUTOMATION_RECOVERY_RATE;
  const monthlySavings = hoursSavedPerWeek * hourlyRate * WEEKS_PER_MONTH;
  const annualSavings = monthlySavings * 12;

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
          Free tool
        </div>
        <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          What is manual work <AuroraText>actually costing you</AuroraText>?
        </h1>
        <p className="mt-6 text-lg text-foreground/65">
          Answer two quick questions. No email required to see your number.
        </p>

        <div className="relative mt-12 overflow-hidden border border-foreground/10 bg-background/40 p-8 sm:p-10">
          <BorderBeam size={260} duration={14} />

          <div className="space-y-8">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                How many hours a week does your team spend on repetitive manual tasks?
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {HOURS_BANDS.map((band, i) => (
                  <button
                    key={band.label}
                    type="button"
                    onClick={() => setHoursIdx(i)}
                    className={`border px-3 py-2 text-sm transition ${
                      hoursIdx === i
                        ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--lime)]"
                        : "border-foreground/15 text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                What's the average fully-loaded hourly cost of that time?
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RATE_BANDS.map((band, i) => (
                  <button
                    key={band.label}
                    type="button"
                    onClick={() => setRateIdx(i)}
                    className={`border px-3 py-2 text-sm transition ${
                      rateIdx === i
                        ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--lime)]"
                        : "border-foreground/15 text-foreground/70 hover:border-foreground/30"
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            {!showResult && (
              <button
                type="button"
                disabled={!canCalculate}
                onClick={() => setShowResult(true)}
                className="inline-flex items-center gap-2 bg-[var(--lime)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--lime-glow)]"
              >
                Calculate my savings -&gt;
              </button>
            )}
          </div>

          {showResult && (
            <div className="mt-10 border-t border-foreground/10 pt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
                Your estimate
              </div>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div>
                  <div className="font-display text-3xl font-semibold">
                    {hoursSavedPerWeek.toFixed(0)} hrs
                  </div>
                  <div className="mt-1 text-sm text-foreground/55">saved per week</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold">
                    {formatCurrency(monthlySavings)}
                  </div>
                  <div className="mt-1 text-sm text-foreground/55">saved per month</div>
                </div>
                <div>
                  <div className="font-display text-3xl font-semibold">
                    {formatCurrency(annualSavings)}
                  </div>
                  <div className="mt-1 text-sm text-foreground/55">saved per year</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-foreground/45">
                Estimate based on typical results across automation implementations.
                Actual savings depend on your specific processes.
              </p>

              <div className="mt-10 border-t border-foreground/10 pt-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
                  Want the full breakdown?
                </div>
                <p className="mt-3 mb-6 text-sm text-foreground/60">
                  Leave your details and we'll follow up with a detailed breakdown and a short
                  plan for where to start.
                </p>
                <SimpleLeadForm
                  serviceNeeded="Savings Calculator Lead"
                  submitLabel="Get my breakdown"
                  successMessage="We'll follow up with your full savings breakdown and where to start."
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
