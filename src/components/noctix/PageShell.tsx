import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="pt-24 md:pt-28">{children}</div>;
}
