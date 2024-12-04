import { useState, useCallback } from 'react';
import { EnrollmentService } from '../services/enrollments';
import { AppError } from '../utils/errors';

interface UseEnrollmentState {
  loading: boolean;
  error: AppError | null;
  success: boolean;
}

export function useEnrollment() {
  const [state, setState] = useState<UseEnrollmentState>({
    loading: false,
    error: null,
    success: false
  });

  const submitAmbassadorEnrollment = useCallback(async (formData: any) => {
    setState({ loading: true, error: null, success: false });
    try {
      const enrollment = {
        type: 'ambassador',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        church: formData.church,
        commitments: formData.commitments
      };

      await EnrollmentService.createAmbassadorEnrollment(enrollment);
      setState({ loading: false, error: null, success: true });
    } catch (error) {
      setState({
        loading: false,
        error: new AppError(error instanceof Error ? error.message : 'Failed to submit enrollment'),
        success: false
      });
    }
  }, []);

  const submitBusinessEnrollment = useCallback(async (formData: any) => {
    setState({ loading: true, error: null, success: false });
    try {
      await EnrollmentService.createBusinessEnrollment(formData);
      setState({ loading: false, error: null, success: true });
    } catch (error) {
      setState({
        loading: false,
        error: new AppError(error instanceof Error ? error.message : 'Failed to submit enrollment'),
        success: false
      });
    }
  }, []);

  return {
    ...state,
    submitAmbassadorEnrollment,
    submitBusinessEnrollment
  };
}