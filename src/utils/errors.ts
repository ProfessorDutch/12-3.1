import { PostgrestError } from '@supabase/supabase-js';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';

    // Log detailed error information
    if (originalError) {
      console.error('Original error:', originalError);
    }
  }
}

export function handleSupabaseError(error: PostgrestError): AppError {
  console.error('Supabase error:', error);
  const message = getErrorMessage(error);
  return new AppError(message, error.code, error);
}

function getErrorMessage(error: PostgrestError): string {
  switch (error.code) {
    case '23505':
      return 'This business already exists in our system.';
    case '23503':
      return 'Invalid reference. Please check your input.';
    case '42P01':
      return 'System error: Table not found. Please contact support.';
    case '42703':
      return 'System error: Invalid field. Please contact support.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

export function isSupabaseError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  );
}