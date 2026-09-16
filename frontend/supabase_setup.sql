-- ============================================================
-- SUPABASE SETUP SQL — Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- 1. Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 2. Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 3. Allow public to read (so the portfolio can fetch resume URL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_config' AND policyname = 'Public can read site_config'
  ) THEN
    CREATE POLICY "Public can read site_config" ON site_config
      FOR SELECT TO public USING (true);
  END IF;
END $$;

-- 4. Allow authenticated users (admin) to write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_config' AND policyname = 'Auth can write site_config'
  ) THEN
    CREATE POLICY "Auth can write site_config" ON site_config
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. Seed empty resume_url (will be updated after file upload)
INSERT INTO site_config (key, value)
VALUES ('resume_url', '')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- STORAGE BUCKET SETUP
-- Do this in Supabase Dashboard → Storage → Create Bucket:
--   Name: resumes
--   Public: YES (toggle ON)
-- Then upload your PDF and copy the public URL.
-- ============================================================

-- Optional: Storage RLS policies (if needed)
-- These are auto-created when bucket is set to Public in the dashboard.

-- Verify:
SELECT * FROM site_config;
