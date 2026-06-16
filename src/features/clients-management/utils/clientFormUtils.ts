import type { Client } from "@/features/clients-management/types/types";

export type ClientFormValues = {
  clientName: string;
  mobileNumber: string;
  websiteName: string;
};

export type ClientFormField = keyof ClientFormValues;

export const emptyClientFormValues = (): ClientFormValues => ({
  clientName: "",
  mobileNumber: "",
  websiteName: "",
});

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    clientName: client.client_name,
    mobileNumber: client.mobile_number ?? "",
    websiteName: client.website_name ?? "",
  };
}
