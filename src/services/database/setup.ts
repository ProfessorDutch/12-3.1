import { supabase } from '../../config/database/supabaseClient';
import fs from 'fs';
import path from 'path';

export async function setupDatabase() {
  try {
    // Read schema file
    const schema = fs.readFileSync(
      path.join(__dirname, '../utils/database/schema.sql'),
      'utf8'
    );

    // Execute schema
    const { error } = await supabase.rpc('exec', { sql: schema });

    if (error) {
      console.error('Error setting up database:', error);
      return false;
    }

    console.log('Database setup completed successfully');
    return true;
  } catch (err) {
    console.error('Failed to setup database:', err);
    return false;
  }
}