import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { SiteBackground } from "./SiteBackground";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { FreebieTeaser } from "./FreebieTeaser";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline focus:outline-2 focus:outline-offset-2"
      >
        Skip to main content
      </a>
      <SiteBackground />
      <Nav />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 pt-24 text-foreground md:pt-28"
      >
        {children}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FreebieTeaser />
    </SmoothScroll>
  );
}
