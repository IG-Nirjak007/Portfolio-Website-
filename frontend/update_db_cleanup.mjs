import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Cleaning up social links...");
  // delete all social links (not strictly supported without a filter, so we filter by id > 0)
  await supabase.from('social_link').delete().gt('id', 0);

  console.log("Inserting exact social links...");
  const res = await supabase.from('social_link').insert([
    { platform: 'Instagram', url: 'https://instagram.com/Nirjak__007' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/nirjak-bhattarai/' },
    { platform: 'Email', url: 'mailto:nirjakbhattarai1@gmail.com' }
  ]);
  console.log(res.error ? res.error : "Success inserting socials");
  
  console.log("Updating Portfolio link (was previously overwritten)...");
  await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/Portfolio-Website-' }).ilike('title', '%Portfolio%');

}

run();
