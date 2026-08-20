import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider, noFlashScript } from "@/components/noctix/ThemeProvider";
import { CookieConsent } from "@/components/noctix/CookieConsent";
import { Analytics } from "@/components/noctix/Analytics";
import { consentDefaultScript, gtagBootstrapScript, GA_MEASUREMENT_ID } from "@/lib/analytics";
import { SITE, canonical, ogImage } from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/schema";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Noctix AI — Let Robots Do The Boring Stuff" },
      {
        name: "description",
        content:
          "Noctix AI builds AI voice agents, CRM automations, workflows, and business systems that remove manual work from your operations.",
      },
      { name: "author", content: "Noctix AI" },
      { name: "theme-color", content: SITE.themeColor },
      { name: "facebook-domain-verification", content: "lty4rxohm34kzo9h8wy25hs21n1w11" },
      { property: "og:title", content: "Noctix AI — Let Robots Do The Boring Stuff" },
      {
        property: "og:description",
        content: "AI agents, automations, and business systems built for operators.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE.url },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "en_GB" },
      { property: "og:image", content: ogImage() },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: SITE.name + " — " + SITE.tagline },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Noctix AI" },
      { name: "twitter:description", content: "Let Robots Do The Boring Stuff." },
      { name: "twitter:image", content: ogImage() },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
      { rel: "icon", type: "image/png", href: "/icons/favicon-32.png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <script dangerouslySetInnerHTML={{ __html: consentDefaultScript }} />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
        <script dangerouslySetInnerHTML={{ __html: gtagBootstrapScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [organizationSchema(), websiteSchema()],
        }}
      />
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <Analytics />
        <CookieConsent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
