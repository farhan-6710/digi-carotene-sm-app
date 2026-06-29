import { DB } from "@/services/db";
import { syncAdFromMeta, syncOrganicFromMeta } from "@/services/growthMetaSyncService";
import { fetchMetaAdInfo, fetchMetaOrganicInfo } from "@/services/metaService";
import { supabase } from "@/services/supabaseClient";
import type {
  AdAccount,
  AdAccountForm,
  OrganicAccount,
  OrganicAccountForm,
} from "@/features/growth-and-analytics/types/types";

type OrganicRow = {
  id: string;
  platform: OrganicAccount["platform"];
  account_name: string;
  account_id: string;
  followers: number;
  is_active: boolean;
};

type AdRow = {
  id: string;
  client_name: string;
  account_name: string;
  ad_account_id: string;
  currency: string;
};

function mapOrganic(row: OrganicRow): OrganicAccount {
  return {
    id: row.id,
    platform: row.platform,
    accountName: row.account_name,
    accountId: row.account_id,
    followers: row.followers,
    isActive: row.is_active,
  };
}

function mapAd(row: AdRow): AdAccount {
  return {
    id: row.id,
    clientName: row.client_name,
    accountName: row.account_name,
    adAccountId: row.ad_account_id,
    currency: row.currency,
  };
}

export async function fetchOrganicAccounts(): Promise<OrganicAccount[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .select(DB.GROWTH_ORGANIC_ACCOUNTS.SELECT)
    .order("followers", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as OrganicRow[]).map(mapOrganic);
}

export async function fetchAdAccounts(): Promise<AdAccount[]> {
  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .select(DB.GROWTH_AD_ACCOUNTS.SELECT)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return ((data ?? []) as AdRow[]).map(mapAd);
}

export async function connectOrganicAccount(
  form: OrganicAccountForm,
): Promise<OrganicAccount> {
  const token = form.accessToken.trim();
  if (!token) {
    throw new Error("Paste the page access token so we can fetch data from Meta.");
  }

  const metaAccountId = form.accountId.trim();
  const info = await fetchMetaOrganicInfo(form.platform, metaAccountId, token);

  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .insert({
      platform: form.platform,
      account_name: form.accountName.trim() || info.accountName,
      account_id: metaAccountId,
      access_token: token,
      followers: info.followers,
      profile_picture: info.profilePicture,
      is_active: true,
    })
    .select(DB.GROWTH_ORGANIC_ACCOUNTS.SELECT)
    .single();

  if (error) throw new Error(error.message);

  const account = mapOrganic(data as OrganicRow);
  await syncOrganicFromMeta(
    form.platform,
    metaAccountId,
    token,
    account.id,
    info.followers,
  );

  return account;
}

export async function updateOrganicAccount(
  id: string,
  form: OrganicAccountForm,
): Promise<OrganicAccount> {
  const token = form.accessToken.trim();
  const metaAccountId = form.accountId.trim();
  const columns: Record<string, unknown> = {
    platform: form.platform,
    account_name: form.accountName.trim(),
    account_id: metaAccountId,
  };

  let followers = 0;
  if (token) {
    const info = await fetchMetaOrganicInfo(form.platform, metaAccountId, token);
    columns.access_token = token;
    columns.followers = info.followers;
    columns.profile_picture = info.profilePicture;
    followers = info.followers;
  }

  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .update(columns)
    .eq("id", id)
    .select(DB.GROWTH_ORGANIC_ACCOUNTS.SELECT)
    .single();

  if (error) throw new Error(error.message);

  const account = mapOrganic(data as OrganicRow);
  if (token) {
    await syncOrganicFromMeta(
      form.platform,
      metaAccountId,
      token,
      id,
      followers || account.followers,
    );
  }

  return account;
}

export async function deleteOrganicAccount(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function connectAdAccount(form: AdAccountForm): Promise<AdAccount> {
  const token = form.accessToken.trim();
  if (!token) {
    throw new Error("Paste the access token so we can fetch the ad account from Meta.");
  }

  const metaAdAccountId = form.adAccountId.trim();
  const info = await fetchMetaAdInfo(metaAdAccountId, token);

  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .insert({
      client_name: form.clientName.trim(),
      account_name: form.accountName.trim() || info.accountName,
      ad_account_id: metaAdAccountId,
      access_token: token,
      currency: info.currency || form.currency,
    })
    .select(DB.GROWTH_AD_ACCOUNTS.SELECT)
    .single();

  if (error) throw new Error(error.message);

  const account = mapAd(data as AdRow);
  await syncAdFromMeta(metaAdAccountId, token, account.id);
  return account;
}

export async function updateAdAccount(
  id: string,
  form: AdAccountForm,
): Promise<AdAccount> {
  const token = form.accessToken.trim();
  const metaAdAccountId = form.adAccountId.trim();
  const columns: Record<string, unknown> = {
    client_name: form.clientName.trim(),
    account_name: form.accountName.trim(),
    ad_account_id: metaAdAccountId,
    currency: form.currency,
  };

  if (token) {
    columns.access_token = token;
  }

  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .update(columns)
    .eq("id", id)
    .select(DB.GROWTH_AD_ACCOUNTS.SELECT)
    .single();

  if (error) throw new Error(error.message);

  const account = mapAd(data as AdRow);
  if (token) {
    await syncAdFromMeta(metaAdAccountId, token, id);
  }

  return account;
}

export async function deleteAdAccount(id: string): Promise<void> {
  const { error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
