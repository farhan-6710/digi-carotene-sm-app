import type { Client } from "@/features/clients-management/types/types";

export type ClientFormValues = {
  clientName: string;
  email: string;
  mobileNumber: string;
  websiteName: string;
  isActive: boolean;
};

export type ClientFormField = keyof Omit<ClientFormValues, "isActive">;

export const emptyClientFormValues = (): ClientFormValues => ({
  clientName: "",
  email: "",
  mobileNumber: "",
  websiteName: "",
  isActive: true,
});

export function clientToFormValues(client: Client): ClientFormValues {
  return {
    clientName: client.client_name,
    email: client.email ?? "",
    mobileNumber: client.mobile_number ?? "",
    websiteName: client.website_name ?? "",
    isActive: client.is_active,
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
