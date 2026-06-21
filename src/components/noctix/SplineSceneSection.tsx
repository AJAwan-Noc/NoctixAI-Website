import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";
import { BorderBeam } from "@/components/ui/border-beam";
import { MagicCard } from "@/components/ui/magic-card";

export function SplineSceneSection() {
  return (
    <section className="relative w-full px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <MagicCard className="rounded-none">
          <Card className="relative w-full overflow-hidden border-foreground/10 bg-background/60 backdrop-blur-sm md:h-[600px]">
            <BorderBeam size={320} duration={16} />
            <Spotlight
              className="-top-40 left-0 md:-top-20 md:left-60"
              fill="oklch(0.55 0.27 268 / 0.32)"
            />

            <div className="flex h-full flex-col md:flex-row">
              <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-12">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--lime)]">
                  / Noctix Operating Layer
                </div>
                <h2 className="font-display text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground">
                  One brain.{" "}
                  <span className="text-[var(--lime)] text-lime-glow">Every system.</span>
                </h2>
                <p className="mt-6 max-w-md text-base text-foreground/65 md:text-lg">
                  Voice agents, CRM, lead pipelines, dashboards, and marketing — wired into a single
                  intelligent layer that runs the boring half of your business 24/7.
                </p>
                <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                  <span className="h-1.5 w-1.5 bg-[var(--lime)] flicker" /> drag · rotate · explore
                </div>
              </div>

              <div className="relative h-[360px] flex-1 sm:h-[440px] md:h-auto">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="h-full w-full"
                />
              </div>
            </div>
          </Card>
        </MagicCard>
      </div>
    </section>
  );
}
