import { supabase } from '../../config/supabase';

export async function testConnection() {
  try {
    console.log('Testing database connection...');

    // First test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('churches')
      .select('count')
      .single();

    if (connectionError) {
      console.error('Database connection error:', connectionError);
      return { success: false, error: connectionError.message };
    }

    console.log('Connection test successful:', connectionTest);

    // Test insert capability
    const testChurch = {
      name: 'Test Church',
      address: '123 Test St, Test City, TS 12345',
      coordinates: { lat: 33.7490, lng: -84.3880 },
      members: 100,
      status: 'unclaimed'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('churches')
      .insert(testChurch)
      .select()
      .single();

    if (insertError) {
      console.error('Insert test failed:', insertError);
      return { success: false, error: insertError.message };
    }

    // Clean up test data
    if (insertTest?.id) {
      await supabase
        .from('churches')
        .delete()
        .eq('id', insertTest.id);
    }

    console.log('Database connection and write test successful');
    return { success: true };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}