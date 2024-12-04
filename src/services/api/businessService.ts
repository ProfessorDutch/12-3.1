import { supabase } from '../../config/supabase';
import { BusinessFormData, ClaimedBusiness } from '../../types/business';
import { AppError } from '../../utils/errors';

export class BusinessService {
  static async create(formData: BusinessFormData) {
    try {
      // Validate required fields
      if (!formData.business_name || !formData.business_description || !formData.business_address) {
        throw new AppError('Please fill in all required business information');
      }

      // Clean website URL - only remove http/https, keep www if present
      const website = formData.website?.replace(/^https?:\/\//, '') || null;

      const { data, error } = await supabase
        .from('free_businesses')
        .insert({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          contact_email: formData.contact_email.trim(),
          church: formData.church?.trim() || null,
          business_name: formData.business_name.trim(),
          business_address: formData.business_address.trim(),
          website,
          business_description: formData.business_description.trim(),
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new AppError(
          'Failed to create business. Please try again.',
          error.code,
          error
        );
      }

      return data;
    } catch (err) {
      console.error('Failed to create business:', err);
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        'An unexpected error occurred. Please try again.',
        undefined,
        err
      );
    }
  }

  static async update(id: string, formData: Partial<BusinessFormData>) {
    try {
      if (!id) {
        throw new AppError('Business ID is required');
      }

      // Clean website URL if provided
      const website = formData.website?.replace(/^https?:\/\//, '') || null;

      const { data, error } = await supabase
        .from('free_businesses')
        .update({
          ...formData,
          website,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new AppError(
          'Failed to update business. Please try again.',
          error.code,
          error
        );
      }

      return data;
    } catch (err) {
      console.error('Failed to update business:', err);
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        'An unexpected error occurred. Please try again.',
        undefined,
        err
      );
    }
  }

  static async getById(id: string): Promise<ClaimedBusiness | null> {
    try {
      const { data, error } = await supabase
        .from('free_businesses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw new AppError(
          'Failed to fetch business details. Please try again.',
          error.code,
          error
        );
      }

      return data;
    } catch (err) {
      console.error('Failed to get business:', err);
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(
        'An unexpected error occurred. Please try again.',
        undefined,
        err
      );
    }
  }
}