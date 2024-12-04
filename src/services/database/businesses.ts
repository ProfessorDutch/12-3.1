import { supabase } from '../../config/database/client';
import type { Database } from '../../types/supabase';

type Business = Database['public']['Tables']['businesses']['Row'];
type NewBusiness = Database['public']['Tables']['businesses']['Insert'];

export async function createBusiness(data: NewBusiness) {
  const { data: result, error } = await supabase
    .from('businesses')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getBusiness(id: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateBusiness(id: string, data: Partial<NewBusiness>) {
  const { data: result, error } = await supabase
    .from('businesses')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
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