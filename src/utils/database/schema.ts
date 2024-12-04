import { supabase } from '../../config/supabase';
import fs from 'fs';
import path from 'path';

export async function reloadSchema() {
  try {
    console.log('Reloading database schema...');
    
    // Read migration file
    const schemaPath = path.join(__dirname, 'migrations', '01_initial_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    const { error } = await supabase.rpc('exec', { sql: schema });

    if (error) {
      console.error('Error reloading schema:', error);
      return { success: false, error: error.message };
    }

    // Verify policies are in place
    const { data: policies, error: policiesError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);

    if (policiesError) {
      console.error('Error verifying policies:', policiesError);
      return { success: false, error: policiesError.message };
    }

    console.log('Schema and policies reloaded successfully');
    return { success: true };
  } catch (err) {
    console.error('Failed to reload schema:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}