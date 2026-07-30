import { SITE } from "@/lib/seo";

type SchemaOrgNode = Record<string, unknown>;

export function organizationSchema(): SchemaOrgNode {
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: "https://noctix.app/og/noctix-logo.png",
      width: 512,
      height: 512,
    },
    description: SITE.description,
    slogan: SITE.tagline,
    foundingDate: "2026-05-11",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Pakistan" },
    ],
    knowsAbout: [
      "AI voice agents",
      "CRM automation",
      "Workflow automation",
      "Lead generation systems",
      "Retrieval-augmented generation",
      "Business intelligence dashboards",
      "n8n",
    ],
    sameAs: SITE.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@noctix.app",
      availableLanguage: ["English", "Urdu"],
    },
  };
}

export function websiteSchema(): SchemaOrgNode {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    // No SearchAction: this site has no search box, and declaring a
    // nonexistent search endpoint is worse than declaring nothing.
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): SchemaOrgNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: SITE.url + item.path,
    })),
  };
}

// TODO: serviceSchema(...) — per-service Service/Offer schema for
// /services/$slug landing pages. Not implemented yet.
