/** First-touch attribution fields captured by src/lib/attribution.ts and forwarded on every lead submission. */
export type AttributionFields = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  source_path?: string;
};
