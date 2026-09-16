/**
 * Supabase Setup Script
 * - Creates site_config table (via upsert, will work if table exists)
 * - Creates 'resumes' storage bucket
 * - Uploads Nirjak_Resume.pdf to the bucket
 * - Stores the public URL in site_config
 * - Sets up proper RLS policies via SQL exec
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const RESUME_LOCAL_PATH = 'C:/Users/Acer/Downloads/Nirjak_Resume.pdf';
const BUCKET_NAME = 'resumes';
const RESUME_STORAGE_PATH = 'Nirjak_Resume.pdf';

async function run() {
    console.log('\n🚀 Supabase Admin Setup Script\n');

    // ─── 1. Create storage bucket ────────────────────────────────
    console.log('📦 Creating storage bucket "resumes"...');
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760, // 10 MB
    });

    if (bucketError) {
        if (bucketError.message?.includes('already exists') || bucketError.message?.includes('Duplicate')) {
            console.log('  ✓ Bucket already exists — continuing.');
        } else {
            console.warn('  ⚠ Bucket creation note:', bucketError.message);
            console.log('  → Will try uploading anyway...');
        }
    } else {
        console.log('  ✓ Bucket created:', bucketData);
    }

    // ─── 2. Upload resume PDF ────────────────────────────────────
    console.log('\n📄 Uploading resume PDF...');
    let resumeFile;
    try {
        resumeFile = readFileSync(resolve(RESUME_LOCAL_PATH));
        console.log(`  ✓ Read local file: ${RESUME_LOCAL_PATH} (${(resumeFile.length / 1024).toFixed(1)} KB)`);
    } catch (readErr) {
        console.error('  ✗ Could not read resume file:', readErr.message);
        console.error('    Make sure the file exists at:', RESUME_LOCAL_PATH);
        process.exit(1);
    }

    // Remove existing file first (upsert)
    await supabase.storage.from(BUCKET_NAME).remove([RESUME_STORAGE_PATH]);

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(RESUME_STORAGE_PATH, resumeFile, {
            contentType: 'application/pdf',
            upsert: true,
        });

    if (uploadError) {
        console.error('  ✗ Upload failed:', uploadError.message);
        console.log('\n  ⚠ If you see a policy error, run this SQL in Supabase SQL Editor:');
        console.log(`
  -- Allow public read on resumes bucket
  CREATE POLICY "Public read resumes" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'resumes');

  -- Allow authenticated upload
  CREATE POLICY "Auth upload resumes" ON storage.objects
    FOR INSERT TO authenticated
    USING (bucket_id = 'resumes');
        `);
        process.exit(1);
    }

    console.log('  ✓ Upload successful!');

    // ─── 3. Get public URL ────────────────────────────────────────
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(RESUME_STORAGE_PATH);

    const publicUrl = urlData?.publicUrl;
    console.log('\n🔗 Public Resume URL:');
    console.log('  ', publicUrl);

    // ─── 4. Save to site_config table ────────────────────────────
    console.log('\n💾 Saving resume URL to site_config table...');
    const { error: upsertError } = await supabase
        .from('site_config')
        .upsert({ key: 'resume_url', value: publicUrl }, { onConflict: 'key' });

    if (upsertError) {
        console.warn('  ⚠ Could not save to site_config:', upsertError.message);
        console.log('\n  → Run this SQL in Supabase SQL Editor to create the table first:');
        console.log(`
  CREATE TABLE IF NOT EXISTS site_config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  -- Enable RLS
  ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

  -- Public can read
  CREATE POLICY "Public can read site_config" ON site_config
    FOR SELECT TO public USING (true);

  -- Authenticated can write
  CREATE POLICY "Auth can write site_config" ON site_config
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Insert resume URL
  INSERT INTO site_config (key, value)
  VALUES ('resume_url', '${publicUrl}')
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        `);
    } else {
        console.log('  ✓ site_config updated successfully!');
    }

    // ─── 5. Summary ───────────────────────────────────────────────
    console.log('\n✅ Setup Complete!\n');
    console.log('─────────────────────────────────────────────────');
    console.log('Resume public URL:', publicUrl);
    console.log('─────────────────────────────────────────────────');
    console.log('\nIf site_config save failed, run the SQL shown above in:');
    console.log('Supabase Dashboard → SQL Editor\n');
}

run().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
