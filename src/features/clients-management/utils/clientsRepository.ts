import { supabase } from "@/shared/lib/supabase";
import { unlinkProfilesFromClient, linkProfileByEmail } from "@/features/auth/utils/profileRepository";
import type { Client } from "../types/types";

function formatClientError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A client with this portal email already exists.");
  }

  return new Error(error.message ?? "Failed to save client.");
}

function formatDeleteClientError(error: {
  code?: string;
  message?: string;
}): Error {
  if (error.code === "23503") {
    return new Error(
      "This client is linked to portal logins or projects. Remove those first, then try again.",
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

export async function fetchClientById(
  clientId: string,
): Promise<Client | null> {
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
  email?: string | null;
  mobileNumber?: string | null;
  websiteName?: string | null;
};

export type UpdateClientInput = CreateClientInput;

export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      client_name: input.clientName,
      email: input.email?.trim().toLowerCase() || null,
      mobile_number: input.mobileNumber || null,
      website_name: input.websiteName || null,
    })
    .select("*")
    .single();

  if (error) {
    throw formatClientError(error);
  }

  if (input.email?.trim()) {
    try {
      await linkProfileByEmail(input.email);
    } catch {
      // Trigger should link; RPC is a fallback when triggers are missing.
    }
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
      email: input.email?.trim().toLowerCase() || null,
      mobile_number: input.mobileNumber || null,
      website_name: input.websiteName || null,
    })
    .eq("id", clientId)
    .select("*")
    .single();

  if (error) {
    throw formatClientError(error);
  }

  if (input.email?.trim()) {
    try {
      await linkProfileByEmail(input.email);
    } catch {
      // Trigger should link; RPC is a fallback when triggers are missing.
    }
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
