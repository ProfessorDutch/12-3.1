import React, { useState } from 'react';
import { BusinessFormData, ClaimedBusiness } from '../../types/business';
import { BusinessService } from '../../services/api/businessService';
import { validateBusinessForm } from '../../utils/validation/businessValidation';
import { useFormErrors } from '../../hooks/useFormErrors';
import ContactSection from './business/ContactSection';
import BusinessDetailsSection from './business/BusinessDetailsSection';
import FormHeader from './business/FormHeader';
import FormActions from './business/FormActions';

interface BusinessClaimFormProps {
  existingBusiness?: ClaimedBusiness;
  onBack: () => void;
  onComplete: () => void;
}

export default function BusinessClaimForm({
  existingBusiness,
  onBack,
  onComplete
}: BusinessClaimFormProps) {
  const { errors, setError, clearError, clearAllErrors } = useFormErrors();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BusinessFormData>({
    first_name: '',
    last_name: '',
    contact_email: '',
    phone: null,
    church: null,
    business_name: existingBusiness?.business_name || null,
    business_address: existingBusiness?.business_address || null,
    website: existingBusiness?.website || null,
    business_description: existingBusiness?.business_description || null,
    subscription_tier: 'basic',
    monthly_fee: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();
    setLoading(true);

    try {
      // Validate form data
      const validationResult = await validateBusinessForm(formData);
      if ('errors' in validationResult) {
        validationResult.errors.forEach(({ field, message }) => setError(field, message));
        return;
      }

      // Submit form data
      if (existingBusiness) {
        await BusinessService.update(existingBusiness.id, formData);
      } else {
        await BusinessService.create(formData);
      }
      
      onComplete();
    } catch (err) {
      setError('submit', err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const handleFormUpdate = (updates: Partial<BusinessFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear any errors for updated fields
    Object.keys(updates).forEach(field => {
      if (errors[field]) {
        clearError(field);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormHeader isExisting={!!existingBusiness} />
      
      <ContactSection 
        formData={formData}
        onChange={handleFormUpdate}
        errors={errors}
      />

      <BusinessDetailsSection
        formData={formData}
        onChange={handleFormUpdate}
        errors={errors}
      />

      {errors.submit && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {errors.submit}
        </div>
      )}

      <FormActions
        loading={loading}
        onBack={onBack}
      />
    </form>
  );
}