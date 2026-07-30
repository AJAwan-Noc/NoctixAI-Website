-- 001_leads.sql
-- Persists website form submissions. Submissions are currently forwarded to
-- Slack only and never stored, so any delivery failure loses the lead with
-- no record it ever existed.

BEGIN;

CREATE TABLE IF NOT EXISTS leads (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name               text NOT NULL,
    email              text NOT NULL,
    phone              text,
    company_name       text,
    website            text,
    service_needed     text,
    budget_range       text,
    timeline           text,
    message            text,
    timezone           text,

    source             text NOT NULL DEFAULT 'noctix-website',
    source_path        text,
    referrer           text,
    utm_source         text,
    utm_medium         text,
    utm_campaign       text,
    utm_term           text,
    utm_content        text,

    request_ip         inet,
    user_agent         text,

    status             text NOT NULL DEFAULT 'new',
    notified_at        timestamptz,
    notify_attempts    integer NOT NULL DEFAULT 0,
    last_error         text,

    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'leads_status_valid'
    ) THEN
        ALTER TABLE leads
            ADD CONSTRAINT leads_status_valid
            CHECK (status IN ('new', 'notified', 'contacted', 'qualified', 'won', 'lost', 'spam'));
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_lower_idx ON leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_status_new_idx ON leads (created_at) WHERE status = 'new';

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;
CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE leads IS
    'Website form submissions. Rows are written BEFORE any Slack notification is attempted, so a lead is never lost to a failed notification.';

INSERT INTO schema_migrations (version, note)
VALUES ('001', 'leads table')
ON CONFLICT (version) DO NOTHING;

COMMIT;
