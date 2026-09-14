import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: projects } = await supabase.from('project').select('*');
  console.log("Projects:", JSON.stringify(projects, null, 2));

  const { data: experiences } = await supabase.from('experience').select('*');
  console.log("Experiences:", JSON.stringify(experiences, null, 2));
}

run();
