import { createFileRoute } from "@tanstack/react-router";
import { SITE, canonical, ogImage } from "@/lib/seo";
import { SmoothScroll } from "@/components/noctix/SmoothScroll";
import { SiteBackground } from "@/components/noctix/SiteBackground";
import { Loader } from "@/components/noctix/Loader";
import { Nav } from "@/components/noctix/Nav";
import { Hero } from "@/components/noctix/Hero";
import { Marquee } from "@/components/noctix/Marquee";
import { Manifesto } from "@/components/noctix/Manifesto";
import { ServicesTeaser } from "@/components/noctix/ServicesTeaser";
import { UseCases } from "@/components/noctix/UseCases";
import { BookingCTA } from "@/components/noctix/BookingCTA";
import { FinalCTA } from "@/components/noctix/FinalCTA";
import { Footer } from "@/components/noctix/Footer";
import { FreebieTeaser } from "@/components/noctix/FreebieTeaser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noctix AI — Let Robots Do The Boring Stuff" },
      {
        name: "description",
        content:
          "Noctix AI builds AI voice agents, CRM automations, workflows, lead gen, and dashboards. Book a free automation audit.",
      },
      { property: "og:title", content: "Noctix AI — Let Robots Do The Boring Stuff" },
      {
        property: "og:description",
        content: "AI agents, automations, and business systems built for operators.",
      },
      { property: "og:url", content: canonical("/") },
      { property: "og:image", content: ogImage() },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline focus:outline-2 focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <Loader />
      <SiteBackground />
      <Nav />
      <main id="main-content" tabIndex={-1} className="relative z-10 text-foreground">
        <Hero />
        <Marquee />
        <Manifesto />
        <ServicesTeaser />
        <UseCases />
        <BookingCTA />
        <FinalCTA />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FreebieTeaser />
    </SmoothScroll>
  );
}
