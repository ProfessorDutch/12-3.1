const GOOGLE_MAPS_API_KEY = 'AIzaSyDTa2qStQ1jaIvxbP6dGZEQeQJYDhF39Dw';

export const GOOGLE_MAPS_CONFIG = {
  apiKey: GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geometry', 'geocoding'] as const,
  region: 'US',
  language: 'en'
};

let isLoaded = false;
let loadError: Error | null = null;
let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  if (isLoaded) return Promise.resolve();
  if (loadError) return Promise.reject(loadError);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&region=${GOOGLE_MAPS_CONFIG.region}&language=${GOOGLE_MAPS_CONFIG.language}`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        isLoaded = true;
        resolve();
      };

      script.onerror = (error) => {
        loadError = new Error('Failed to load Google Maps script');
        reject(loadError);
      };

      document.head.appendChild(script);
    } catch (err) {
      loadError = err instanceof Error ? err : new Error('Failed to load Google Maps script');
      reject(loadError);
    }
  });

  return loadPromise;
}

export function getLoadingState() {
  return {
    isLoaded,
    error: loadError
  };
}