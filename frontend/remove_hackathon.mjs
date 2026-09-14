import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Removing Hackathon experience...");
  let res = await supabase.from('experience').delete().ilike('company', '%Hackathon%');
  console.log(res.error ? res.error : "Success");
  
  console.log("Updating PawTrace project description to remove hackathon...");
  res = await supabase.from('project').update({ description: 'Deep learning computer vision system to automate canine health issue detection and disease identification from image data.' }).ilike('title', '%PawTrace%');
  console.log(res.error ? res.error : "Success");
}

run();
