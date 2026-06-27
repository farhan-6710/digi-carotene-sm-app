import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import {
  linkProfileByEmail,
  resetProfilesForClient,
} from "@/services/profilesService";
import type { Client } from "@/features/clients-management/types/types";

export type CreateClientInput = {
  clientName: string;
  email?: string | null;
  mobileNumber?: string | null;
  websiteName?: string | null;
};

export type UpdateClientInput = CreateClientInput;

function saveError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("A client with this portal email already exists.");
  }
  return new Error(error.message ?? "Failed to save client.");
}

// Turns form input into the snake_case columns the clients table expects.
function toClientColumns(input: CreateClientInput) {
  return {
    client_name: input.clientName,
    email: input.email?.trim().toLowerCase() || null,
    mobile_number: input.mobileNumber || null,
    website_name: input.websiteName || null,
  };
}

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .order("client_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Client[];
}

export async function fetchClientById(clientId: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .select(DB.CLIENTS.SELECT)
    .eq("id", clientId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Client | null) ?? null;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .insert(toClientColumns(input))
    .select(DB.CLIENTS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  if (input.email?.trim()) {
    await linkProfileByEmail(input.email).catch(() => {});
  }

  return data as Client;
}

export async function updateClient(
  clientId: string,
  input: UpdateClientInput,
): Promise<Client> {
  const { data, error } = await supabase
    .from(DB.CLIENTS.TABLE)
    .update(toClientColumns(input))
    .eq("id", clientId)
    .select(DB.CLIENTS.SELECT)
    .single();

  if (error) {
    throw saveError(error);
  }

  if (input.email?.trim()) {
    await linkProfileByEmail(input.email).catch(() => {});
  }

  return data as Client;
}

export async function deleteClient(clientId: string): Promise<void> {
  // Unlink portal logins first; ignore failures since the FK is ON DELETE SET NULL.
  await resetProfilesForClient(clientId).catch(() => {});

  const { error } = await supabase.from(DB.CLIENTS.TABLE).delete().eq("id", clientId);

  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "This client is linked to portal logins or projects. Remove those first, then try again.",
      );
    }
    throw new Error(error.message ?? "Failed to delete client.");
  }
}
