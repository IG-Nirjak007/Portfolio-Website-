import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching all projects...");
  const { data: projects, error } = await supabase.from('project').select('*').order('id', { ascending: true });
  if (error) {
    console.error("Error fetching:", error);
    return;
  }
  
  console.log(`Found ${projects.length} projects.`);
  
  const seenTitles = new Set();
  const idsToDelete = [];
  
  for (const proj of projects) {
    if (seenTitles.has(proj.title)) {
      idsToDelete.push(proj.id);
    } else {
      seenTitles.add(proj.title);
    }
  }
  
  if (idsToDelete.length > 0) {
    console.log(`Deleting ${idsToDelete.length} duplicates...`);
    const { error: deleteError } = await supabase.from('project').delete().in('id', idsToDelete);
    if (deleteError) {
      console.error("Error deleting:", deleteError);
    } else {
      console.log("Duplicates deleted successfully.");
    }
  } else {
    console.log("No duplicates found.");
  }
}

run();
