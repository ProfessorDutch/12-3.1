import { createClient } from '@supabase/supabase-js';
import { DATABASE_CONFIG, AUTH_CONFIG } from './constants';

// Create a Supabase client instance
const supabase = createClient(DATABASE_CONFIG.url, DATABASE_CONFIG.anonKey, {
  auth: AUTH_CONFIG,
  db: {
    pooler: true,
    ...DATABASE_CONFIG.pooler
  }
});

export default supabase;