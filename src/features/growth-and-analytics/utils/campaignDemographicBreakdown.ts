import {
  CAMPAIGN_DEMOGRAPHIC_AGE_ORDER,
  CAMPAIGN_DEMOGRAPHIC_AGE_SUMMARY_GENDER,
  CAMPAIGN_DEMOGRAPHIC_GENDER_ORDER,
  campaignDemographicGenderLabels,
  campaignPlacementLabels,
} from "../constants/campaignDemographicBreakdown";
import type {
  CampaignDemographicMetric,
  CampaignDemographicRow,
  CampaignDemographicTableView,
  DemographicBreakdown,
} from "../types/types";
import type { AdDemographicInsight } from "@/services/metaService";
import {
  hasAdDeliveryMetrics,
  parseInsightConversions,
  parseMetricDecimal,
  parseMetricInt,
  parseSpend,
} from "./metaSyncMappers";

type DemographicCell = {
  age: string | null;
  gender: string | null;
  placement: string | null;
  metrics: CampaignDemographicMetric;
};

const EMPTY_METRIC: CampaignDemographicMetric = {
  spend: 0,
  impressions: 0,
  reach: 0,
  clicks: 0,
  cpm: 0,
  frequency: 0,
  conversions: 0,
};

function formatGenderLabel(gender: string): string {
  return campaignDemographicGenderLabels[gender] ?? gender;
}

function formatPlacementLabel(placement: string): string {
  return (
    campaignPlacementLabels[placement] ??
    placement
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function parseCell(insight: AdDemographicInsight): DemographicCell | null {
  const conversions = parseInsightConversions(insight);
  if (!hasAdDeliveryMetrics(insight) && conversions === 0) return null;

  const reach = parseMetricInt(insight.reach);
  const impressions = parseMetricInt(insight.impressions);
  const frequencyFromApi = parseMetricDecimal(insight.frequency);

  return {
    age: insight.age?.trim() ?? null,
    gender: insight.gender?.trim().toLowerCase() ?? null,
    placement: insight.platform_position?.trim().toLowerCase() ?? null,
    metrics: {
      spend: parseSpend(insight.spend),
      impressions,
      reach,
      clicks: parseMetricInt(insight.clicks),
      cpm: parseMetricDecimal(insight.cpm),
      frequency:
        frequencyFromApi > 0
          ? frequencyFromApi
          : reach > 0
            ? Number((impressions / reach).toFixed(2))
            : 0,
      conversions,
    },
  };
}

function sumMetrics(cells: DemographicCell[]): CampaignDemographicMetric {
  const reach = cells.reduce((sum, cell) => sum + cell.metrics.reach, 0);
  const impressions = cells.reduce((sum, cell) => sum + cell.metrics.impressions, 0);
  const clicks = cells.reduce((sum, cell) => sum + cell.metrics.clicks, 0);
  const spend = cells.reduce((sum, cell) => sum + cell.metrics.spend, 0);

  return {
    spend,
    impressions,
    reach,
    clicks,
    cpm: impressions > 0 ? Number(((spend / impressions) * 1000).toFixed(2)) : 0,
    frequency: reach > 0 ? Number((impressions / reach).toFixed(2)) : 0,
    conversions: cells.reduce((sum, cell) => sum + cell.metrics.conversions, 0),
  };
}

function sortAges(ages: string[]): string[] {
  const order = CAMPAIGN_DEMOGRAPHIC_AGE_ORDER as readonly string[];
  const known = order.filter((age) => ages.includes(age));
  const unknown = ages.filter((age) => !order.includes(age)).sort();
  return [...known, ...unknown];
}

function sortGenders(genders: string[]): string[] {
  const order = CAMPAIGN_DEMOGRAPHIC_GENDER_ORDER as readonly string[];
  const known = order.filter((gender) => genders.includes(gender));
  const unknown = genders.filter((gender) => !order.includes(gender)).sort();
  return [...known, ...unknown];
}

function buildAgeRows(cells: DemographicCell[]): CampaignDemographicRow[] {
  const byAge = new Map<string, DemographicCell[]>();
  for (const cell of cells) {
    const age = cell.age ?? "unknown";
    byAge.set(age, [...(byAge.get(age) ?? []), cell]);
  }

  return sortAges([...byAge.keys()]).map((age) => ({
    id: `age-${age}`,
    age,
    gender: null,
    placement: null,
    metrics: sumMetrics(byAge.get(age) ?? []),
    isAgeSummary: false,
  }));
}

function buildGenderRows(cells: DemographicCell[]): CampaignDemographicRow[] {
  const byGender = new Map<string, DemographicCell[]>();
  for (const cell of cells) {
    const gender = cell.gender ?? "unknown";
    byGender.set(gender, [...(byGender.get(gender) ?? []), cell]);
  }

  return sortGenders([...byGender.keys()]).map((gender) => ({
    id: `gender-${gender}`,
    age: null,
    gender: formatGenderLabel(gender),
    placement: null,
    metrics: sumMetrics(byGender.get(gender) ?? []),
    isAgeSummary: false,
  }));
}

function buildPlacementRows(cells: DemographicCell[]): CampaignDemographicRow[] {
  const byPlacement = new Map<string, DemographicCell[]>();
  for (const cell of cells) {
    const placement = cell.placement ?? "unknown";
    byPlacement.set(placement, [...(byPlacement.get(placement) ?? []), cell]);
  }

  return [...byPlacement.entries()]
    .map(([placement, group]) => ({
      id: `placement-${placement}`,
      age: null,
      gender: null,
      placement: formatPlacementLabel(placement),
      metrics: sumMetrics(group),
      isAgeSummary: false,
    }))
    .sort((a, b) => b.metrics.impressions - a.metrics.impressions);
}

function buildAgeGenderRows(
  cells: DemographicCell[],
  ageSummaryCells: DemographicCell[],
): CampaignDemographicRow[] {
  const ageSummaryByAge = new Map<string, DemographicCell>();
  for (const cell of ageSummaryCells) {
    if (cell.age) ageSummaryByAge.set(cell.age, cell);
  }

  const genderByAge = new Map<string, Map<string, DemographicCell>>();
  const allAges = new Set<string>();
  for (const cell of cells) {
    if (!cell.age || !cell.gender) continue;
    allAges.add(cell.age);
    const bucket = genderByAge.get(cell.age) ?? new Map<string, DemographicCell>();
    bucket.set(cell.gender, cell);
    genderByAge.set(cell.age, bucket);
  }
  for (const age of ageSummaryByAge.keys()) allAges.add(age);

  const rows: CampaignDemographicRow[] = [];

  for (const age of sortAges([...allAges])) {
    const genderCells = genderByAge.get(age);
    const summaryCell =
      ageSummaryByAge.get(age) ??
      (genderCells
        ? {
            age,
            gender: null,
            placement: null,
            metrics: sumMetrics([...genderCells.values()]),
          }
        : null);

    if (summaryCell) {
      rows.push({
        id: `${age}-all`,
        age,
        gender: CAMPAIGN_DEMOGRAPHIC_AGE_SUMMARY_GENDER,
        placement: null,
        metrics: summaryCell.metrics,
        isAgeSummary: true,
      });
    }

    for (const gender of sortGenders([...(genderCells?.keys() ?? [])])) {
      const cell = genderCells?.get(gender);
      if (!cell) continue;
      rows.push({
        id: `${age}-${gender}`,
        age: null,
        gender: formatGenderLabel(gender),
        placement: null,
        metrics: cell.metrics,
        isAgeSummary: false,
      });
    }
  }

  return rows;
}

export function buildCampaignDemographicTableView(
  breakdowns: DemographicBreakdown[],
  primaryInsights: AdDemographicInsight[],
  ageSummaryInsights: AdDemographicInsight[] = [],
): CampaignDemographicTableView {
  const cells = primaryInsights
    .map(parseCell)
    .filter((cell): cell is DemographicCell => cell != null);

  const total = cells.length > 0 ? sumMetrics(cells) : EMPTY_METRIC;
  const hasAge = breakdowns.includes("age");
  const hasGender = breakdowns.includes("gender");
  const hasPlacement = breakdowns.includes("placement");

  let rows: CampaignDemographicRow[] = [];
  if (hasPlacement) {
    rows = buildPlacementRows(cells);
  } else if (hasAge && hasGender) {
    const ageSummaryCells = ageSummaryInsights
      .map(parseCell)
      .filter((cell): cell is DemographicCell => cell != null);
    rows = buildAgeGenderRows(cells, ageSummaryCells);
  } else if (hasAge) {
    rows = buildAgeRows(cells);
  } else if (hasGender) {
    rows = buildGenderRows(cells);
  }

  return { rows, total };
}
