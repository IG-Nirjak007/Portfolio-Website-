import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Updating child safe...");
  let res = await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/ChildSafe-BrowingExtension-AI' }).ilike('title', '%Child%');
  console.log(res.error ? res.error : "Success");
  
  console.log("Updating QA...");
  res = await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/QA-automation-testing' }).or('title.ilike.%QA%,title.ilike.%OpenCart%');
  console.log(res.error ? res.error : "Success");
  
  console.log("Updating Portfolio...");
  res = await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/Portfolio-Website-' }).ilike('title', '%Portfolio%');
  console.log(res.error ? res.error : "Success");
  
  console.log("Updating Todo...");
  res = await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/Simple-To-Do-List' }).or('title.ilike.%To-Do%,title.ilike.%Todo%');
  console.log(res.error ? res.error : "Success");
  
  console.log("Updating Web Project...");
  res = await supabase.from('project').update({ link: 'https://github.com/IG-Nirjak007/Web_Project' }).or('title.ilike.%E-Commerce%,title.ilike.%Web%');
  console.log(res.error ? res.error : "Success");

  console.log("Inserting social links...");
  res = await supabase.from('social_link').insert([
    { platform: 'Instagram', url: 'https://instagram.com/Nirjak__007' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/nirjak-bhattarai/' },
    { platform: 'Email', url: 'mailto:nirjakbhattarai1@gmail.com' }
  ]);
  console.log(res.error ? res.error : "Success inserting socials");

  console.log("Done.");
}

run();
