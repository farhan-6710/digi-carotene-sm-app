import { fetchAdCampaignMetricsForAccount } from "@/services/adCampaignMetricsService";
import {
  fetchAdAccounts,
  fetchOrganicAccounts,
} from "@/services/growthAccountsService";
import { fetchDailyFollowersForProfile } from "@/services/instagramDailyFollowersService";
import { fetchPastPostsForProfile } from "@/services/pastPostsMetricsService";
import { fetchInstagramProfileByOrganicAccountId } from "@/services/instagramProfilesService";
import {
  formatCompact,
  formatCpm,
  formatCurrency,
  formatFrequency,
  formatPercent,
} from "./formatters";
import {
  CUSTOM_REPORT_TOP_POSTS,
  type CustomReportKind,
} from "../constants/customReport";
import {
  adAccountKindLabel,
  organicPlatformLabel,
} from "../constants/growthPlatformConfig";
import type {
  CustomReportAccountOption,
  CustomReportAccountSection,
  CustomReportDocumentData,
  CustomReportSectionStat,
} from "../types/customReport";
import type {
  AdAccount,
  CampaignMetricRow,
  OrganicAccount,
  PastPostMetric,
} from "../types/types";
import { buildCampaignStatCards } from "./campaignMetrics";
import { formatCustomReportPeriodLabel } from "./customReportPeriod";
import {
  mapPastPostToPostRow,
  sumPostInteractionTotals,
} from "./instagramPostMetrics";

function pushStat(
  stats: CustomReportSectionStat[],
  label: string,
  value: string,
) {
  stats.push({ label, value });
}

function pushIfPositive(
  stats: CustomReportSectionStat[],
  label: string,
  value: number,
  format: (n: number) => string = formatCompact,
) {
  if (value > 0) pushStat(stats, label, format(value));
}

function topPostsFromMetrics(posts: PastPostMetric[]) {
  return [...posts]
    .sort((a, b) => b.reach + b.likes - (a.reach + a.likes))
    .slice(0, CUSTOM_REPORT_TOP_POSTS)
    .map((post) => {
      const row = mapPastPostToPostRow(post);
      return {
        caption: (row.caption ?? "").slice(0, 90) || "(No caption)",
        detail: [
          `Reach ${formatCompact(row.reach)}`,
          `Views ${formatCompact(row.views)}`,
          `Likes ${formatCompact(row.likes)}`,
          `Comments ${formatCompact(row.comments)}`,
          `Saves ${formatCompact(row.saves)}`,
          `Shares ${formatCompact(row.shares)}`,
          `Reposts ${formatCompact(row.reposts)}`,
        ].join(" · "),
      };
    });
}

function sumCampaignRows(rows: CampaignMetricRow[]) {
  return rows.reduce(
    (acc, row) => {
      acc.spend += row.spend;
      acc.impressions += row.impressions;
      acc.reach += row.reach;
      acc.clicks += row.clicks;
      acc.conversions += row.conversions;
      acc.conversionValue += row.conversionValue;
      acc.videoViews += row.videoViews;
      acc.localShopVisits += row.localShopVisits;
      acc.localWebsiteVisits += row.localWebsiteVisits;
      acc.localDirectionViews += row.localDirectionViews;
      acc.localCalls += row.localCalls;
      acc.localOrders += row.localOrders;
      acc.localMenuViews += row.localMenuViews;
      acc.localOtherActions += row.localOtherActions;
      return acc;
    },
    {
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      conversions: 0,
      conversionValue: 0,
      videoViews: 0,
      localShopVisits: 0,
      localWebsiteVisits: 0,
      localDirectionViews: 0,
      localCalls: 0,
      localOrders: 0,
      localMenuViews: 0,
      localOtherActions: 0,
    },
  );
}

async function buildOrganicSection(
  account: OrganicAccount,
  from: string,
  to: string,
): Promise<CustomReportAccountSection> {
  const stats: CustomReportSectionStat[] = [];
  let topPosts: CustomReportAccountSection["topPosts"] = [];
  let note: string | undefined;

  if (account.platform === "facebook") {
    pushStat(stats, "Page followers", formatCompact(account.followers));
    note =
      "Facebook post history is live Graph only — use Content Performance for live Facebook posts.";
    return {
      accountId: account.id,
      accountName: account.accountName,
      platformLabel: organicPlatformLabel(account.platform),
      kind: "organic",
      stats,
      topPosts,
      note,
    };
  }

  const profile = await fetchInstagramProfileByOrganicAccountId(account.id);
  if (!profile) {
    return {
      accountId: account.id,
      accountName: account.accountName,
      platformLabel: organicPlatformLabel(account.platform),
      kind: "organic",
      stats: [{ label: "Followers", value: formatCompact(account.followers) }],
      topPosts: [],
      note: "Instagram profile not linked yet.",
    };
  }

  // Same APIs + date filter as Content Performance / Dashboard.
  const [days, posts] = await Promise.all([
    fetchDailyFollowersForProfile(profile.id, { from, to }),
    fetchPastPostsForProfile(profile.id, { from, to }),
  ]);

  const gained = days.reduce((sum, row) => sum + row.gained, 0);
  pushStat(stats, "Followers gained", formatCompact(gained));
  pushStat(
    stats,
    "Current followers",
    formatCompact(profile.followersCount || account.followers),
  );

  const reach = posts.reduce((sum, post) => sum + post.reach, 0);
  const interactions = sumPostInteractionTotals(posts);

  pushStat(stats, "Posts in range", formatCompact(posts.length));
  pushStat(stats, "Reach", formatCompact(reach));
  pushStat(stats, "Views", formatCompact(interactions.views));
  pushStat(stats, "Likes", formatCompact(interactions.likes));
  pushStat(stats, "Comments", formatCompact(interactions.comments));
  pushStat(stats, "Saves", formatCompact(interactions.saves));
  pushStat(stats, "Shares", formatCompact(interactions.shares));
  pushStat(stats, "Reposts", formatCompact(interactions.reposts));

  topPosts = topPostsFromMetrics(posts);
  if (posts.length === 0) {
    note =
      "No posts published in this date range (same filter as Content Performance). Try This month or Last 3 months.";
  }

  return {
    accountId: account.id,
    accountName: account.accountName,
    platformLabel: organicPlatformLabel(account.platform),
    kind: "organic",
    stats,
    topPosts,
    note,
  };
}

async function buildAdSection(
  account: AdAccount,
  from: string,
  to: string,
): Promise<CustomReportAccountSection> {
  // Same API + date filter as Campaign Analytics.
  const rows = await fetchAdCampaignMetricsForAccount(account.id, {
    from,
    to,
  });
  const currency = account.currencyCode || "INR";
  const stats: CustomReportSectionStat[] = [];

  if (rows.length === 0) {
    return {
      accountId: account.id,
      accountName: account.accountName,
      platformLabel: `${adAccountKindLabel(account.platform)} · ${account.clientName}`,
      kind: "ad",
      stats,
      topPosts: [],
      note: "No campaign daily metrics in this date range (same filter as Campaign Analytics).",
    };
  }

  // Core KPIs match Campaign Analytics stat cards.
  for (const card of buildCampaignStatCards(
    rows,
    currency,
    account.platform,
  )) {
    pushStat(stats, card.label, card.value);
  }

  const totals = sumCampaignRows(rows);
  const ctr =
    totals.impressions > 0
      ? (totals.clicks / totals.impressions) * 100
      : 0;
  const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
  const cpm =
    totals.impressions > 0
      ? (totals.spend / totals.impressions) * 1000
      : 0;
  const frequency =
    totals.reach > 0 ? totals.impressions / totals.reach : 0;

  pushStat(stats, "Reach", formatCompact(totals.reach));
  pushStat(stats, "CTR", formatPercent(ctr));
  if (account.platform !== "google_ads") {
    pushStat(stats, "CPC", formatCpm(cpc, currency));
  }
  pushStat(stats, "CPM", formatCpm(cpm, currency));
  pushStat(stats, "Frequency", formatFrequency(frequency));
  pushIfPositive(
    stats,
    "Conversion value",
    totals.conversionValue,
    (n) => formatCurrency(n, currency),
  );
  pushIfPositive(stats, "Video views", totals.videoViews);
  pushIfPositive(stats, "Shop visits", totals.localShopVisits);
  pushIfPositive(stats, "Website visits", totals.localWebsiteVisits);
  pushIfPositive(stats, "Direction views", totals.localDirectionViews);
  pushIfPositive(stats, "Calls", totals.localCalls);
  pushIfPositive(stats, "Orders", totals.localOrders);
  pushIfPositive(stats, "Menu views", totals.localMenuViews);
  pushIfPositive(stats, "Other local actions", totals.localOtherActions);

  return {
    accountId: account.id,
    accountName: account.accountName,
    platformLabel: `${adAccountKindLabel(account.platform)} · ${account.clientName}`,
    kind: "ad",
    stats,
    topPosts: [],
  };
}

export async function listCustomReportAccounts(
  kind: CustomReportKind,
): Promise<CustomReportAccountOption[]> {
  if (kind === "organic") {
    const accounts = await fetchOrganicAccounts();
    return accounts.map((account) => ({
      id: account.id,
      label: account.accountName,
      caption: organicPlatformLabel(account.platform),
      platform: account.platform,
    }));
  }

  const accounts = await fetchAdAccounts();
  return accounts.map((account) => ({
    id: account.id,
    label: account.accountName,
    caption: `${adAccountKindLabel(account.platform)} · ${account.clientName}`,
    platform: account.platform,
  }));
}

export async function buildCustomReportDocument(input: {
  kind: CustomReportKind;
  accountIds: string[];
  from: string;
  to: string;
}): Promise<CustomReportDocumentData> {
  const sections: CustomReportAccountSection[] = [];

  if (input.kind === "organic") {
    const accounts = await fetchOrganicAccounts();
    const selected = accounts.filter((account) =>
      input.accountIds.includes(account.id),
    );
    for (const account of selected) {
      sections.push(await buildOrganicSection(account, input.from, input.to));
    }
  } else {
    const accounts = await fetchAdAccounts();
    const selected = accounts.filter((account) =>
      input.accountIds.includes(account.id),
    );
    for (const account of selected) {
      sections.push(await buildAdSection(account, input.from, input.to));
    }
  }

  return {
    title: "Digi Carotene Growth Report",
    generatedAtLabel: new Date().toLocaleString(),
    periodLabel: formatCustomReportPeriodLabel(input.from, input.to),
    sections,
  };
}
