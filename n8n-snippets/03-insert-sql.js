// Code node: "Build insert SQL"
// Mode: Run Once for Each Item
//
// Fixes two bugs in the current node:
//
//   1. Malformed internal links — '/blog/' + l.slug was prepended
//      unconditionally, but the model already returns some targets
//      pre-formatted (/blog/some-slug, /services). That produced
//      /blog//blog/some-slug for 16 of the 19 stored link entries,
//      non-deterministically depending on which shape the model returned.
//      normalizeInternalLink() below handles each shape explicitly instead
//      of guessing with string concatenation.
//
//   2. String-interpolated SQL — the node built the INSERT with manual
//      '.replace(/'/g, "''")' escaping instead of parameters. This now
//      emits { query, values }: query uses $1, $2, ... placeholders, values
//      is the ordered array, for the Postgres node's parameterized query
//      mode.
//
// Downstream wiring this node's output requires:
//
//   1. Postgres node — Operation: Execute Query
//        Query:            ={{ $json.query }}
//        Query Parameters: ={{ $json.values }}
//      Turn "Always Output Data" ON for this Postgres node too. ON CONFLICT
//      DO NOTHING returns zero rows on a duplicate slug — without Always
//      Output Data that just stops the branch outright instead of letting
//      the next node react to it.
//
//   2. IF node — condition: {{ $json.slug }} is not empty
//        true  -> a row was inserted (RETURNING slug produced a row);
//                 continue the "new post" branch
//        false -> ON CONFLICT fired, no row returned; take the
//                 "duplicate slug, skip" branch
//
// Column list mirrors the known blog_posts schema (src/lib/blog-server.ts
// and migrations/003_blog_posts_fixes.sql in the site repo), plus
// word_count (added by migration 003, not previously inserted here) and
// internal_links (jsonb array of normalized {url, anchor_text} objects). If
// your node currently inserts a different column set, adjust COLUMNS/row
// below — the fixes themselves don't depend on the exact list.

const post = $json;

// ---------------------------------------------------------------------
// 1. Normalize internal links.
// ---------------------------------------------------------------------
//
// Rules, applied to each link's raw `slug` field:
//   - strip leading slashes
//   - starts with "blog/"                        -> /blog/<rest>
//   - starts with "services"/"contact"/"case-studies" -> /<value>
//   - anything else                               -> /blog/<value> (bare slug)
//   - collapse any repeated slashes produced by the above
//   - drop the entry if the result doesn't match /^\/[a-z0-9\-\/]+$/

function normalizeInternalLink(rawSlug) {
  if (typeof rawSlug !== 'string' || !rawSlug.trim()) return null;

  const path = rawSlug.trim().replace(/^\/+/, ''); // strip leading slashes

  let normalized;
  if (path.startsWith('blog/')) {
    const rest = path.slice('blog/'.length);
    normalized = '/blog/' + rest;
  } else if (
    path.startsWith('services') ||
    path.startsWith('contact') ||
    path.startsWith('case-studies')
  ) {
    normalized = '/' + path;
  } else {
    // No recognized prefix — treat the whole value as a bare blog slug.
    normalized = '/blog/' + path;
  }

  normalized = normalized.replace(/\/{2,}/g, '/'); // collapse repeated slashes

  return /^\/[a-z0-9\-\/]+$/.test(normalized) ? normalized : null;
}

const internalLinks = (Array.isArray(post.internal_links) ? post.internal_links : [])
  .map((l) => {
    const url = normalizeInternalLink(l && l.slug);
    return url ? { url, anchor_text: l && l.anchor_text } : null;
  })
  .filter(Boolean);

// ---------------------------------------------------------------------
// 2. word_count — same formula used to backfill existing rows
//    (migrations/003_blog_posts_fixes.sql: split the trimmed body on
//    whitespace runs and count the tokens).
// ---------------------------------------------------------------------

const bodyText = typeof post.body === 'string' ? post.body.trim() : '';
const wordCount = bodyText ? bodyText.split(/\s+/).filter(Boolean).length : 0;

// ---------------------------------------------------------------------
// 3. Parameterized insert — no manual quote-escaping, no string-built SQL.
// ---------------------------------------------------------------------

const COLUMNS = [
  'slug',
  'title',
  'description',
  'keyword',
  'read_time',
  'body',
  'meta_title',
  'meta_description',
  'faq',
  'author_name',
  'author_bio',
  'author_linkedin',
  'status',
  'approval_token',
  'approval_expires_at',
  'og_image_path',
  'word_count',
  'internal_links',
];

const row = {
  slug: post.slug,
  title: post.title,
  description: post.description,
  keyword: post.keyword,
  read_time: post.read_time,
  body: post.body,
  meta_title: post.meta_title,
  meta_description: post.meta_description,
  faq: JSON.stringify(post.faq ?? []),
  author_name: post.author_name,
  author_bio: post.author_bio,
  author_linkedin: post.author_linkedin ?? null,
  status: 'draft',
  approval_token: post.approval_token,
  approval_expires_at: post.approval_expires_at,
  og_image_path: post.og_image_path ?? null,
  word_count: wordCount,
  // jsonb columns need an explicit JSON string — the pg driver underneath
  // the Postgres node does not auto-serialize JS arrays/objects passed as
  // query parameters.
  internal_links: JSON.stringify(internalLinks),
};

const values = COLUMNS.map((col) => row[col]);
const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ');

const query = `
  INSERT INTO blog_posts (${COLUMNS.join(', ')})
  VALUES (${placeholders})
  ON CONFLICT (slug) DO NOTHING
  RETURNING slug
`;

return { json: { query, values } };
