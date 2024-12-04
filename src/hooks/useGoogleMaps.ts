import { useState, useEffect } from 'react';
import { loadGoogleMapsScript, getLoadingState } from '../config/maps/loader';
import { GOOGLE_MAPS_CONFIG } from '../config/maps/constants';

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(getLoadingState().isLoaded);
  const [isLoading, setIsLoading] = useState(getLoadingState().isLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaps = async () => {
      if (!isLoaded && !isLoading) {
        setIsLoading(true);
        try {
          await loadGoogleMapsScript();
          setIsLoaded(true);
          setError(null);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load Google Maps';
          setError(errorMessage);
          console.error('Google Maps initialization error:', errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMaps();
  }, [isLoaded, isLoading]);

  const geocodeAddress = async (address: string): Promise<google.maps.LatLngLiteral | null> => {
    if (!isLoaded) {
      setError('Google Maps API not loaded');
      return null;
    }

    try {
      const geocoder = new google.maps.Geocoder();
      const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      });

      if (response[0]?.geometry?.location) {
        return {
          lat: response[0].geometry.location.lat(),
          lng: response[0].geometry.location.lng()
        };
      }

      throw new Error('No location found');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to geocode address';
      console.error('Geocoding error:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  return {
    isLoaded,
    isLoading,
    error,
    geocodeAddress,
    config: GOOGLE_MAPS_CONFIG
  };
}