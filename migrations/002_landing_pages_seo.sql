-- 002_landing_pages_seo.sql
-- Adds SEO and on-page content columns to landing_pages, which currently
-- has none.

BEGIN;

ALTER TABLE landing_pages
    ADD COLUMN IF NOT EXISTS meta_title          text,
    ADD COLUMN IF NOT EXISTS meta_description    text,
    ADD COLUMN IF NOT EXISTS target_keyword       text,
    ADD COLUMN IF NOT EXISTS secondary_keywords   text[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS h1_override          text,
    ADD COLUMN IF NOT EXISTS og_image_path        text,
    ADD COLUMN IF NOT EXISTS intro_answer         text,
    ADD COLUMN IF NOT EXISTS problem_heading      text,
    ADD COLUMN IF NOT EXISTS solution_heading     text,
    ADD COLUMN IF NOT EXISTS mechanism_heading    text,
    ADD COLUMN IF NOT EXISTS proof_points         jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS objections           jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS pricing_signal       jsonb,
    ADD COLUMN IF NOT EXISTS risk_reversal        text,
    ADD COLUMN IF NOT EXISTS not_for              text,
    ADD COLUMN IF NOT EXISTS related_slugs        text[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS related_post_slugs   text[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS status               text NOT NULL DEFAULT 'published',
    ADD COLUMN IF NOT EXISTS published_at         timestamptz;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'landing_pages_meta_title_len'
    ) THEN
        ALTER TABLE landing_pages
            ADD CONSTRAINT landing_pages_meta_title_len
            CHECK (meta_title IS NULL OR char_length(meta_title) <= 60);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'landing_pages_meta_desc_len'
    ) THEN
        ALTER TABLE landing_pages
            ADD CONSTRAINT landing_pages_meta_desc_len
            CHECK (meta_description IS NULL OR char_length(meta_description) BETWEEN 120 AND 160);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'landing_pages_status_valid'
    ) THEN
        ALTER TABLE landing_pages
            ADD CONSTRAINT landing_pages_status_valid
            CHECK (status IN ('draft', 'published'));
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS landing_pages_published_slug_idx
    ON landing_pages (service_slug) WHERE status = 'published';

DROP TRIGGER IF EXISTS trg_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER trg_landing_pages_updated_at
    BEFORE UPDATE ON landing_pages
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON COLUMN landing_pages.proof_points IS
    'jsonb array: [{"claim":"","metric":"","client":"","verified":true,"case_study_slug":""}]';
COMMENT ON COLUMN landing_pages.objections IS
    'jsonb array: [{"objection":"","response":""}]';
COMMENT ON COLUMN landing_pages.pricing_signal IS
    'jsonb object: {"from_amount":2500,"currency":"USD","unit":"project","retainer_from":500,"note":"","includes":["",""]}';

INSERT INTO schema_migrations (version, note)
VALUES ('002', 'landing_pages SEO + on-page content columns')
ON CONFLICT (version) DO NOTHING;

COMMIT;
