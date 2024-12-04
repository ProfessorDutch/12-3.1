import supabase from '../../config/database/supabaseClient';

// Function to test the database connection
export async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Query the enrollments table to test the connection
    const { data, error } = await supabase
      .from('enrollments') // Table name, replace with your table if different
      .select('*') // Select all columns
      .limit(1) // Limit to one row to reduce load
      .single(); // Fetch a single row

    // Log the response for debugging
    console.log('Supabase Response:', { data, error });

    // Handle errors from Supabase
    if (error) {
      console.error('Database connection error:', error);
      return { 
        success: false, 
        error: error.message // Return the error message for debugging
      };
    }

    // Return success if the query was successful
    return { 
      success: true, 
      data 
    };
  } catch (err) {
    // Catch unexpected errors and return them
    console.error('Unexpected error during connection test:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}
