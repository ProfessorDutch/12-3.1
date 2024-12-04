import React from 'react';
import { Mail } from 'lucide-react';
import { BusinessFormData } from '../../../types/business';

interface ContactSectionProps {
  formData: BusinessFormData;
  onChange: (updates: Partial<BusinessFormData>) => void;
  errors?: Record<string, string>;
}

export default function ContactSection({ 
  formData, 
  onChange,
  errors = {}
}: ContactSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => onChange({ first_name: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
            required
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => onChange({ last_name: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
            required
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline-block mr-2" />
          Contact Email
        </label>
        <input
          type="email"
          value={formData.contact_email}
          onChange={(e) => onChange({ contact_email: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.contact_email ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
          required
        />
        {errors.contact_email && (
          <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
        )}
      </div>
    </div>
  );
}