/**
 * save_resume_url.mjs
 * After uploading your PDF to Supabase Storage manually,
 * run this script to save the public URL into site_config.
 * 
 * Usage: node save_resume_url.mjs "YOUR_PUBLIC_URL_HERE"
 * 
 * Example:
 * node save_resume_url.mjs "https://qmxsgacspqmevbtkjtix.supabase.co/storage/v1/object/public/resumes/Nirjak_Resume.pdf"
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const resumeUrl = process.argv[2];
if (!resumeUrl) {
    console.log('\n❌ Please provide the resume URL as argument.');
    console.log('Usage: node save_resume_url.mjs "YOUR_PUBLIC_URL"\n');
    process.exit(1);
}

async function run() {
    console.log('\n💾 Saving resume URL to site_config...');
    console.log('URL:', resumeUrl);

    const { error } = await supabase
        .from('site_config')
        .upsert({ key: 'resume_url', value: resumeUrl }, { onConflict: 'key' });

    if (error) {
        console.error('\n✗ Failed:', error.message);
        console.log('\n→ Make sure you ran supabase_setup.sql first in Supabase SQL Editor!');
        process.exit(1);
    }

    console.log('\n✅ Resume URL saved successfully!');
    console.log('Your portfolio will now show the Download Resume button.\n');
}

run();
