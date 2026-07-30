# Migrations

Every schema change up to this point was applied by hand, with no record of
what ran or when. Starting now, all schema changes go through this
directory.

## Rules

- Files apply in numeric order (`000_`, `001_`, `002_`, ...). Never renumber
  or reorder a file that has already been applied anywhere.
- Every applied migration records its version in `schema_migrations`
  (created by `000_schema_migrations.sql`). Check that table to see what has
  already run:

  ```sql
  SELECT * FROM schema_migrations ORDER BY version;
  ```

- Every migration is idempotent and safe to re-run: `CREATE ... IF NOT
  EXISTS` where supported, and table constraints guarded inside `DO` blocks
  that check `pg_constraint` (Postgres has no `ADD CONSTRAINT IF NOT
  EXISTS`). Re-running an already-applied file should be a no-op.
- Each file is wrapped in `BEGIN` / `COMMIT` so it applies atomically.
- **Take a `pg_dump` before applying any migration**, especially ones that
  rewrite data (`003`) or change role privileges (`004`):

  ```sh
  pg_dump -Fc "$NOCTIX_CONTENT_DB_URL" > pre_migration_$(date +%Y%m%d%H%M%S).dump
  ```

## Applying

```sh
psql "$NOCTIX_CONTENT_DB_URL" -f migrations/000_schema_migrations.sql
psql "$NOCTIX_CONTENT_DB_URL" -f migrations/001_leads.sql
psql "$NOCTIX_CONTENT_DB_URL" -f migrations/002_landing_pages_seo.sql
psql "$NOCTIX_CONTENT_DB_URL" -f migrations/003_blog_posts_fixes.sql
psql "$NOCTIX_CONTENT_DB_URL" -v site_pw='...' -v n8n_pw='...' \
  -f migrations/004_least_privilege.sql
```

`004` takes `site_pw` and `n8n_pw` as psql variables so the passwords are
never committed to the repo. After it applies, `NOCTIX_CONTENT_DB_URL` in
the systemd unit and the n8n "Blog DB" credential must be updated to use the
new `noctix_site` / `noctix_n8n` roles, and both services restarted — see
the warning at the top of `004_least_privilege.sql`.

## Files

| File | Summary |
| --- | --- |
| `000_schema_migrations.sql` | `schema_migrations` ledger table + `set_updated_at()` trigger function used by later migrations. |
| `001_leads.sql` | `leads` table — persists website form submissions that today are only forwarded to Slack and never stored. |
| `002_landing_pages_seo.sql` | Adds SEO and on-page content columns to `landing_pages`. |
| `003_blog_posts_fixes.sql` | Adds review/approval columns to `blog_posts`, fixes the `status` check constraint to allow `unpublished`, and backfills `published_at`, `word_count`, and `read_time`. |
| `004_least_privilege.sql` | Replaces the single shared full-rights DB role with two least-privilege roles, `noctix_site` and `noctix_n8n`. |
