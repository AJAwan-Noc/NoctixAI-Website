import { Pool } from "pg";

// Server-only. This module is only ever reached from inside createServerFn
// .handler() closures in blog-server.ts — TanStack Start's compiler extracts
// those closures into the server bundle, so the pool credentials never ship
// to the browser.
declare global {
  // eslint-disable-next-line no-var
  var __noctixContentDbPool: Pool | undefined;
}

export const contentDb =
  globalThis.__noctixContentDbPool ??
  new Pool({
    connectionString: process.env.NOCTIX_CONTENT_DB_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__noctixContentDbPool = contentDb;
}
