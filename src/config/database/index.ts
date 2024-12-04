import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);

    if (connectionError) {
      console.error('Database connection error:', connectionError);
      return { success: false, error: connectionError.message };
    }

    // Test insert with all fields
    const testEnrollment = {
      type: 'ambassador',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '123-456-7890',
      church: 'Test Church',
      commitments: ['Test commitment'],
      commitments_accepted: true,
      social_platforms: ['test'],
      status: 'pending'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('enrollments')
      .insert(testEnrollment)
      .select()
      .single();

    if (insertError) {
      console.error('Insert test failed:', insertError);
      return { success: false, error: insertError.message };
    }

    // Clean up test data
    if (insertTest?.id) {
      await supabase
        .from('enrollments')
        .delete()
        .eq('id', insertTest.id);
    }

    console.log('Database connection and schema test successful');
    return { success: true, data: { connectionTest, insertTest } };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}