export type ClientSocials = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
};

export type Client = {
  id: string;
  client_name: string;
  mobile_number: string | null;
  website_name: string | null;
  socials: ClientSocials | null;
  created_at: string;
};
