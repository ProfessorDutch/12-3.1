import { GOOGLE_MAPS_CONFIG, SCRIPT_CONFIG } from './constants';

let isLoading = false;
let isLoaded = false;
let loadError: Error | null = null;
let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  if (isLoaded) return Promise.resolve();
  if (loadError) return Promise.reject(loadError);
  if (loadPromise) return loadPromise;

  const existingScript = document.getElementById(SCRIPT_CONFIG.id);
  if (existingScript) {
    return Promise.resolve();
  }

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    try {
      (window as any)[SCRIPT_CONFIG.callbackName] = () => {
        isLoaded = true;
        isLoading = false;
        delete (window as any)[SCRIPT_CONFIG.callbackName];
        resolve();
      };

      const script = document.createElement('script');
      script.id = SCRIPT_CONFIG.id;
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&region=${GOOGLE_MAPS_CONFIG.region}&language=${GOOGLE_MAPS_CONFIG.language}&callback=${SCRIPT_CONFIG.callbackName}`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onerror = (event) => {
        const error = new Error('Failed to load Google Maps script');
        loadError = error;
        isLoading = false;
        reject(error);
      };

      document.head.appendChild(script);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load Google Maps script');
      loadError = error;
      isLoading = false;
      reject(error);
    }
  });

  return loadPromise;
}

export function getLoadingState() {
  return {
    isLoading,
    isLoaded,
    error: loadError
  };
}