import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { SiteBackground } from "./SiteBackground";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { FreebieTeaser } from "./FreebieTeaser";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <SiteBackground />
      <Nav />
      <main className="relative z-10 pt-24 text-foreground md:pt-28">{children}</main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FreebieTeaser />
    </SmoothScroll>
  );
}

