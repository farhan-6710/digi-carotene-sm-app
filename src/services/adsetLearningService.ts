import { DB } from "@/services/db";
import { supabase } from "@/services/supabaseClient";
import type {
  AdAccountKind,
  BenchmarkMethod,
  BenchmarkMode,
  BenchmarkStatus,
  BenchmarkValues,
  CampaignBenchmark,
  CampaignKpiConfig,
  CampaignKpiKey,
  DateWindow,
  KpiDirection,
  SaveAdsetBenchmarkInput,
} from "@/features/growth-and-analytics/types/types";

type KpiConfigRow = {
  id: string;
  ad_account_id: string;
  campaign_id: string;
  adset_id: string;
  primary_kpi: string;
  primary_direction: KpiDirection;
  secondary_kpis: string[] | null;
  min_results: number;
  qualified_call_seconds: number;
  last_goal_change_at: string | null;
};

type BenchmarkRow = {
  id: string;
  ad_account_id: string;
  campaign_id: string;
  adset_id: string;
  platform: AdAccountKind;
  mode: BenchmarkMode;
  method: BenchmarkMethod | null;
  window_days: number | null;
  lookback_days: number | null;
  min_results: number | null;
  values: BenchmarkValues;
  locked_kpis: string[] | null;
  edited_kpis: string[] | null;
  best_windows: string[] | null;
  eligible_windows: number;
  excluded: Record<string, number> | null;
  attribution_setting: string | null;
  currency: string;
  reason: string | null;
  agreed_with: string | null;
  agreed_on: string | null;
  status: BenchmarkStatus;
  auto_advance: boolean;
  suggest_updates: boolean;
  needs_review: boolean;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  superseded_at: string | null;
  new_best_dismissed_until: string | null;
  created_at: string;
};

function parseWindow(raw: string): DateWindow | null {
  const match = raw.match(/[[(]([^,]*),([^)\]]*)[)\]]/);
  if (!match) return null;
  const start = match[1]?.trim();
  const endExclusive = match[2]?.trim();
  if (!start || !endExclusive) return null;
  const endDate = new Date(`${endExclusive}T00:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() - 1);
  return { start, end: endDate.toISOString().slice(0, 10) };
}

function toPgDaterange(window: DateWindow): string {
  const endExclusive = new Date(`${window.end}T00:00:00Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  return `[${window.start},${endExclusive.toISOString().slice(0, 10)})`;
}

/** Map to CampaignKpiConfig — campaignId holds adset_id for shared Learning UI. */
function mapKpiConfig(row: KpiConfigRow): CampaignKpiConfig {
  return {
    id: row.id,
    adAccountId: row.ad_account_id,
    campaignId: row.adset_id,
    primaryKpi: row.primary_kpi as CampaignKpiKey,
    primaryDirection: row.primary_direction,
    secondaryKpis: (row.secondary_kpis ?? []) as CampaignKpiKey[],
    minResults: row.min_results,
    qualifiedCallSeconds: row.qualified_call_seconds,
    lastGoalChangeAt: row.last_goal_change_at,
  };
}

/** Map to CampaignBenchmark — campaignId holds adset_id for shared Learning UI. */
function mapBenchmark(row: BenchmarkRow): CampaignBenchmark {
  const windows = (row.best_windows ?? [])
    .map(parseWindow)
    .filter((w): w is DateWindow => Boolean(w));

  return {
    id: row.id,
    adAccountId: row.ad_account_id,
    campaignId: row.adset_id,
    platform: row.platform,
    mode: row.mode,
    method: row.method,
    windowDays: row.window_days,
    lookbackDays: row.lookback_days,
    minResults: row.min_results,
    values: row.values ?? {},
    lockedKpis: (row.locked_kpis ?? []) as CampaignKpiKey[],
    editedKpis: (row.edited_kpis ?? []) as CampaignKpiKey[],
    bestWindows: windows,
    eligibleWindows: row.eligible_windows,
    excluded: row.excluded ?? {},
    attributionSetting: row.attribution_setting,
    currency: row.currency,
    reason: row.reason,
    agreedWith: row.agreed_with,
    agreedOn: row.agreed_on,
    status: row.status,
    autoAdvance: row.auto_advance,
    suggestUpdates: row.suggest_updates,
    needsReview: row.needs_review,
    createdBy: row.created_by,
    approvedBy: row.approved_by,
    approvedAt: row.approved_at,
    supersededAt: row.superseded_at,
    newBestDismissedUntil: row.new_best_dismissed_until,
    createdAt: row.created_at,
  };
}

export async function fetchAdsetKpiConfig(
  adAccountId: string,
  adsetId: string,
): Promise<CampaignKpiConfig | null> {
  const { data, error } = await supabase
    .from(DB.ADSET_KPI_CONFIG.TABLE)
    .select(DB.ADSET_KPI_CONFIG.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapKpiConfig(data as KpiConfigRow) : null;
}

export async function upsertAdsetKpiConfig(input: {
  adAccountId: string;
  campaignId: string;
  adsetId: string;
  primaryKpi: CampaignKpiKey;
  primaryDirection: KpiDirection;
  secondaryKpis: CampaignKpiKey[];
  minResults?: number;
  qualifiedCallSeconds?: number;
  lastGoalChangeAt?: string | null;
}): Promise<CampaignKpiConfig> {
  const { data, error } = await supabase
    .from(DB.ADSET_KPI_CONFIG.TABLE)
    .upsert(
      {
        ad_account_id: input.adAccountId,
        campaign_id: input.campaignId,
        adset_id: input.adsetId,
        primary_kpi: input.primaryKpi,
        primary_direction: input.primaryDirection,
        secondary_kpis: input.secondaryKpis,
        min_results: input.minResults ?? 10,
        qualified_call_seconds: input.qualifiedCallSeconds ?? 60,
        last_goal_change_at: input.lastGoalChangeAt ?? null,
      },
      { onConflict: "ad_account_id,adset_id" },
    )
    .select(DB.ADSET_KPI_CONFIG.SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapKpiConfig(data as KpiConfigRow);
}

export async function fetchActiveAdsetBenchmark(
  adAccountId: string,
  adsetId: string,
): Promise<CampaignBenchmark | null> {
  const { data, error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapBenchmark(data as BenchmarkRow) : null;
}

export async function fetchPendingAdsetBenchmark(
  adAccountId: string,
  adsetId: string,
): Promise<CampaignBenchmark | null> {
  const { data, error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapBenchmark(data as BenchmarkRow) : null;
}

export async function fetchAdsetBenchmarkHistory(
  adAccountId: string,
  adsetId: string,
): Promise<CampaignBenchmark[]> {
  const { data, error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .eq("ad_account_id", adAccountId)
    .eq("adset_id", adsetId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as BenchmarkRow[]).map(mapBenchmark);
}

export async function saveAdsetBenchmark(
  input: SaveAdsetBenchmarkInput,
): Promise<CampaignBenchmark> {
  const status: BenchmarkStatus = input.requireApproval ? "pending" : "active";

  if (status === "active") {
    const { error: supersedeError } = await supabase
      .from(DB.ADSET_BENCHMARKS.TABLE)
      .update({
        status: "superseded",
        superseded_at: new Date().toISOString(),
      })
      .eq("ad_account_id", input.adAccountId)
      .eq("adset_id", input.adsetId)
      .eq("status", "active");

    if (supersedeError) throw new Error(supersedeError.message);
  }

  const { data, error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .insert({
      ad_account_id: input.adAccountId,
      campaign_id: input.campaignId,
      adset_id: input.adsetId,
      platform: input.platform,
      mode: input.mode,
      method: input.method ?? null,
      window_days: input.windowDays ?? null,
      lookback_days: input.lookbackDays ?? null,
      min_results: input.minResults ?? null,
      values: input.values,
      locked_kpis: input.lockedKpis ?? [],
      edited_kpis: input.editedKpis ?? [],
      best_windows: (input.bestWindows ?? []).map(toPgDaterange),
      eligible_windows: input.eligibleWindows ?? 0,
      excluded: input.excluded ?? {},
      currency: input.currency,
      reason: input.reason ?? null,
      agreed_with: input.agreedWith ?? null,
      agreed_on: input.agreedOn ?? null,
      status,
      auto_advance: input.autoAdvance ?? false,
      suggest_updates: input.suggestUpdates ?? true,
      created_by: input.createdBy ?? null,
      approved_by: status === "active" ? (input.createdBy ?? null) : null,
      approved_at: status === "active" ? new Date().toISOString() : null,
    })
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapBenchmark(data as BenchmarkRow);
}

export async function approveAdsetBenchmark(
  benchmarkId: string,
  approvedBy: string | null,
): Promise<CampaignBenchmark> {
  const { data: pending, error: fetchError } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .eq("id", benchmarkId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  const row = pending as BenchmarkRow;

  const { error: supersedeError } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .update({
      status: "superseded",
      superseded_at: new Date().toISOString(),
    })
    .eq("ad_account_id", row.ad_account_id)
    .eq("adset_id", row.adset_id)
    .eq("status", "active");

  if (supersedeError) throw new Error(supersedeError.message);

  const { data, error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .update({
      status: "active",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", benchmarkId)
    .select(DB.ADSET_BENCHMARKS.SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapBenchmark(data as BenchmarkRow);
}

export async function rejectAdsetBenchmark(benchmarkId: string): Promise<void> {
  const { error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .update({ status: "rejected" })
    .eq("id", benchmarkId);

  if (error) throw new Error(error.message);
}

export async function dismissAdsetNewBestFlag(
  benchmarkId: string,
  untilDate: string,
): Promise<void> {
  const { error } = await supabase
    .from(DB.ADSET_BENCHMARKS.TABLE)
    .update({ new_best_dismissed_until: untilDate })
    .eq("id", benchmarkId);

  if (error) throw new Error(error.message);
}
