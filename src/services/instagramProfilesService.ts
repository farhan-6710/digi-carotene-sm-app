import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type { InstagramProfile } from "@/features/growth-and-analytics/types/types";

type ProfileRow = {
  id: string;
  instagram_id: string;
  username: string;
  followers_count: number;
  organic_account_id: string | null;
};

function mapProfile(row: ProfileRow): InstagramProfile {
  return {
    id: row.id,
    instagramId: row.instagram_id,
    username: row.username,
    followersCount: row.followers_count,
    organicAccountId: row.organic_account_id,
  };
}

export async function fetchInstagramProfiles(): Promise<InstagramProfile[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .select(DB.GROWTH_ORGANIC_PROFILES.SELECT)
    .order("username", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as ProfileRow[]).map(mapProfile);
}

type CreateInstagramProfileInput = {
  instagramId: string;
  username: string;
  accessToken: string;
  followersCount: number;
  organicAccountId: string;
};

export async function createInstagramProfile(
  input: CreateInstagramProfileInput,
): Promise<InstagramProfile> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .insert({
      instagram_id: input.instagramId,
      username: input.username,
      access_token: input.accessToken,
      followers_count: input.followersCount,
      organic_account_id: input.organicAccountId,
    })
    .select(DB.GROWTH_ORGANIC_PROFILES.SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapProfile(data as ProfileRow);
}

export async function updateInstagramProfileToken(
  profileId: string,
  accessToken: string,
  followersCount: number,
  username: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .update({
      access_token: accessToken,
      followers_count: followersCount,
      username,
    })
    .eq("id", profileId);

  if (error) throw new Error(error.message);
}

export async function fetchInstagramProfileById(
  profileId: string,
): Promise<InstagramProfile | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .select(DB.GROWTH_ORGANIC_PROFILES.SELECT)
    .eq("id", profileId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function fetchInstagramProfileByOrganicAccountId(
  organicAccountId: string,
): Promise<InstagramProfile | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .select(DB.GROWTH_ORGANIC_PROFILES.SELECT)
    .eq("organic_account_id", organicAccountId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function fetchInstagramProfileAccessToken(
  profileId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_PROFILES.TABLE)
    .select("access_token")
    .eq("id", profileId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as { access_token?: string } | null)?.access_token ?? null;
}
