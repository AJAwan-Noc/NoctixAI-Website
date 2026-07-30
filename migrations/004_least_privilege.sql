-- 004_least_privilege.sql
--
-- Splits the single full-rights role currently shared by SSR and n8n into
-- two least-privilege roles.
--
-- Requires two psql variables to be set before running, e.g.:
--   psql -v site_pw='...' -v n8n_pw='...' -f migrations/004_least_privilege.sql
--
-- WARNING: applying this migration requires updating NOCTIX_CONTENT_DB_URL
-- in the systemd unit and the n8n "Blog DB" credential to use the new
-- noctix_site / noctix_n8n roles respectively, then restarting both
-- services. The old shared role keeps working until it is revoked
-- separately, but nothing will use the new roles' privileges until the
-- connection strings are switched over.

BEGIN;

DO $$
DECLARE
    db_name text := current_database();
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'noctix_site') THEN
        EXECUTE format('CREATE ROLE noctix_site LOGIN PASSWORD %L', :'site_pw');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'noctix_n8n') THEN
        EXECUTE format('CREATE ROLE noctix_n8n LOGIN PASSWORD %L', :'n8n_pw');
    END IF;

    EXECUTE format('GRANT CONNECT ON DATABASE %I TO noctix_site, noctix_n8n', db_name);
END
$$;

GRANT USAGE ON SCHEMA public TO noctix_site, noctix_n8n;

-- noctix_site (SSR / website reads): read-only.
GRANT SELECT ON blog_posts, landing_pages, landing_page_audiences TO noctix_site;

-- noctix_n8n (automation): read/write on content it manages, read-only elsewhere.
GRANT SELECT, INSERT, UPDATE ON blog_posts, blog_topic_ideas, freebie_requests, leads TO noctix_n8n;
GRANT SELECT ON landing_pages TO noctix_n8n;

REVOKE UPDATE, DELETE ON admin_audit_log FROM noctix_site, noctix_n8n;

INSERT INTO schema_migrations (version, note)
VALUES ('004', 'least-privilege roles noctix_site / noctix_n8n')
ON CONFLICT (version) DO NOTHING;

COMMIT;
