import type { AdAccountKind, CampaignKpiKey, KpiDirection } from "../../types/types";

export type DefaultKpiSet = {
  primaryKpi: CampaignKpiKey;
  primaryDirection: KpiDirection;
  secondaryKpis: CampaignKpiKey[];
};

const KPI_LABELS: Record<CampaignKpiKey, string> = {
  cost_per_result: "Cost / result",
  results_per_day: "Results / day",
  ctr: "CTR",
  cpm: "CPM",
  frequency: "Frequency",
  roas: "ROAS",
  conversion_rate: "Conv. rate",
  search_impression_share: "Search IS",
};

const KPI_DIRECTION: Record<CampaignKpiKey, KpiDirection> = {
  cost_per_result: "lower",
  results_per_day: "higher",
  ctr: "higher",
  cpm: "lower",
  frequency: "lower",
  roas: "higher",
  conversion_rate: "higher",
  search_impression_share: "higher",
};

export function kpiLabel(key: CampaignKpiKey): string {
  return KPI_LABELS[key];
}

export function kpiDirection(key: CampaignKpiKey): KpiDirection {
  return KPI_DIRECTION[key];
}

/** Defaults from campaign objective / Google campaign type (PDF §7.1, simplified). */
export function defaultKpisForCampaign(
  platform: AdAccountKind,
  objective: string | null,
): DefaultKpiSet {
  const goal = (objective ?? "").toLowerCase();

  if (platform === "google_ads") {
    if (goal.includes("performance_max") || goal.includes("shopping")) {
      return {
        primaryKpi: "roas",
        primaryDirection: "higher",
        secondaryKpis: ["results_per_day", "ctr", "cost_per_result"],
      };
    }
    if (goal.includes("search") || goal.includes("lead")) {
      return {
        primaryKpi: "cost_per_result",
        primaryDirection: "lower",
        secondaryKpis: [
          "results_per_day",
          "ctr",
          "conversion_rate",
          "search_impression_share",
        ],
      };
    }
    return {
      primaryKpi: "cost_per_result",
      primaryDirection: "lower",
      secondaryKpis: ["results_per_day", "ctr", "cpm"],
    };
  }

  if (goal.includes("whatsapp") || goal.includes("message") || goal.includes("conversation")) {
    return {
      primaryKpi: "cost_per_result",
      primaryDirection: "lower",
      secondaryKpis: ["results_per_day", "ctr", "frequency", "cpm"],
    };
  }
  if (goal.includes("sales") || goal.includes("purchase") || goal.includes("conversion")) {
    return {
      primaryKpi: "roas",
      primaryDirection: "higher",
      secondaryKpis: ["results_per_day", "ctr", "frequency"],
    };
  }
  if (goal.includes("traffic") || goal.includes("link")) {
    return {
      primaryKpi: "cost_per_result",
      primaryDirection: "lower",
      secondaryKpis: ["ctr", "cpm", "frequency"],
    };
  }
  if (goal.includes("awareness") || goal.includes("reach") || goal.includes("engagement")) {
    return {
      primaryKpi: "cpm",
      primaryDirection: "lower",
      secondaryKpis: ["frequency", "ctr", "results_per_day"],
    };
  }

  return {
    primaryKpi: "cost_per_result",
    primaryDirection: "lower",
    secondaryKpis: ["results_per_day", "ctr", "frequency", "cpm"],
  };
}
