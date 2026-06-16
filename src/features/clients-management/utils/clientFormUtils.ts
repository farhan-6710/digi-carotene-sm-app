import type { Client, ClientSocials } from "@/features/clients-management/types/types";

export type ClientFormValues = {
  clientName: string;
  mobileNumber: string;
  websiteName: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
};

export type ClientFormField = keyof ClientFormValues;

export const emptyClientFormValues = (): ClientFormValues => ({
  clientName: "",
  mobileNumber: "",
  websiteName: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
});

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    clientName: client.client_name,
    mobileNumber: client.mobile_number ?? "",
    websiteName: client.website_name ?? "",
    facebook: client.socials?.facebook ?? "",
    instagram: client.socials?.instagram ?? "",
    linkedin: client.socials?.linkedin ?? "",
    youtube: client.socials?.youtube ?? "",
  };
}

export function formValuesToSocials(
  values: ClientFormValues,
): ClientSocials {
  return {
    facebook: values.facebook.trim() || undefined,
    instagram: values.instagram.trim() || undefined,
    linkedin: values.linkedin.trim() || undefined,
    youtube: values.youtube.trim() || undefined,
  };
}
