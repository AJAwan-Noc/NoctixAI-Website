import type { ReactElement } from "react";

/**
 * Escapes characters that could terminate a <script> element early.
 * JSON.stringify does not escape "<", ">", or "&", so a string value
 * containing "</script>" would close the tag and let injected markup run.
 * \u003c / \u003e / \u0026 are valid JSON string escapes, so the output
 * still parses as the original JSON-LD.
 */
function toSafeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: unknown }): ReactElement | null {
  if (data === null || data === undefined) return null;

  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(data) }} />
  );
}
