import { supabase } from '../config/supabase';
import type { Database } from '../types/supabase';

type Tables = Database['public']['Tables'];

export async function createEnrollment<T extends keyof Tables>(
  table: T,
  data: Tables[T]['Insert']
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create enrollment: ${error.message}`);
  }

  return result;
}

export async function getEnrollments<T extends keyof Tables>(
  table: T,
  query?: { column: string; value: any }
) {
  let queryBuilder = supabase.from(table).select('*');

  if (query) {
    queryBuilder = queryBuilder.eq(query.column, query.value);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch enrollments: ${error.message}`);
  }

  return data;
}

export async function updateEnrollment<T extends keyof Tables>(
  table: T,
  id: string,
  data: Partial<Tables[T]['Update']>
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update enrollment: ${error.message}`);
  }

  return result;
}