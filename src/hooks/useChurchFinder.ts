import { useState } from 'react';
import { Church } from '../types/church';
import { useGoogleMaps } from './useGoogleMaps';
import { searchChurches, claimChurch as claimChurchService } from '../services/churches';

export function useChurchFinder() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { geocodeAddress, isLoaded } = useGoogleMaps();

  const handleSearchChurches = async (name: string, location: string, radius: number) => {
    if (!isLoaded) {
      setError('Maps service not ready');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const coordinates = await geocodeAddress(location);
      if (!coordinates) {
        throw new Error('Location not found');
      }

      const results = await searchChurches(name, coordinates, radius);
      setChurches(results);
    } catch (err) {
      console.error('Church search failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to search churches');
      setChurches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimChurch = async (churchId: string, userId: string) => {
    try {
      console.log('Claiming church:', { churchId, userId });
      const result = await claimChurchService(churchId, userId);
      
      // Update local state to reflect the claim
      setChurches(prev => prev.filter(church => church.id !== churchId));
      
      return result;
    } catch (err) {
      console.error('Failed to claim church:', err);
      throw err;
    }
  };

  return {
    churches,
    loading,
    error,
    searchChurches: handleSearchChurches,
    claimChurch: handleClaimChurch
  };
}