import { supabase } from '../config/supabase';
import type { BusinessFormData, ClaimedBusiness } from '../types/business';

export async function getBusinessByPlaceId(placeId: string): Promise<ClaimedBusiness | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('place_id', placeId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createBusiness(formData: BusinessFormData) {
  // Remove http/https from website
  const website = formData.website?.replace(/^(https?:\/\/)?(www\.)?/, '');

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      first_name: formData.first_name,
      last_name: formData.last_name,
      contact_email: formData.contact_email,
      phone: formData.phone,
      church: formData.church,
      business_name: formData.business_name,
      business_address: formData.business_address,
      website: website,
      business_description: formData.business_description,
      subscription_tier: formData.subscription_tier || 'basic',
      monthly_fee: formData.monthly_fee || 0,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBusiness(id: string, formData: Partial<BusinessFormData>) {
  // Remove http/https from website
  const website = formData.website?.replace(/^(https?:\/\/)?(www\.)?/, '');

  const { data, error } = await supabase
    .from('businesses')
    .update({
      ...formData,
      website: website,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function claimBusiness(businessId: string, userId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .update({ claimed_by: userId })
    .eq('id', businessId)
    .is('claimed_by', null)
    .select()
    .single();

  if (error) throw error;
  return data;
}