import { supabase } from '../../config/supabase';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Read schema file
    const schema = readFileSync(
      join(__dirname, 'schema.sql'),
      'utf8'
    );

    // Execute schema
    const { error } = await supabase.rpc('exec', { sql: schema });

    if (error) {
      console.error('Error setting up database:', error);
      process.exit(1);
    }

    // Test connection
    const { data, error: testError } = await supabase
      .from('churches')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Database test failed:', testError);
      process.exit(1);
    }

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to setup database:', err);
    process.exit(1);
  }
}

setupDatabase();