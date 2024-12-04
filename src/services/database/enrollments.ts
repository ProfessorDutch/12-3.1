import supabase from '../../config/database/client';
import type { Database } from '../../types/supabase';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type NewEnrollment = Database['public']['Tables']['enrollments']['Insert'];

export async function createEnrollment(data: NewEnrollment) {
  const { data: result, error } = await supabase
    .from('enrollments')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Failed to create enrollment:', error);
    throw error;
  }

  return result;
}

export async function getEnrollments(query?: { column: string; value: any }) {
  let queryBuilder = supabase
    .from('enrollments')
    .select('*');

  if (query) {
    queryBuilder = queryBuilder.eq(query.column, query.value);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error('Failed to fetch enrollments:', error);
    throw error;
  }

  return data;
}