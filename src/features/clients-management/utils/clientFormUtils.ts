import type { Client } from "@/features/clients-management/types/types";

export type ClientFormValues = {
  clientName: string;
  email: string;
  primaryContactName: string;
  mobileNumber: string;
  secondaryContactName: string;
  secondaryMobileNumber: string;
  websiteName: string;
  isActive: boolean;
};

export type ClientFormField = keyof Omit<ClientFormValues, "isActive">;

export const emptyClientFormValues = (): ClientFormValues => ({
  clientName: "",
  email: "",
  primaryContactName: "",
  mobileNumber: "",
  secondaryContactName: "",
  secondaryMobileNumber: "",
  websiteName: "",
  isActive: true,
});

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    clientName: client.client_name,
    email: client.email ?? "",
    primaryContactName: client.primary_contact_name ?? "",
    mobileNumber: client.mobile_number ?? "",
    secondaryContactName: client.secondary_contact_name ?? "",
    secondaryMobileNumber: client.secondary_mobile_number ?? "",
    websiteName: client.website_name ?? "",
    isActive: client.is_active ?? true,
  };
}

export function validateClientForm(values: ClientFormValues): string | null {
  if (!values.clientName.trim()) {
    return "Client name is required.";
  }

  const email = values.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid portal user email.";
  }

  return null;
}

export function normalizeClientEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}
