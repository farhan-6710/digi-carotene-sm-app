import { format, subDays } from "date-fns";

import type { AdAccount, CampaignMetricRow } from "../types/types";

export const DUMMY_AD_ACCOUNTS: AdAccount[] = [
  {
    id: "ad-acc-carotene",
    clientId: null,
    clientName: "Carotene",
    accountName: "Carotene Ads",
    adAccountId: "act_100200300",
    currencyCode: "INR",
  },
  {
    id: "ad-acc-veda",
    clientId: null,
    clientName: "Veda Hospitals",
    accountName: "Veda Performance",
    adAccountId: "act_400500600",
    currencyCode: "INR",
  },
];

const CAMPAIGNS = [
  {
    id: "camp-spring-awareness",
    name: "Spring Awareness",
    status: "Active" as const,
    objective: "OUTCOME_AWARENESS",
  },
  {
    id: "camp-retargeting",
    name: "Retargeting — Site Visitors",
    status: "Active" as const,
    objective: "LINK_CLICKS",
  },
  {
    id: "camp-lead-gen",
    name: "Lead Gen — Consultation",
    status: "Paused" as const,
    objective: "OUTCOME_LEADS",
  },
  {
    id: "camp-brand-reach",
    name: "Brand Reach Q2",
    status: "Completed" as const,
    objective: "OUTCOME_ENGAGEMENT",
  },
];

const DUMMY_HISTORY_DAYS = 90;

function seedValue(seed: number, min: number, max: number): number {
  const wave = Math.sin(seed / 9) * 0.4 + Math.cos(seed / 4) * 0.15;
  const normalized = (wave + 1) / 2;
  return Math.round(min + normalized * (max - min));
}

function buildMetricsForAccount(adAccountId: string): CampaignMetricRow[] {
  const rows: CampaignMetricRow[] = [];
  const seedOffset = adAccountId.length * 13;

  for (let day = 1; day <= DUMMY_HISTORY_DAYS; day += 1) {
    const date = format(subDays(new Date(), day), "yyyy-MM-dd");

    for (let i = 0; i < CAMPAIGNS.length; i += 1) {
      const campaign = CAMPAIGNS[i]!;
      const seed = day + seedOffset + i * 31;
      rows.push({
        campaignId: campaign.id,
        campaignName: campaign.name,
        status: campaign.status,
        objective: campaign.objective,
        spend: seedValue(seed, 800, 6_500),
        impressions: seedValue(seed + 2, 4_000, 28_000),
        reach: seedValue(seed + 1, 3_000, 22_000),
        clicks: seedValue(seed + 4, 120, 980),
        cpm: seedValue(seed + 3, 40, 180),
        frequency: Number((1 + (seed % 20) / 10).toFixed(2)),
        conversions: seedValue(seed + 6, 2, 42),
        date,
      });
    }
  }

  return rows;
}

const METRICS_BY_ACCOUNT: Record<string, CampaignMetricRow[]> = Object.fromEntries(
  DUMMY_AD_ACCOUNTS.map((account) => [
    account.id,
    buildMetricsForAccount(account.id),
  ]),
);

export function getDummyCampaignMetrics(adAccountId: string): CampaignMetricRow[] {
  return METRICS_BY_ACCOUNT[adAccountId] ?? [];
}
