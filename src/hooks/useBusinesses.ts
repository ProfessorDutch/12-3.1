import { useCallback } from 'react';
import { useSupabase } from './useSupabase';
import * as BusinessService from '../services/businesses';
import type { Database } from '../types/supabase';

type Business = Database['public']['Tables']['businesses']['Row'];

export function useBusinesses() {
  const { loading, error, execute } = useSupabase<Business[]>();

  const searchBusinesses = useCallback(
    (
      query: string,
      location: { lat: number; lng: number },
      radius: number,
      filters: { donorsOnly: boolean; type?: string }
    ) => {
      return execute(BusinessService.searchBusinesses(query, location, radius, filters));
    },
    [execute]
  );

  const claimBusiness = useCallback(
    (businessId: string, userId: string) => {
      return execute(BusinessService.claimBusiness(businessId, userId));
    },
    [execute]
  );

  return {
    loading,
    error,
    searchBusinesses,
    claimBusiness
  };
}