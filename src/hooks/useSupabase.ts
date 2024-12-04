import { useState, useCallback } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { handleSupabaseError, isSupabaseError, AppError } from '../utils/errors';

interface UseSupabaseState<T> {
  data: T | null;
  error: AppError | null;
  loading: boolean;
}

interface UseSupabaseOptions {
  onError?: (error: AppError) => void;
  onSuccess?: () => void;
}

export function useSupabase<T>(options: UseSupabaseOptions = {}) {
  const [state, setState] = useState<UseSupabaseState<T>>({
    data: null,
    error: null,
    loading: false
  });

  const handleError = useCallback((error: unknown) => {
    const appError = isSupabaseError(error)
      ? handleSupabaseError(error)
      : new AppError(
          error instanceof Error ? error.message : 'An unexpected error occurred'
        );

    setState(prev => ({ ...prev, error: appError, loading: false }));
    options.onError?.(appError);
  }, [options]);

  const execute = useCallback(async <R>(
    promise: Promise<R>,
    transform?: (result: R) => T
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await promise;
      const data = transform ? transform(result) : (result as T);
      setState({ data, error: null, loading: false });
      options.onSuccess?.();
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [handleError, options]);

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, error: null, loading: false });
    }, [])
  };
}