import { supabase } from '../config/supabase';
import type { Database } from '../types/supabase';

export type Blessing = Database['public']['Tables']['blessings']['Row'];
export type NewBlessing = Database['public']['Tables']['blessings']['Insert'];

export class BlessingsService {
  static async getAll() {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('blessings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(blessing: NewBlessing) {
    const { data, error } = await supabase
      .from('blessings')
      .insert(blessing)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id: string, updates: Partial<NewBlessing>) {
    const { data, error } = await supabase
      .from('blessings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('blessings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}