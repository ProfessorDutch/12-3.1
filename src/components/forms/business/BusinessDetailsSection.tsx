import React from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';
import { BusinessFormData } from '../../../types/business';
import PlacesAutocomplete from '../../PlacesAutocomplete';

interface BusinessDetailsSectionProps {
  formData: BusinessFormData;
  onChange: (updates: Partial<BusinessFormData>) => void;
  errors?: Record<string, string>;
}

export default function BusinessDetailsSection({ 
  formData, 
  onChange,
  errors = {}
}: BusinessDetailsSectionProps) {
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only remove http/https, keep www if present
    const value = e.target.value.replace(/^https?:\/\//, '');
    onChange({ website: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building2 className="w-4 h-4 inline-block mr-2" />
          Business Name
        </label>
        <input
          type="text"
          value={formData.business_name || ''}
          onChange={(e) => onChange({ business_name: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.business_name ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
          required
        />
        {errors.business_name && (
          <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="w-4 h-4 inline-block mr-2" />
          Business Address
        </label>
        <PlacesAutocomplete
          onSelect={(address) => onChange({ business_address: address })}
          value={formData.business_address || ''}
          placeholder="Enter business address"
        />
        {errors.business_address && (
          <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Globe className="w-4 h-4 inline-block mr-2" />
          Website
        </label>
        <input
          type="text"
          value={formData.website || ''}
          onChange={handleWebsiteChange}
          placeholder="www.example.com"
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.website ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Description
        </label>
        <textarea
          value={formData.business_description || ''}
          onChange={(e) => onChange({ business_description: e.target.value })}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.business_description ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
          required
          minLength={10}
        />
        {errors.business_description && (
          <p className="mt-1 text-sm text-red-600">{errors.business_description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Church Affiliation
        </label>
        <input
          type="text"
          value={formData.church || ''}
          onChange={(e) => onChange({ church: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent"
        />
      </div>
    </div>
  );
}