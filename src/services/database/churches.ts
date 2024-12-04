import { supabase } from '../../config/database/client';
import type { Database } from '../../types/supabase';

type Church = Database['public']['Tables']['churches']['Row'];
type NewChurch = Database['public']['Tables']['churches']['Insert'];

export async function createChurch(data: NewChurch) {
  const { data: result, error } = await supabase
    .from('churches')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getChurch(id: string) {
  const { data, error } = await supabase
    .from('churches')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateChurch(id: string, data: Partial<NewChurch>) {
  const { data: result, error } = await supabase
    .from('churches')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function claimChurch(churchId: string, userId: string) {
  const { data, error } = await supabase
    .from('churches')
    .update({ claimed_by: userId })
    .eq('id', churchId)
    .is('claimed_by', null)
    .select()
    .single();

  if (error) throw error;
  return data;
}