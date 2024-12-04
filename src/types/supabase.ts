export interface Database {
  public: {
    Tables: {
      enrollments: {
        Row: {
          id: string;
          created_at: string;
          type: 'ambassador' | 'business' | 'subscriber';
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          church: string | null;
          commitments: string[];
          commitments_accepted: boolean;
          business_name: string | null;
          website: string | null;
          address: string | null;
          description: string | null;
          support_type: string[];
          subscription_tier: string | null;
          payment_method: string | null;
          billing_address: {
            street: string;
            city: string;
            state: string;
            zip: string;
          } | null;
        };
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
      churches: {
        Row: {
          id: string;
          name: string;
          address: string;
          coordinates: {
            lat: number;
            lng: number;
          } | null;
          claimed_by: string | null;
          claimed_at: string | null;
          status: 'unclaimed' | 'claimed' | 'verified';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['churches']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['churches']['Insert']>;
      };
      church_members: {
        Row: {
          id: string;
          church_id: string;
          user_id: string;
          role: 'member' | 'admin' | 'youth_leader' | 'pastor';
          joined_at: string;
          status: 'active' | 'inactive';
          ministry_interests: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['church_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['church_members']['Insert']>;
      };
    };
  };
}