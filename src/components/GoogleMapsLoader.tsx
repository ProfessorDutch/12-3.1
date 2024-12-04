import { useEffect, useState } from 'react';
import { loadGoogleMapsScript } from '../config/google-maps';

export default function GoogleMapsLoader() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        await loadGoogleMapsScript();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Google Maps');
        console.error('Google Maps loading error:', err);
      }
    };

    loadMaps();
  }, []);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50">
        <p className="text-sm">Maps functionality limited: {error}</p>
      </div>
    );
  }

  return null;
}