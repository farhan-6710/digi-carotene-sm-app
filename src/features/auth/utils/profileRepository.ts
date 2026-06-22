import { supabase } from "@/shared/lib/supabase";
import type { Profile } from "@/features/auth/types/profile";

export async function fetchProfileByUserId(
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, client_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Profile | null) ?? null;
}

export async function promoteProfileToStaff(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "staff", client_id: null })
    .eq("id", userId)
    .select("id, role, client_id")
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}

export async function unlinkProfilesFromClient(
  clientId: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ client_id: null })
    .eq("client_id", clientId);

  if (error) {
    throw error;
  }
}
