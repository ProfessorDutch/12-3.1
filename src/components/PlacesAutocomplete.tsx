import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

interface PlacesAutocompleteProps {
  onSelect: (address: string, placeId?: string, location?: google.maps.LatLngLiteral) => void;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function PlacesAutocomplete({ 
  onSelect,
  placeholder = "Enter location...",
  defaultValue = "",
  value,
  onChange
}: PlacesAutocompleteProps) {
  const { isLoaded, error } = useGoogleMaps();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  // Use controlled or uncontrolled input consistently
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : inputValue;

  useEffect(() => {
    if (defaultValue && !isControlled) {
      setInputValue(defaultValue);
    }
  }, [defaultValue, isControlled]);

  useEffect(() => {
    if (isLoaded && !autocomplete) {
      const input = document.getElementById('places-autocomplete') as HTMLInputElement;
      if (input) {
        const newAutocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'place_id', 'geometry']
        });

        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          if (place.formatted_address) {
            const newValue = place.formatted_address;
            if (isControlled && onChange) {
              onChange(newValue);
            } else {
              setInputValue(newValue);
            }
            onSelect(
              place.formatted_address,
              place.place_id,
              place.geometry?.location ? {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              } : undefined
            );
          }
        });

        setAutocomplete(newAutocomplete);
      }
    }
  }, [isLoaded, onSelect, isControlled, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (isControlled && onChange) {
      onChange(newValue);
    } else {
      setInputValue(newValue);
    }
  };

  if (error) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Location search unavailable"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
          disabled
        />
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        id="places-autocomplete"
        type="text"
        value={currentValue}
        onChange={handleInputChange}
        disabled={!isLoaded}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}