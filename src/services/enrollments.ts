import { supabase } from '../config/supabase';

export class EnrollmentService {
  static async createAmbassadorEnrollment(enrollment: {
    type: 'ambassador';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    church?: string;
    commitments: string[];
  }) {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          type: enrollment.type,
          first_name: enrollment.firstName,
          last_name: enrollment.lastName,
          email: enrollment.email,
          phone: enrollment.phone || null,
          church: enrollment.church || null,
          commitments: enrollment.commitments,
          commitments_accepted: true
        })
        .select()
        .single();

      if (error) {
        console.error('Enrollment error:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to create ambassador enrollment:', err);
      throw err;
    }
  }

  static async createBusinessEnrollment(formData: {
    businessName: string;
    firstName: string;
    lastName: string;
    businessEmail: string;
    phone: string;
    website: string;
    business_address: string;
    description: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('free_businesses')
        .insert({
          business_name: formData.businessName.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          business_email: formData.businessEmail.trim(),
          phone: formData.phone.trim(),
          website: formData.website.trim(),
          business_address: formData.business_address.trim(),
          description: formData.description.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Business enrollment error:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to create business enrollment:', err);
      throw err;
    }
  }

  static async getEnrollmentById(id: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}