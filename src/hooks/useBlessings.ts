import { useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { BlessingsService, Blessing, NewBlessing } from '../services/blessings';

export function useBlessings() {
  const { data: blessings, loading, error, execute } = useSupabase<Blessing[]>();

  const fetchBlessings = useCallback(() => {
    return execute(BlessingsService.getAll());
  }, [execute]);

  const createBlessing = useCallback(async (blessing: NewBlessing) => {
    return execute(BlessingsService.create(blessing));
  }, [execute]);

  const updateBlessing = useCallback(async (id: string, updates: Partial<NewBlessing>) => {
    return execute(BlessingsService.update(id, updates));
  }, [execute]);

  const deleteBlessing = useCallback(async (id: string) => {
    return execute(BlessingsService.delete(id));
  }, [execute]);

  return {
    blessings,
    loading,
    error,
    fetchBlessings,
    createBlessing,
    updateBlessing,
    deleteBlessing
  };
}