-- 000_schema_migrations.sql
-- Creates the migration ledger and the shared updated_at trigger function
-- used by every later migration.

BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version     text PRIMARY KEY,
    applied_at  timestamptz NOT NULL DEFAULT now(),
    note        text
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

INSERT INTO schema_migrations (version, note)
VALUES ('000', 'schema_migrations ledger + set_updated_at() trigger function')
ON CONFLICT (version) DO NOTHING;

COMMIT;
