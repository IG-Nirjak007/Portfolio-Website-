/**
 * Supabase Storage Setup — Uses the REST API directly
 * to create bucket + upload resume without needing service role in storage.createBucket
 * 
 * IMPORTANT: This script needs the SERVICE ROLE KEY to create storage buckets.
 * The service role key is found in: Supabase Dashboard → Settings → API → service_role
 * 
 * Usage: node setup_supabase_storage.mjs YOUR_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const SUPABASE_URL = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';

// Service role key is passed as argument
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
    console.log('\n❌ Service role key required!');
    console.log('Usage: node setup_supabase_storage.mjs <SERVICE_ROLE_KEY>');
    console.log('\nGet it from: Supabase Dashboard → Settings → API → service_role secret\n');
    process.exit(1);
}

const RESUME_LOCAL_PATH = 'C:/Users/Acer/Downloads/Nirjak_Resume.pdf';
const BUCKET_NAME = 'resumes';
const RESUME_STORAGE_PATH = 'Nirjak_Resume.pdf';

// Admin client (service role — bypasses RLS)
const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
// Regular client (anon — for site_config with RLS)
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function run() {
    console.log('\n🚀 Supabase Storage + Config Setup\n');

    // ─── 1. Create bucket ─────────────────────────────────────────
    console.log('📦 Creating "resumes" storage bucket...');
    const { error: bucketError } = await adminSupabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760,
    });

    if (bucketError) {
        if (bucketError.message?.toLowerCase().includes('already exist') || bucketError.message?.toLowerCase().includes('duplicate')) {
            console.log('  ✓ Bucket already exists.');
        } else {
            console.error('  ✗ Bucket error:', bucketError.message);
        }
    } else {
        console.log('  ✓ Bucket created!');
    }

    // ─── 2. Upload resume ─────────────────────────────────────────
    console.log('\n📄 Uploading Nirjak_Resume.pdf...');
    const resumeFile = readFileSync(resolve(RESUME_LOCAL_PATH));
    console.log(`  ✓ Read file: ${(resumeFile.length / 1024).toFixed(1)} KB`);

    const { error: uploadError } = await adminSupabase.storage
        .from(BUCKET_NAME)
        .upload(RESUME_STORAGE_PATH, resumeFile, {
            contentType: 'application/pdf',
            upsert: true,
        });

    if (uploadError) {
        console.error('  ✗ Upload failed:', uploadError.message);
        process.exit(1);
    }
    console.log('  ✓ Uploaded successfully!');

    // ─── 3. Get public URL ────────────────────────────────────────
    const { data: urlData } = adminSupabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(RESUME_STORAGE_PATH);

    const publicUrl = urlData?.publicUrl;
    console.log('\n🔗 Public URL:');
    console.log(' ', publicUrl);

    // ─── 4. Create site_config table + save URL ───────────────────
    console.log('\n💾 Creating site_config table and saving resume URL...');

    // Use admin client to run SQL
    const { error: sqlError } = await adminSupabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS site_config (
                key   TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
        `
    });

    if (sqlError) {
        // rpc might not exist — try upsert directly (table might exist)
        console.log('  → RPC not available, trying direct upsert...');
    }

    // Upsert with admin client
    const { error: upsertError } = await adminSupabase
        .from('site_config')
        .upsert({ key: 'resume_url', value: publicUrl }, { onConflict: 'key' });

    if (upsertError) {
        console.warn('  ⚠ site_config upsert failed:', upsertError.message);
        console.log('\n  → Please run this SQL in Supabase SQL Editor:');
        console.log(`
  CREATE TABLE IF NOT EXISTS site_config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
  CREATE POLICY IF NOT EXISTS "Public read site_config" ON site_config FOR SELECT TO public USING (true);
  CREATE POLICY IF NOT EXISTS "Auth write site_config" ON site_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
  INSERT INTO site_config (key, value) VALUES ('resume_url', '${publicUrl}')
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        `);
    } else {
        console.log('  ✓ site_config saved!');
    }

    console.log('\n✅ Done! Resume is live at:');
    console.log(`  ${publicUrl}\n`);
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
