export type Client = {
  id: string;
  client_name: string;
  email: string | null;
  primary_contact_name: string | null;
  mobile_number: string | null;
  secondary_contact_name: string | null;
  secondary_mobile_number: string | null;
  website_name: string | null;
  is_active: boolean;
  created_at: string;
};
