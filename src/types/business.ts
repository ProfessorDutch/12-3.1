export interface BusinessFormData {
  first_name: string;
  last_name: string;
  contact_email: string;
  church: string | null;
  business_name: string;
  business_address: string;
  website: string | null;
  business_description: string;
}

export interface ClaimedBusiness {
  id: string;
  first_name: string;
  last_name: string;
  contact_email: string;
  church: string | null;
  business_name: string;
  business_address: string;
  website: string | null;
  business_description: string;
  created_at: string;
  updated_at?: string;
}

export interface BusinessSearchResult {
  id: string;
  name: string;
  address: string;
  claimed: boolean;
}