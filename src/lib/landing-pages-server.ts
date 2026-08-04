import { createServerFn } from "@tanstack/react-start";
import { contentDb } from "@/lib/db";

export type LandingPageHowItWorks = {
  step: number;
  title: string;
  description: string;
};

export type LandingPageFaqItem = {
  question: string;
  answer: string;
};

export type LandingPageData = {
  serviceSlug: string;
  serviceName: string;
  headline: string;
  subheadline: string;
  problemText: string;
  solutionText: string;
  proofText: string;
  howItWorks: LandingPageHowItWorks[];
  faq: LandingPageFaqItem[];
  metaTitle: string | null;
  metaDescription: string | null;
  targetKeyword: string | null;
  h1Override: string | null;
  ogImagePath: string | null;
};

export const getLandingPage = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const { slug, audience } = (input ?? {}) as {
      slug?: unknown;
      audience?: unknown;
    };
    if (typeof slug !== "string" || !slug) {
      throw new Error("slug is required");
    }
    return {
      slug,
      audience: typeof audience === "string" && audience ? audience : null,
    };
  })
  .handler(async ({ data }): Promise<LandingPageData | null> => {
    // 1. Look up the base landing page
    const { rows: pageRows } = await contentDb.query(
      `SELECT
         service_slug   AS "serviceSlug",
         service_name   AS "serviceName",
         default_headline    AS "defaultHeadline",
         default_subheadline AS "defaultSubheadline",
         problem_text   AS "problemText",
         solution_text  AS "solutionText",
         proof_text     AS "proofText",
         how_it_works   AS "howItWorks",
         faq,
         meta_title       AS "metaTitle",
         meta_description AS "metaDescription",
         target_keyword   AS "targetKeyword",
         h1_override      AS "h1Override",
         og_image_path    AS "ogImagePath"
       FROM landing_pages
       WHERE service_slug = $1
       LIMIT 1`,
      [data.slug],
    );

    if (!pageRows[0]) return null;

    const page = pageRows[0];

    // 2. If audience param present, try to find an override
    let headline = page.defaultHeadline;
    let subheadline = page.defaultSubheadline;
    let h1Override = page.h1Override;

    if (data.audience) {
      const { rows: audienceRows } = await contentDb.query(
        `SELECT headline, subheadline
         FROM landing_page_audiences
         WHERE service_slug = $1 AND audience_slug = $2
         LIMIT 1`,
        [data.slug, data.audience],
      );

      if (audienceRows[0]) {
        headline = audienceRows[0].headline;
        subheadline = audienceRows[0].subheadline;
        // The audience-specific headline takes precedence over the static
        // H1 override too, so suppress it here rather than in the caller.
        h1Override = null;
      }
      // No match → silently fall back to defaults (already set above)
    }

    return {
      serviceSlug: page.serviceSlug,
      serviceName: page.serviceName,
      headline,
      subheadline,
      problemText: page.problemText,
      solutionText: page.solutionText,
      proofText: page.proofText,
      howItWorks: page.howItWorks ?? [],
      faq: page.faq ?? [],
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      targetKeyword: page.targetKeyword,
      h1Override,
      ogImagePath: page.ogImagePath,
    };
  });
