import supabase from './client';

export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error: error.message };
    }

    console.log('Database connection successful:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}