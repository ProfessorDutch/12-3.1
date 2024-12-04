import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EnrollmentService } from '../../services/enrollments';
import { useFormErrors } from '../../hooks/useFormErrors';
import AmbassadorFormFields from './ambassador/AmbassadorFormFields';
import AmbassadorCommitments from './ambassador/AmbassadorCommitments';
import AmbassadorSuccess from './ambassador/AmbassadorSuccess';

interface AmbassadorFormProps {
  onClose: () => void;
}

export default function AmbassadorForm({ onClose }: AmbassadorFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
    commitments: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError, clearAllErrors } = useFormErrors();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleCommitmentToggle = (commitment: string) => {
    setFormData(prev => ({
      ...prev,
      commitments: prev.commitments.includes(commitment)
        ? prev.commitments.filter(c => c !== commitment)
        : [...prev.commitments, commitment]
    }));
    clearError('commitments');
  };

  const validateForm = () => {
    let isValid = true;
    clearAllErrors();

    if (!formData.firstName.trim()) {
      setError('firstName', 'First name is required');
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      setError('lastName', 'Last name is required');
      isValid = false;
    }
    if (!formData.email.trim()) {
      setError('email', 'Email is required');
      isValid = false;
    }
    if (formData.commitments.length === 0) {
      setError('commitments', 'Please accept at least one commitment');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await EnrollmentService.createAmbassadorEnrollment({
        type: 'ambassador',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        church: formData.church,
        commitments: formData.commitments
      });

      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to submit enrollment:', err);
      setError('submit', err instanceof Error ? err.message : 'Failed to submit enrollment');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
          <AmbassadorSuccess onClose={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-patriot-navy">Become an Ambassador</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AmbassadorFormFields 
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />

          <AmbassadorCommitments
            commitments={formData.commitments}
            errors={errors}
            onToggle={handleCommitmentToggle}
          />

          {errors.submit && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-patriot-red text-white py-3 rounded-full font-semibold hover:bg-patriot-crimson transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}