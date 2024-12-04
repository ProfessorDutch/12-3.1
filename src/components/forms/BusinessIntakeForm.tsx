import React, { useState } from 'react';
import { Building2, Mail, MapPin, Phone, Globe, Heart, ArrowRight, X } from 'lucide-react';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useFormErrors } from '../../hooks/useFormErrors';
import PlacesAutocomplete from '../PlacesAutocomplete';

interface BusinessIntakeFormProps {
  onClose: () => void;
}

export default function BusinessIntakeForm({ onClose }: BusinessIntakeFormProps) {
  const { submitBusinessEnrollment, loading, error, success } = useEnrollment();
  const { errors, setError, clearError, clearAllErrors } = useFormErrors();
  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    businessEmail: '',
    phone: '',
    website: '',
    business_address: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleAddressSelect = (address: string) => {
    setFormData(prev => ({ ...prev, business_address: address }));
    clearError('business_address');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    // Validate required fields
    if (!formData.businessName.trim()) {
      setError('businessName', 'Business name is required');
      return;
    }
    if (!formData.firstName.trim()) {
      setError('firstName', 'First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('lastName', 'Last name is required');
      return;
    }
    if (!formData.businessEmail.trim()) {
      setError('businessEmail', 'Business email is required');
      return;
    }
    if (!formData.business_address.trim()) {
      setError('business_address', 'Business address is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('description', 'Business description is required');
      return;
    }

    try {
      await submitBusinessEnrollment(formData);
    } catch (err) {
      setError('submit', err instanceof Error ? err.message : 'Failed to submit form');
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
          <div className="text-center">
            <Heart className="w-12 h-12 text-patriot-red mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-patriot-navy mb-4">
              Thank You for Joining Our Community!
            </h3>
            <p className="text-patriot-blue mb-6">
              We'll review your information and get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="bg-patriot-red text-white px-8 py-3 rounded-full hover:bg-patriot-crimson transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-patriot-navy">Business Partnership</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline-block mr-2" />
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.businessName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline-block mr-2" />
              Business Email
            </label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.businessEmail ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
            />
            {errors.businessEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.businessEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline-block mr-2" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="w-4 h-4 inline-block mr-2" />
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline-block mr-2" />
              Business Address
            </label>
            <PlacesAutocomplete
              value={formData.business_address}
              onChange={(value) => handleAddressSelect(value)}
              onSelect={handleAddressSelect}
            />
            {errors.business_address && (
              <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
              placeholder="Tell us about your business and how you'd like to support youth ministry..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-patriot-red text-white hover:bg-patriot-crimson transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : (
                <>
                  Complete Registration <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}