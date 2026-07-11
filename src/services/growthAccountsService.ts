import { rerunAdBackfillForAccount, runAdBackfill } from "@/services/adBackfillService";
import { DB } from "@/services/db";
import { rerunInstagramBackfillForOrganicAccount, runInstagram29DayBackfill } from "@/services/instagramBackfillService";
import {
  createInstagramProfile,
  fetchInstagramProfileByOrganicAccountId,
} from "@/services/instagramProfilesService";
import {
  clearAdCachedMetrics,
  clearOrganicCachedMetrics,
} from "@/services/growthMetaSyncService";
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
  currency_code: string;
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
    currencyCode: row.currency_code || "INR",
  };
}

function normalizeAdAccountId(adAccountId: string): string {
  const trimmed = adAccountId.trim();
  return trimmed.startsWith("act_") ? trimmed : `act_${trimmed}`;
}

function isDuplicateAccountError(message: string): boolean {
  return message.includes("growth_organic_accounts_platform_account_id_key")
    || message.includes("growth_ad_accounts_ad_account_id_key")
    || message.includes("duplicate key");
}

async function findOrganicByMetaId(
  platform: OrganicAccount["platform"],
  metaAccountId: string,
): Promise<OrganicAccount | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .select(DB.GROWTH_ORGANIC_ACCOUNTS.SELECT)
    .eq("platform", platform)
    .eq("account_id", metaAccountId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapOrganic(data as OrganicRow) : null;
}

async function findAdByMetaId(metaAdAccountId: string): Promise<AdAccount | null> {
  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .select(DB.GROWTH_AD_ACCOUNTS.SELECT)
    .eq("ad_account_id", metaAdAccountId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapAd(data as AdRow) : null;
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

export async function fetchAdAccountAccessToken(accountId: string): Promise<string> {
  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .select("access_token")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const token = (data as { access_token?: string } | null)?.access_token?.trim();
  if (!token) {
    throw new Error(
      "No Meta access token stored for this ad account. Open Manage Accounts and refresh the token.",
    );
  }

  return token;
}

export async function connectOrganicAccount(
  form: OrganicAccountForm,
): Promise<OrganicAccount> {
  const token = form.accessToken.trim();
  if (!token) {
    throw new Error("Paste the page access token so we can fetch data from Meta.");
  }

  const metaAccountId = form.accountId.trim();
  const existing = await findOrganicByMetaId(form.platform, metaAccountId);
  if (existing) {
    throw new Error(
      `"${existing.accountName}" is already connected. Edit it from the list to refresh the token.`,
    );
  }

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

  if (error) {
    if (isDuplicateAccountError(error.message)) {
      throw new Error("This account is already connected.");
    }
    throw new Error(error.message);
  }

  const account = mapOrganic(data as OrganicRow);

  if (form.platform === "instagram") {
    const profile = await createInstagramProfile({
      instagramId: metaAccountId,
      username: account.accountName,
      accessToken: token,
      followersCount: account.followers,
      organicAccountId: account.id,
    });
    await runInstagram29DayBackfill(profile.id, metaAccountId, token);
  }

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

  if (token) {
    const info = await fetchMetaOrganicInfo(form.platform, metaAccountId, token);
    columns.access_token = token;
    columns.followers = info.followers;
    columns.profile_picture = info.profilePicture;
  }

  const { data, error } = await supabase
    .from(DB.GROWTH_ORGANIC_ACCOUNTS.TABLE)
    .update(columns)
    .eq("id", id)
    .select(DB.GROWTH_ORGANIC_ACCOUNTS.SELECT)
    .single();

  if (error) throw new Error(error.message);

  const account = mapOrganic(data as OrganicRow);

  if (form.platform === "instagram" && token) {
    const existingProfile = await fetchInstagramProfileByOrganicAccountId(id);
    if (existingProfile) {
      await clearOrganicCachedMetrics(id);
      await rerunInstagramBackfillForOrganicAccount(id, token);
    }
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

  const metaAdAccountId = normalizeAdAccountId(form.adAccountId);
  const existing = await findAdByMetaId(metaAdAccountId);
  if (existing) {
    throw new Error(
      `"${existing.accountName}" is already connected. Edit it from the list to refresh the token.`,
    );
  }

  const info = await fetchMetaAdInfo(metaAdAccountId, token);
  const currencyCode = form.currencyCode.trim() || info.currency || "INR";

  const { data, error } = await supabase
    .from(DB.GROWTH_AD_ACCOUNTS.TABLE)
    .insert({
      client_name: form.clientName.trim(),
      account_name: form.accountName.trim() || info.accountName,
      ad_account_id: metaAdAccountId,
      access_token: token,
      currency_code: currencyCode,
    })
    .select(DB.GROWTH_AD_ACCOUNTS.SELECT)
    .single();

  if (error) {
    if (isDuplicateAccountError(error.message)) {
      throw new Error("This ad account is already connected.");
    }
    throw new Error(error.message);
  }

  const account = mapAd(data as AdRow);
  await runAdBackfill(account.id, metaAdAccountId, token);

  return account;
}

export async function updateAdAccount(
  id: string,
  form: AdAccountForm,
): Promise<AdAccount> {
  const token = form.accessToken.trim();
  const metaAdAccountId = normalizeAdAccountId(form.adAccountId);
  const currencyCode = form.currencyCode.trim() || "INR";
  const columns: Record<string, unknown> = {
    client_name: form.clientName.trim(),
    account_name: form.accountName.trim(),
    ad_account_id: metaAdAccountId,
    currency_code: currencyCode,
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
    await clearAdCachedMetrics(id);
    await rerunAdBackfillForAccount(id, metaAdAccountId, token);
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
