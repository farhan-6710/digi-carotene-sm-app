import { supabase } from "@/shared/lib/supabase";
import { unlinkProfilesFromClient } from "@/features/auth/utils/profileRepository";
import type { Client, ClientSocials } from "../types/types";

function formatDeleteClientError(error: { code?: string; message?: string }): Error {
  if (error.code === "23503") {
    return new Error(
      "This brand is linked to one or more portal logins (profiles.client_id). Run scripts/clients-fk-on-delete-set-null.sql in Supabase SQL Editor, then try again. Portal users will keep their login but lose portal access until you assign a new brand.",
    );
  }

  return new Error(error.message ?? "Failed to delete client.");
}

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("client_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Client[];
}

export async function fetchClientById(clientId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Client | null) ?? null;
}

export type CreateClientInput = {
  clientName: string;
  mobileNumber?: string | null;
  websiteName?: string | null;
  socials?: ClientSocials | null;
};

export type UpdateClientInput = {
  clientName: string;
  mobileNumber?: string | null;
  websiteName?: string | null;
  socials?: ClientSocials | null;
};

export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      client_name: input.clientName,
      mobile_number: input.mobileNumber || null,
      website_name: input.websiteName || null,
      socials: input.socials || {},
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Client;
}

export async function updateClient(
  clientId: string,
  input: UpdateClientInput,
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .update({
      client_name: input.clientName,
      mobile_number: input.mobileNumber || null,
      website_name: input.websiteName || null,
      socials: input.socials || {},
    })
    .eq("id", clientId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as Client;
}

export async function deleteClient(clientId: string): Promise<void> {
  try {
    await unlinkProfilesFromClient(clientId);
  } catch {
    // Unlink may fail under RLS; ON DELETE SET NULL on the FK still allows delete.
  }

  const { error } = await supabase.from("clients").delete().eq("id", clientId);

  if (error) {
    throw formatDeleteClientError(error);
  }
}
