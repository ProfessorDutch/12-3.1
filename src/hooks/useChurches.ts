import { useCallback } from 'react';
import { useSupabase } from './useSupabase';
import * as ChurchService from '../services/churches';
import type { Database } from '../types/supabase';

type Church = Database['public']['Tables']['churches']['Row'];

export function useChurches() {
  const { loading, error, execute } = useSupabase<Church[]>();

  const searchChurches = useCallback(
    (query: string, location: { lat: number; lng: number }, radius: number) => {
      return execute(ChurchService.searchChurches(query, location, radius));
    },
    [execute]
  );

  const claimChurch = useCallback(
    (churchId: string, userId: string) => {
      return execute(ChurchService.claimChurch(churchId, userId));
    },
    [execute]
  );

  return {
    loading,
    error,
    searchChurches,
    claimChurch
  };
}