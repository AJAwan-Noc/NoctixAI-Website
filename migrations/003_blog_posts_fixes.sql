-- 003_blog_posts_fixes.sql
-- Adds review/approval columns to blog_posts, widens the status constraint
-- to include 'unpublished', and backfills three data issues.

BEGIN;

ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS approval_expires_at timestamptz,
    ADD COLUMN IF NOT EXISTS word_count           integer,
    ADD COLUMN IF NOT EXISTS reviewed_by          text,
    ADD COLUMN IF NOT EXISTS reviewed_at          timestamptz,
    ADD COLUMN IF NOT EXISTS ai_assisted          boolean NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS og_image_path        text;

-- The existing blog_posts_status_check only allows ('draft','published','rejected').
-- Postgres ANDs multiple CHECK constraints on the same table together, so if the
-- new constraint below were added without dropping this one first, the migration
-- would apply cleanly but any row with status='unpublished' would still be
-- silently rejected by this old constraint.
ALTER TABLE blog_posts DROP CONSTRAINT IF EXISTS blog_posts_status_check;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_meta_title_len'
    ) THEN
        ALTER TABLE blog_posts
            ADD CONSTRAINT blog_posts_meta_title_len
            CHECK (char_length(meta_title) <= 60);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_status_valid'
    ) THEN
        ALTER TABLE blog_posts
            ADD CONSTRAINT blog_posts_status_valid
            CHECK (status IN ('draft', 'published', 'rejected', 'unpublished'));
    END IF;
END
$$;

-- (a) A NULL published_at on a published post crashes the sitemap.
UPDATE blog_posts
SET published_at = created_at
WHERE status = 'published' AND published_at IS NULL;

-- (b) Backfill word_count from body.
UPDATE blog_posts
SET word_count = array_length(regexp_split_to_array(trim(body), '\s+'), 1);

-- (c) Existing read_time values came from a language model and are
-- overstated 2-7x; recompute from word_count at 225 wpm.
UPDATE blog_posts
SET read_time = GREATEST(1, ROUND(word_count / 225.0))::text || ' min read'
WHERE word_count IS NOT NULL;

INSERT INTO schema_migrations (version, note)
VALUES ('003', 'blog_posts review columns, status constraint fix, read_time/word_count backfill')
ON CONFLICT (version) DO NOTHING;

COMMIT;
